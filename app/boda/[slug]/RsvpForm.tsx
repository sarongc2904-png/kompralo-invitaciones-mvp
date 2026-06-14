"use client"
import { useState } from "react"

type Status = "CONFIRMED" | "DECLINED"

interface Props {
  slug: string
  accent: string
  bg: string
}

export function RsvpForm({ slug, accent, bg }: Props) {
  const [status, setStatus] = useState<Status | null>(null)
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [asistentes, setAsistentes] = useState(1)
  const [mensaje, setMensaje] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    if (!nombre.trim() || !status) {
      setError("Indica tu nombre y si podrás asistir.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/invitations/${slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, telefono, asistentes, status, mensaje }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Error al enviar.")
      }
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 bg-white/10 placeholder-white/40 border border-white/20"

  if (done) {
    return (
      <div className="text-center py-10 space-y-3">
        <div className="text-5xl">{status === "CONFIRMED" ? "🎉" : "💌"}</div>
        <p className="text-xl font-semibold" style={{ color: accent }}>
          {status === "CONFIRMED"
            ? "¡Gracias! Te esperamos con alegría."
            : "Gracias por avisarnos. Los llevaremos en el corazón."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Attendance choice */}
      <div className="grid grid-cols-2 gap-3">
        {(["CONFIRMED", "DECLINED"] as Status[]).map((s) => {
          const selected = status === s
          return (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className="py-4 rounded-xl font-semibold text-sm transition-all border-2"
              style={
                selected
                  ? { background: accent, color: bg, borderColor: accent }
                  : { background: "transparent", color: accent, borderColor: `${accent}50` }
              }
            >
              {s === "CONFIRMED" ? "✓ Asistiré" : "✗ No podré ir"}
            </button>
          )
        })}
      </div>

      {/* Fields */}
      <input
        type="text"
        placeholder="Tu nombre completo *"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className={inputClass}
        style={{ color: accent }}
      />

      {status === "CONFIRMED" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="email"
              placeholder="Email (opcional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              style={{ color: accent }}
            />
            <input
              type="tel"
              placeholder="Teléfono (opcional)"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className={inputClass}
              style={{ color: accent }}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm opacity-70 shrink-0" style={{ color: accent }}>
              ¿Cuántos asistirán?
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={asistentes}
              onChange={(e) => setAsistentes(Number(e.target.value))}
              className={`${inputClass} w-20`}
              style={{ color: accent }}
            />
          </div>
        </>
      )}

      <textarea
        rows={3}
        placeholder="Mensaje para los novios (opcional)"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        className={`${inputClass} resize-none`}
        style={{ color: accent }}
      />

      {error && (
        <p className="text-sm text-red-300">{error}</p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={loading}
        className="w-full py-4 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
        style={{ background: accent, color: bg }}
      >
        {loading ? "Enviando…" : "Confirmar respuesta"}
      </button>
    </div>
  )
}
