"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"

// ─── Types ──────────────────────────────────────────────────────────────────

type WeddingStyle = "JARDIN" | "CIELO" | "ARENA"

interface WeddingModules {
  countdown: boolean
  galeria: boolean
  confirmacion: boolean
  musica: boolean
  mapa: boolean
  historia: boolean
  qr: boolean
}

interface WeddingForm {
  style: WeddingStyle
  nombre1: string
  nombre2: string
  frase: string
  fecha: string
  hora: string
  lugar: string
  direccion: string
  mapsUrl: string
  musicaUrl: string
  dresscode: string
  regalos: string
  fotoportada: string
  fotos: string[]
  modules: WeddingModules
}

// ─── Style definitions ───────────────────────────────────────────────────────

const STYLES: Record<
  WeddingStyle,
  { nombre: string; descripcion: string; bg: string; accent: string; emoji: string }
> = {
  JARDIN: {
    nombre: "Jardín Secreto",
    descripcion: "Elegancia natural entre follaje y luz dorada",
    bg: "#1a2e1a",
    accent: "#c5a864",
    emoji: "🌿",
  },
  CIELO: {
    nombre: "Cielo Nocturno",
    descripcion: "Romanticismo bajo un manto de estrellas",
    bg: "#0c2240",
    accent: "#c0d2f0",
    emoji: "✨",
  },
  ARENA: {
    nombre: "Arena y Miel",
    descripcion: "Calidez y sofisticación en tonos tierra",
    bg: "#3d2a10",
    accent: "#e6be78",
    emoji: "🌾",
  },
}

// ─── Default photo placeholders (Unsplash) ───────────────────────────────────

const PLACEHOLDER_COVER =
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
const PLACEHOLDER_GALLERY = [
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&q=80",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?w=400&q=80",
  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80",
]

// ─── Initial form state ───────────────────────────────────────────────────────

const DEFAULT_FORM: WeddingForm = {
  style: "JARDIN",
  nombre1: "",
  nombre2: "",
  frase: "Y desde ese día, nuestra historia comenzó a escribirse",
  fecha: "",
  hora: "19:00",
  lugar: "",
  direccion: "",
  mapsUrl: "",
  musicaUrl: "",
  dresscode: "",
  regalos: "",
  fotoportada: PLACEHOLDER_COVER,
  fotos: [...PLACEHOLDER_GALLERY],
  modules: {
    countdown: true,
    galeria: true,
    confirmacion: true,
    musica: false,
    mapa: false,
    historia: false,
    qr: false,
  },
}

const STEP_LABELS = ["Estilo", "Datos", "Fotos", "Extras", "Preview", "Pago"]

const MODULE_OPTIONS: {
  key: keyof WeddingModules
  label: string
  desc: string
  icon: string
}[] = [
  { key: "countdown", label: "Cuenta regresiva", desc: "Días que faltan para la boda", icon: "⏳" },
  { key: "galeria", label: "Galería de fotos", desc: "Carrusel con tus fotos", icon: "📸" },
  { key: "confirmacion", label: "Confirmación de asistencia", desc: "Formulario RSVP digital", icon: "✅" },
  { key: "musica", label: "Música de fondo", desc: "Reproduce una canción al abrir", icon: "🎵" },
  { key: "mapa", label: "Mapa interactivo", desc: "Botón de «Cómo llegar»", icon: "📍" },
  { key: "historia", label: "Historia de amor", desc: "Línea de tiempo de su historia", icon: "💌" },
  { key: "qr", label: "Código QR", desc: "QR único para cada invitado", icon: "🔲" },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(fechaStr: string) {
  if (!fechaStr) return ""
  return new Date(fechaStr + "T12:00:00").toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function activeModuleCount(modules: WeddingModules) {
  return Object.values(modules).filter(Boolean).length
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CrearWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<WeddingForm>(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  // "cover" | gallery index | null
  const [uploading, setUploading] = useState<"cover" | number | null>(null)

  const coverInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const currentStyle = STYLES[form.style]

  function set<K extends keyof WeddingForm>(field: K, value: WeddingForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function setModule(key: keyof WeddingModules, value: boolean) {
    setForm((prev) => ({ ...prev, modules: { ...prev.modules, [key]: value } }))
  }

  function validateStep(): string | null {
    if (step === 2) {
      if (!form.nombre1.trim()) return "Ingresa el nombre del/la novio/a 1."
      if (!form.nombre2.trim()) return "Ingresa el nombre del/la novio/a 2."
      if (!form.fecha) return "Selecciona la fecha de la boda."
      if (!form.hora) return "Indica la hora del evento."
      if (!form.lugar.trim()) return "Ingresa el nombre del lugar o salón."
    }
    return null
  }

  function next() {
    const err = validateStep()
    if (err) { setValidationError(err); return }
    setValidationError(null)
    setStep((s) => Math.min(s + 1, 6))
  }

  function prev() {
    setValidationError(null)
    setStep((s) => Math.max(s - 1, 1))
  }

  async function handlePago(provider: "stripe" | "mercadopago") {
    setLoading(true)
    setError(null)
    try {
      const draftRes = await fetch("/api/wedding/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const draftData = await draftRes.json()
      if (!draftRes.ok) throw new Error(draftData.error || "No se pudo guardar la invitación.")

      const checkoutRes = await fetch("/api/wedding/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId: draftData.id, provider }),
      })
      const checkoutData = await checkoutRes.json()
      if (!checkoutRes.ok) throw new Error(checkoutData.error || "No se pudo crear el pago.")

      window.location.href = checkoutData.url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado. Intenta de nuevo.")
      setLoading(false)
    }
  }

  async function uploadPhoto(file: File, target: "cover" | number) {
    setUploading(target)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error al subir la foto.")
      if (target === "cover") {
        set("fotoportada", data.url)
      } else {
        const updated = [...form.fotos]
        updated[target] = data.url
        set("fotos", updated)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen.")
    } finally {
      setUploading(null)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Progress bar ── */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center">
            {STEP_LABELS.map((label, i) => {
              const n = i + 1
              const done = step > n
              const active = step === n
              return (
                <div key={n} className="flex items-center flex-1">
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        done
                          ? "bg-green-500 text-white"
                          : active
                          ? "bg-gray-900 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {done ? "✓" : n}
                    </div>
                    <span
                      className={`text-xs mt-1 hidden sm:block whitespace-nowrap ${
                        active ? "text-gray-900 font-medium" : "text-gray-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < 5 && (
                    <div
                      className={`h-0.5 flex-1 mx-1 transition-colors ${
                        done ? "bg-green-400" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Step content ── */}
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">

        {/* ── Step 1: Estilo ── */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Elige el estilo de tu invitación</h1>
            <p className="text-gray-500 mb-8">Selecciona el tema visual que más represente su boda.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(Object.keys(STYLES) as WeddingStyle[]).map((key) => {
                const s = STYLES[key]
                const selected = form.style === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => set("style", key)}
                    className="relative rounded-2xl overflow-hidden text-left transition-all focus:outline-none"
                    style={{
                      boxShadow: selected
                        ? `0 0 0 4px ${s.accent}, 0 8px 32px rgba(0,0,0,0.2)`
                        : "0 2px 8px rgba(0,0,0,0.08)",
                      transform: selected ? "scale(1.03)" : "scale(1)",
                    }}
                  >
                    <div
                      style={{ background: s.bg }}
                      className="p-6 min-h-[210px] flex flex-col justify-between"
                    >
                      {selected && (
                        <div
                          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ background: s.accent, color: s.bg }}
                        >
                          ✓
                        </div>
                      )}
                      <div>
                        <div className="text-3xl mb-3">{s.emoji}</div>
                        <div className="font-bold text-lg" style={{ color: s.accent }}>
                          {s.nombre}
                        </div>
                        <div className="text-xs mt-1 opacity-70" style={{ color: s.accent }}>
                          {s.descripcion}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-5">
                        <div
                          className="w-5 h-5 rounded-full border-2"
                          style={{ background: s.bg, borderColor: `${s.accent}40` }}
                        />
                        <div
                          className="w-5 h-5 rounded-full border-2"
                          style={{ background: s.accent, borderColor: `${s.accent}60` }}
                        />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Step 2: Datos ── */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Datos de la boda</h1>
            <p className="text-gray-500 mb-8">Esta información aparecerá en la invitación.</p>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ana Sofía"
                    value={form.nombre1}
                    onChange={(e) => set("nombre1", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre 2 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Carlos Eduardo"
                    value={form.nombre2}
                    onChange={(e) => set("nombre2", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frase de la pareja</label>
                <textarea
                  rows={2}
                  placeholder="Y desde ese día, nuestra historia comenzó a escribirse"
                  value={form.frase}
                  onChange={(e) => set("frase", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.fecha}
                    onChange={(e) => set("fecha", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={form.hora}
                    onChange={(e) => set("hora", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lugar / Salón <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Hacienda San Miguel"
                  value={form.lugar}
                  onChange={(e) => set("lugar", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección completa</label>
                <input
                  type="text"
                  placeholder="Calle Rosales 145, Col. Jardines, CDMX"
                  value={form.direccion}
                  onChange={(e) => set("direccion", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código de vestimenta
                  </label>
                  <input
                    type="text"
                    placeholder="Formal. No blanco."
                    value={form.dresscode}
                    onChange={(e) => set("dresscode", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mesa de regalos
                  </label>
                  <input
                    type="text"
                    placeholder="Liverpool · No. 1234567"
                    value={form.regalos}
                    onChange={(e) => set("regalos", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Fotos ── */}
        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Fotos de su historia</h1>
            <p className="text-gray-500 mb-8">
              Sube tus fotos desde el dispositivo o pega una URL. Máximo 5 MB por imagen.
            </p>

            {/* ── Cover photo ── */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Foto de portada</label>

              {/* Hidden file input */}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) uploadPhoto(file, "cover")
                  e.target.value = ""
                }}
              />

              {/* Clickable image area */}
              <div
                className="group relative rounded-xl overflow-hidden h-56 bg-gray-100 mb-2 cursor-pointer"
                onClick={() => coverInputRef.current?.click()}
              >
                <img
                  src={form.fotoportada || PLACEHOLDER_COVER}
                  alt="Portada"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_COVER }}
                />

                {/* Hover / loading overlay */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity ${
                  uploading === "cover" ? "opacity-100 bg-black/50" : "opacity-0 group-hover:opacity-100 bg-black/40"
                }`}>
                  {uploading === "cover" ? (
                    <span className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                      </svg>
                      <span className="text-white text-sm font-semibold drop-shadow">Cambiar foto</span>
                    </>
                  )}
                </div>

                {/* Bottom label */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3 pointer-events-none">
                  <span className="text-white text-xs">Foto principal · aparece en el encabezado</span>
                </div>
              </div>

              {/* URL fallback */}
              <input
                type="url"
                placeholder="O pega una URL (https://...)"
                value={form.fotoportada}
                onChange={(e) => set("fotoportada", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            {/* ── Gallery ── */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Galería — hasta 6 fotos
              </label>
              <div className="grid grid-cols-3 gap-3">
                {form.fotos.map((url, i) => (
                  <div key={i} className="space-y-1.5">
                    {/* Hidden file input per slot */}
                    <input
                      ref={(el) => { galleryInputRefs.current[i] = el }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) uploadPhoto(file, i)
                        e.target.value = ""
                      }}
                    />

                    {/* Clickable image */}
                    <div
                      className="group relative rounded-lg overflow-hidden h-28 bg-gray-100 cursor-pointer"
                      onClick={() => galleryInputRefs.current[i]?.click()}
                    >
                      <img
                        src={url || PLACEHOLDER_GALLERY[i]}
                        alt={`Foto ${i + 1}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_GALLERY[i] }}
                      />

                      {/* Hover / loading overlay */}
                      <div className={`absolute inset-0 flex flex-col items-center justify-center gap-1 transition-opacity ${
                        uploading === i ? "opacity-100 bg-black/50" : "opacity-0 group-hover:opacity-100 bg-black/40"
                      }`}>
                        {uploading === i ? (
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <svg className="w-5 h-5 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                            </svg>
                            <span className="text-white text-[10px] font-semibold drop-shadow">Cambiar</span>
                          </>
                        )}
                      </div>

                      {/* Slot number */}
                      <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/40 text-white text-xs flex items-center justify-center font-bold pointer-events-none">
                        {i + 1}
                      </div>
                    </div>

                    {/* URL fallback */}
                    <input
                      type="url"
                      placeholder="O pega URL..."
                      value={url}
                      onChange={(e) => {
                        const updated = [...form.fotos]
                        updated[i] = e.target.value
                        set("fotos", updated)
                      }}
                      className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Extras / Modules ── */}
        {step === 4 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Módulos adicionales</h1>
            <p className="text-gray-500 mb-8">
              Activa las secciones que quieres en tu invitación. Puedes cambiarlos después.
            </p>

            <div className="space-y-3">
              {MODULE_OPTIONS.map(({ key, label, desc, icon }) => {
                const active = form.modules[key]
                return (
                  <div
                    key={key}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
                      active
                        ? "border-gray-900 bg-gray-900"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                    onClick={() => setModule(key, !active)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <div className={`font-semibold text-sm ${active ? "text-white" : "text-gray-800"}`}>
                          {label}
                        </div>
                        <div className={`text-xs ${active ? "text-gray-300" : "text-gray-500"}`}>{desc}</div>
                      </div>
                    </div>
                    {/* Toggle pill */}
                    <div
                      className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors shrink-0 ${
                        active ? "bg-white" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full transition-transform shadow-sm ${
                          active ? "translate-x-5 bg-gray-900" : "translate-x-0 bg-white"
                        }`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Conditional extra inputs */}
            {form.modules.musica && (
              <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">URL del archivo de música (mp3)</label>
                <input
                  type="url"
                  placeholder="https://... (archivo .mp3)"
                  value={form.musicaUrl}
                  onChange={(e) => set("musicaUrl", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            )}

            {form.modules.mapa && (
              <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">Link de Google Maps</label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/..."
                  value={form.mapsUrl}
                  onChange={(e) => set("mapsUrl", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            )}
          </div>
        )}

        {/* ── Step 5: Preview ── */}
        {step === 5 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Vista previa</h1>
            <p className="text-gray-500 mb-8">
              Así se verá tu invitación en el celular de tus invitados.
            </p>

            <div className="flex justify-center">
              {/* Phone shell */}
              <div className="relative">
                <div className="w-72 rounded-[3rem] overflow-hidden border-[10px] border-gray-800 shadow-2xl bg-gray-800">
                  {/* Notch */}
                  <div className="h-6 flex justify-center items-center bg-gray-800">
                    <div className="w-20 h-3 rounded-full bg-gray-900" />
                  </div>

                  {/* Screen */}
                  <div
                    className="overflow-y-auto scrollbar-hide"
                    style={{ maxHeight: 560, background: currentStyle.bg }}
                  >
                    {/* Hero / cover */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={form.fotoportada || PLACEHOLDER_COVER}
                        alt="Portada"
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(to bottom, transparent 40%, ${currentStyle.bg})` }}
                      />
                    </div>

                    {/* Content */}
                    <div className="px-5 py-5 text-center space-y-4">
                      {/* Subtitle */}
                      <p
                        className="text-xs uppercase tracking-widest opacity-60"
                        style={{ color: currentStyle.accent }}
                      >
                        nos casamos
                      </p>

                      {/* Names */}
                      <div>
                        <p className="text-xl font-bold" style={{ color: currentStyle.accent }}>
                          {form.nombre1 || "Ana Sofía"}
                        </p>
                        <p className="text-sm opacity-40 my-0.5" style={{ color: currentStyle.accent }}>
                          &amp;
                        </p>
                        <p className="text-xl font-bold" style={{ color: currentStyle.accent }}>
                          {form.nombre2 || "Carlos Eduardo"}
                        </p>
                      </div>

                      {/* Frase */}
                      {form.frase && (
                        <p className="text-xs italic px-3 opacity-65" style={{ color: currentStyle.accent }}>
                          &ldquo;{form.frase}&rdquo;
                        </p>
                      )}

                      {/* Divider */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-px opacity-20" style={{ background: currentStyle.accent }} />
                        <span className="text-xs" style={{ color: currentStyle.accent }}>♥</span>
                        <div className="flex-1 h-px opacity-20" style={{ background: currentStyle.accent }} />
                      </div>

                      {/* Date / venue */}
                      <div className="space-y-1.5">
                        {form.fecha && (
                          <p className="text-xs font-semibold" style={{ color: currentStyle.accent }}>
                            {formatDate(form.fecha)}
                          </p>
                        )}
                        {form.hora && (
                          <p className="text-xs opacity-60" style={{ color: currentStyle.accent }}>
                            {form.hora} hrs
                          </p>
                        )}
                        {form.lugar && (
                          <p className="text-xs font-medium" style={{ color: currentStyle.accent }}>
                            {form.lugar}
                          </p>
                        )}
                        {form.direccion && (
                          <p className="text-xs opacity-50" style={{ color: currentStyle.accent }}>
                            {form.direccion}
                          </p>
                        )}
                      </div>

                      {/* Active module chips */}
                      {activeModuleCount(form.modules) > 0 && (
                        <div className="flex flex-wrap gap-1 justify-center">
                          {(Object.keys(form.modules) as (keyof WeddingModules)[])
                            .filter((k) => form.modules[k])
                            .map((k) => {
                              const opt = MODULE_OPTIONS.find((m) => m.key === k)
                              return (
                                <span
                                  key={k}
                                  className="text-[10px] px-2 py-0.5 rounded-full border"
                                  style={{
                                    borderColor: `${currentStyle.accent}50`,
                                    color: currentStyle.accent,
                                  }}
                                >
                                  {opt?.icon} {opt?.label}
                                </span>
                              )
                            })}
                        </div>
                      )}

                      {/* RSVP CTA */}
                      {form.modules.confirmacion && (
                        <button
                          className="w-full py-2 rounded-full text-xs font-bold"
                          style={{ background: currentStyle.accent, color: currentStyle.bg }}
                        >
                          Confirmar asistencia
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Home indicator */}
                  <div className="h-5 flex justify-center items-center bg-gray-800">
                    <div className="w-20 h-1 rounded-full bg-gray-600" />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-5">
              Vista previa aproximada. El diseño final puede variar ligeramente.
            </p>
          </div>
        )}

        {/* ── Step 6: Pago ── */}
        {step === 6 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Confirmar y pagar</h1>
            <p className="text-gray-500 mb-6">
              Al completar el pago tu invitación queda lista para compartir con tus invitados.
            </p>

            {/* Resumen */}
            <div className="border border-gray-200 rounded-2xl p-5 mb-6 bg-white">
              <h2 className="font-semibold text-gray-800 mb-4">Resumen</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: currentStyle.bg }}
                  >
                    {currentStyle.emoji}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{currentStyle.nombre}</p>
                    <p className="text-xs text-gray-500">Estilo visual</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-xl shrink-0">
                    💍
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {form.nombre1 || "—"} &amp; {form.nombre2 || "—"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {form.fecha ? formatDate(form.fecha) : "Fecha no definida"} &middot;{" "}
                      {form.lugar || "Sin lugar"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl shrink-0">
                    🧩
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {activeModuleCount(form.modules)} módulos activos
                    </p>
                    <p className="text-xs text-gray-500">
                      {(Object.keys(form.modules) as (keyof WeddingModules)[])
                        .filter((k) => form.modules[k])
                        .map((k) => MODULE_OPTIONS.find((m) => m.key === k)?.label)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t mt-4 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Invitación de Boda Premium</p>
                  <p className="text-3xl font-bold text-gray-900">
                    $799 <span className="text-base font-normal text-gray-500">MXN</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 line-through">$1,299</p>
                  <p className="text-xs text-green-600 font-semibold">Pago único</p>
                  <p className="text-xs text-green-600 font-semibold">✓ Acceso permanente</p>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">
                {error}
              </div>
            )}

            {/* Payment buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handlePago("stripe")}
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-white bg-gray-900 hover:bg-gray-800 active:scale-[.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                    Pagar con tarjeta · Stripe
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handlePago("mercadopago")}
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-gray-900 bg-[#ffe600] hover:bg-yellow-300 active:scale-[.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <path fill="#ffe600" d="M8 12h8M12 8v8"/>
                </svg>
                Pagar con MercadoPago
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              Pago 100% seguro. Al pagar aceptas nuestros términos de servicio.
            </p>
          </div>
        )}

        {/* ── Validation error ── */}
        {validationError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
            {validationError}
          </div>
        )}
      </div>

      {/* ── Navigation bar (fixed bottom) ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={step === 1}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-30 transition-colors"
          >
            ← Atrás
          </button>

          <span className="text-xs text-gray-400">
            Paso {step} de {STEP_LABELS.length}
          </span>

          {step < 6 ? (
            <button
              type="button"
              onClick={next}
              className="px-7 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Siguiente →
            </button>
          ) : (
            <div className="w-24" /> /* spacer so the progress indicator stays centered */
          )}
        </div>
      </div>
    </div>
  )
}
