"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, BadgeCheck, CreditCard, Eye, ImagePlus, LinkIcon, Music2, UploadCloud } from "lucide-react";
import { categories } from "@/lib/categories";

type FormState = {
  nombre: string;
  whatsapp: string;
  correo: string;
  tipoEvento: string;
  festejado: string;
  tituloPrincipal: string;
  subtitulo: string;
  mensajeBienvenida: string;
  mensajeFinal: string;
  fecha: string;
  hora: string;
  direccion: string;
  googleMaps: string;
  musica: string;
  dressCode: string;
  mesaRegalos: string;
  imagenPrincipal: string;
  imagenGaleria1: string;
  imagenGaleria2: string;
  imagenGaleria3: string;
  mensajeWhatsapp: string;
  comentarios: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  nombre: "",
  whatsapp: "",
  correo: "",
  tipoEvento: "XV años",
  festejado: "",
  tituloPrincipal: "",
  subtitulo: "",
  mensajeBienvenida: "",
  mensajeFinal: "",
  fecha: "",
  hora: "",
  direccion: "",
  googleMaps: "",
  musica: "",
  dressCode: "",
  mesaRegalos: "",
  imagenPrincipal: "",
  imagenGaleria1: "",
  imagenGaleria2: "",
  imagenGaleria3: "",
  mensajeWhatsapp: "",
  comentarios: ""
};

const babyShowerDefaults: Partial<FormState> = {
  tipoEvento: "Baby Shower",
  festejado: "Isabella",
  tituloPrincipal: "Isabella viene en camino",
  subtitulo: "Una tarde dulce para celebrar la llegada de nuestra bebé.",
  mensajeBienvenida: "Antes de tenerla en brazos, queremos reunir a quienes ya la quieren.",
  mensajeFinal: "Gracias por formar parte de esta espera tan especial.",
  dressCode: "Rosa blush, blanco, beige o champagne",
  imagenPrincipal: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1400&q=86",
  imagenGaleria1: "https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=1100&q=84",
  imagenGaleria2: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=84",
  imagenGaleria3: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=84",
  mensajeWhatsapp: "Hola, quiero confirmar mi asistencia."
};

const babyShowerMusicOptions = [
  {
    title: "Dulce Espera",
    description: "Melodía suave y emotiva para una bienvenida delicada.",
    src: "/music/baby-shower/baby-1.mp3"
  },
  {
    title: "Sueño de Bebé",
    description: "Ambiente tierno, cálido y familiar para abrir la invitación.",
    src: "/music/baby-shower/baby-2.mp3"
  },
  {
    title: "Pequeña Bendición",
    description: "Una opción dulce y luminosa para celebrar su llegada.",
    src: "/music/baby-shower/baby-3.mp3"
  }
];

export function EventForm() {
  const searchParams = useSearchParams();
  const selectedModel = searchParams.get("modelo");
  const isBabyShowerModel = selectedModel?.startsWith("baby-");
  const [form, setForm] = useState<FormState>({
    ...initialState,
    ...(isBabyShowerModel ? babyShowerDefaults : {})
  });
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showValidationSummary, setShowValidationSummary] = useState(false);

  const imageUrls = useMemo(
    () => [form.imagenPrincipal, form.imagenGaleria1, form.imagenGaleria2, form.imagenGaleria3].filter(Boolean),
    [form.imagenPrincipal, form.imagenGaleria1, form.imagenGaleria2, form.imagenGaleria3]
  );

  const payHref = selectedModel ? `/precios?modelo=${encodeURIComponent(selectedModel)}&borrador=1` : "/precios?borrador=1";
  const showBabyMusicOptions = form.tipoEvento === "Baby Shower" || isBabyShowerModel;

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validateForm() {
    const nextErrors: FormErrors = {};
    const requiredFields: Array<[keyof FormState, string]> = [
      ["nombre", "Escribe el nombre del cliente."],
      ["whatsapp", "Agrega un WhatsApp para dar seguimiento."],
      ["correo", "Agrega un correo válido."],
      ["festejado", "Escribe el nombre de la bebé o festejado."],
      ["fecha", "Selecciona la fecha del evento."],
      ["hora", "Selecciona la hora del evento."],
      ["direccion", "Escribe la dirección del evento."]
    ];

    for (const [field, message] of requiredFields) {
      if (!form[field].trim()) {
        nextErrors[field] = message;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.correo.trim() && !emailRegex.test(form.correo.trim())) {
      nextErrors.correo = "El correo debe tener un formato válido. Ejemplo: nombre@email.com";
    }

    const phoneDigits = form.whatsapp.replace(/\D/g, "");
    if (form.whatsapp.trim() && phoneDigits.length < 10) {
      nextErrors.whatsapp = "El WhatsApp debe tener al menos 10 dígitos.";
    }

    const urlFields: Array<[keyof FormState, string]> = [
      ["imagenPrincipal", "Sube una imagen o pega una liga válida."],
      ["imagenGaleria1", "Sube una imagen o pega una liga válida."],
      ["imagenGaleria2", "Sube una imagen o pega una liga válida."],
      ["imagenGaleria3", "Sube una imagen o pega una liga válida."]
    ];

    for (const [field, message] of urlFields) {
      const value = form[field].trim();
      if (value && !isValidImageSource(value)) {
        nextErrors[field] = message;
      }
    }

    setErrors(nextErrors);
    setShowValidationSummary(Object.keys(nextErrors).length > 0);
    return nextErrors;
  }

  function saveDraft() {
    try {
      // Create a copy of the form data for local storage and strip large base64 strings to prevent QuotaExceededError
      const sanitizedForm = { ...form };
      const imageFields: Array<keyof FormState> = ["imagenPrincipal", "imagenGaleria1", "imagenGaleria2", "imagenGaleria3"];
      imageFields.forEach((field) => {
        if (sanitizedForm[field]?.startsWith("data:image/")) {
          sanitizedForm[field] = ""; // Strip local base64 images from draft
        }
      });

      window.localStorage.setItem(
        "kompralo-invitacion-borrador",
        JSON.stringify({
          ...sanitizedForm,
          modelo: selectedModel,
          imageUrls: [
            sanitizedForm.imagenPrincipal,
            sanitizedForm.imagenGaleria1,
            sanitizedForm.imagenGaleria2,
            sanitizedForm.imagenGaleria3
          ].filter(Boolean),
          photos: files.map((file) => ({ name: file.name, size: file.size, type: file.type })),
          updatedAt: new Date().toISOString()
        })
      );
    } catch (error) {
      console.error("Failed to save draft to localStorage:", error);
    }
  }

  function onPreview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      window.requestAnimationFrame(() => {
        document.querySelector('[data-field-error="true"]')?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      });
      return;
    }

    saveDraft();
    setPreview(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (preview) {
    return (
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <aside className="rounded-[1.35rem] border border-ink/10 bg-white p-6 shadow-glow">
          <div className="flex items-start gap-3">
            <BadgeCheck className="mt-1 shrink-0 text-emerald" size={24} />
            <div>
              <p className="font-display text-3xl leading-none text-ink">Borrador listo</p>
              <p className="mt-3 text-sm leading-6 text-ink/64">
                Esta es una previsualización. Para finalizar, guardar tu compra y desbloquear el editor completo, el siguiente paso es pagar.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 text-sm">
            <Summary label="Cliente" value={form.nombre} />
            <Summary label="Evento" value={form.tipoEvento} />
            <Summary label="Festejado" value={form.festejado} />
            <Summary label="Fecha y hora" value={`${form.fecha || "Fecha pendiente"} ${form.hora || ""}`} />
            <Summary label="Ubicación" value={form.direccion} />
            <Summary label="WhatsApp" value={form.whatsapp} />
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setPreview(false)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-black text-ink transition hover:border-gold"
            >
              <ArrowLeft size={17} />
              Editar datos
            </button>
            <Link
              href={payHref}
              onClick={saveDraft}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-black text-white transition hover:bg-emerald"
            >
              <CreditCard size={18} />
              Finalizar y pagar
            </Link>
          </div>
        </aside>

        <section className="overflow-hidden rounded-[1.5rem] bg-ink p-3 shadow-[0_30px_90px_rgba(17,17,20,0.22)]">
          <div
            className="relative min-h-[620px] overflow-hidden rounded-[1.15rem] bg-cover bg-center"
            style={{ backgroundImage: `url(${form.imagenPrincipal || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=86"})` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,10,0.18),rgba(8,8,10,0.84))]" />
            <div className="relative flex min-h-[620px] flex-col justify-end p-6 text-white sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.32em] text-gold">{form.tipoEvento}</p>
              <h2 className="mt-4 font-display text-5xl leading-none sm:text-7xl">
                {form.tituloPrincipal || `${form.festejado || "Tu evento"} merece una invitación especial`}
              </h2>
              <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-white/82">
                {form.subtitulo || "Una experiencia digital elegante para compartir con tus invitados."}
              </p>
              <div className="mt-8 grid gap-3 rounded-[1.1rem] border border-gold/35 bg-black/35 p-5 backdrop-blur-xl sm:grid-cols-3">
                <Summary label="Fecha" value={form.fecha || "Por definir"} light />
                <Summary label="Hora" value={form.hora || "Por definir"} light />
                <Summary label="Lugar" value={form.direccion || "Por definir"} light />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onPreview} className="grid gap-5 rounded-[1.35rem] bg-white p-5 shadow-glow luxury-border sm:p-8">
      <div className="rounded-[1rem] bg-champagne/50 p-4 luxury-border">
        <p className="font-display text-2xl text-ink">Paso 1: crea tu borrador</p>
        <p className="mt-2 text-sm leading-6 text-ink/62">
          Puedes previsualizar tu invitación sin pagar. El pago solo aparece antes de finalizar y desbloquear el editor completo.
        </p>
      </div>

      {showValidationSummary ? (
        <div className="rounded-[1rem] border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700">
          Revisa los campos marcados en rojo. Te indicamos exactamente qué dato falta o qué formato corregir.
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Input label="Nombre del cliente" value={form.nombre} onChange={(value) => updateField("nombre", value)} error={errors.nombre} required />
        <Input label="WhatsApp" value={form.whatsapp} onChange={(value) => updateField("whatsapp", value)} error={errors.whatsapp} required />
        <Input label="Correo" type="email" value={form.correo} onChange={(value) => updateField("correo", value)} error={errors.correo} required />
        <label className="text-sm font-semibold text-ink">
          Tipo de evento
          <select
            value={form.tipoEvento}
            onChange={(event) => updateField("tipoEvento", event.target.value)}
            className="mt-2 w-full rounded-md border border-ink/12 bg-pearl px-4 py-3 outline-none transition focus:border-gold"
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <Input label="Nombre de la bebé / festejado" value={form.festejado} onChange={(value) => updateField("festejado", value)} error={errors.festejado} required />
        <Input label="Título principal" value={form.tituloPrincipal} onChange={(value) => updateField("tituloPrincipal", value)} placeholder="Ej. Isabella viene en camino" />
        <Input label="Subtítulo de portada" value={form.subtitulo} onChange={(value) => updateField("subtitulo", value)} placeholder="Texto emocional de bienvenida" />
        <Input label="Fecha" type="date" value={form.fecha} onChange={(value) => updateField("fecha", value)} error={errors.fecha} required />
        <Input label="Hora" type="time" value={form.hora} onChange={(value) => updateField("hora", value)} error={errors.hora} required />
        <Input label="Dirección" value={form.direccion} onChange={(value) => updateField("direccion", value)} error={errors.direccion} required />
        <Input label="Google Maps (opcional)" value={form.googleMaps} onChange={(value) => updateField("googleMaps", value)} error={errors.googleMaps} placeholder="Liga de Google Maps o pendiente" />
        {showBabyMusicOptions ? (
          <BabyShowerMusicSelect value={form.musica} onChange={(value) => updateField("musica", value)} />
        ) : (
          <Input label="Música (opcional)" value={form.musica} onChange={(value) => updateField("musica", value)} error={errors.musica} placeholder="Liga de canción, nombre de canción o Sin música" />
        )}
        <Input label="Dress Code" value={form.dressCode} onChange={(value) => updateField("dressCode", value)} />
        <Input label="Mesa de regalos (opcional)" value={form.mesaRegalos} onChange={(value) => updateField("mesaRegalos", value)} error={errors.mesaRegalos} placeholder="Liga, tienda, numero de evento o Sin mesa" />
        <ImageUploadField label="Imagen principal" value={form.imagenPrincipal} onChange={(value) => updateField("imagenPrincipal", value)} error={errors.imagenPrincipal} />
        <ImageUploadField label="Imagen galería 1" value={form.imagenGaleria1} onChange={(value) => updateField("imagenGaleria1", value)} error={errors.imagenGaleria1} />
        <ImageUploadField label="Imagen galería 2" value={form.imagenGaleria2} onChange={(value) => updateField("imagenGaleria2", value)} error={errors.imagenGaleria2} />
        <ImageUploadField label="Imagen galería 3" value={form.imagenGaleria3} onChange={(value) => updateField("imagenGaleria3", value)} error={errors.imagenGaleria3} />
        <Input label="Mensaje WhatsApp" value={form.mensajeWhatsapp} onChange={(value) => updateField("mensajeWhatsapp", value)} placeholder="Mensaje automático para confirmar" />
      </div>

      <Textarea label="Mensaje de bienvenida" value={form.mensajeBienvenida} onChange={(value) => updateField("mensajeBienvenida", value)} placeholder="Texto que aparecerá en la invitación..." />
      <Textarea label="Mensaje final" value={form.mensajeFinal} onChange={(value) => updateField("mensajeFinal", value)} rows={3} placeholder="Texto de cierre para tus invitados..." />
      <Textarea label="Comentarios internos" value={form.comentarios} onChange={(value) => updateField("comentarios", value)} placeholder="Detalles especiales, tono, colores, frases, referencias..." />

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gold/70 bg-champagne/50 px-4 py-8 text-center transition hover:bg-champagne">
        <UploadCloud className="text-gold" size={34} />
        <span className="mt-3 text-sm font-bold text-ink">Subida de fotografías</span>
        <span className="mt-1 text-xs text-ink/56">{files.length ? `${files.length} archivo(s) seleccionado(s)` : "JPG, PNG o WEBP"}</span>
        <input type="file" multiple accept="image/*" className="sr-only" onChange={(event) => setFiles(Array.from(event.target.files ?? []))} />
      </label>

      <button className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-5 py-4 text-sm font-bold text-pearl transition hover:-translate-y-0.5 hover:bg-emerald">
        <Eye size={18} />
        Previsualizar invitación
      </button>
    </form>
  );
}

function isValidImageSource(value: string) {
  if (value.startsWith("data:image/")) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function ImageUploadField({
  label,
  value,
  onChange,
  error
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const inputId = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const hasImage = value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:image/");

  function uploadImage(file?: File) {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  }

  return (
    <div className="text-sm font-semibold text-ink" data-field-error={error ? "true" : undefined}>
      <span>{label}</span>
      <div
        className={[
          "mt-2 overflow-hidden rounded-xl border bg-pearl transition",
          error ? "border-red-500 ring-2 ring-red-100" : "border-ink/12 hover:border-gold/70"
        ].join(" ")}
      >
        <label className="flex min-h-[156px] cursor-pointer flex-col items-center justify-center px-4 py-5 text-center">
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={label} className="mb-4 h-32 w-full rounded-lg object-cover shadow-[0_16px_35px_rgba(17,17,20,0.1)]" />
          ) : (
            <span className="mb-3 inline-flex size-14 items-center justify-center rounded-full bg-white text-gold shadow-[0_14px_34px_rgba(17,17,20,0.08)]">
              <ImagePlus size={28} />
            </span>
          )}
          <span className="text-base font-black text-ink">{hasImage ? "Cambiar imagen" : "Subir tu imagen"}</span>
          <span className="mt-1 text-xs font-bold text-ink/50">JPG, PNG o WEBP</span>
          <input id={inputId} type="file" accept="image/*" className="sr-only" onChange={(event) => uploadImage(event.target.files?.[0])} />
        </label>
        <div className="border-t border-ink/8 bg-white/55 p-3">
          <label className="flex items-center gap-2 rounded-lg border border-ink/10 bg-white px-3 py-2">
            <LinkIcon size={16} className="shrink-0 text-gold" />
            <input
              value={value.startsWith("data:image/") ? "" : value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="O pega aquí una URL de imagen"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${inputId}-error` : undefined}
              className="w-full bg-transparent text-sm font-bold text-ink outline-none placeholder:text-ink/35"
            />
          </label>
        </div>
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="mt-2 text-xs font-bold leading-5 text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function BabyShowerMusicSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="md:col-span-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-ink">Música para Baby Shower</p>
          <p className="mt-1 text-xs font-bold leading-5 text-ink/52">Elige una melodía para acompañar la invitación. También puedes dejarla sin música.</p>
        </div>
        <span className="hidden rounded-full bg-champagne px-3 py-1 text-[0.66rem] font-black uppercase tracking-[0.18em] text-gold sm:inline-flex">
          3 opciones
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {babyShowerMusicOptions.map((option, index) => {
          const selected = value === option.src;

          return (
            <div
              key={option.src}
              className={[
                "rounded-2xl border bg-pearl p-4 transition",
                selected ? "border-gold ring-2 ring-gold/18" : "border-ink/10 hover:border-gold/60"
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <span className={["inline-flex size-11 shrink-0 items-center justify-center rounded-full", selected ? "bg-gold text-ink" : "bg-white text-gold"].join(" ")}>
                  <Music2 size={22} />
                </span>
                <div>
                  <p className="font-display text-xl leading-none text-ink">{option.title}</p>
                  <p className="mt-2 text-xs font-semibold leading-5 text-ink/56">{option.description}</p>
                </div>
              </div>

              <audio controls preload="none" className="mt-4 h-9 w-full">
                <source src={option.src} type="audio/mpeg" />
              </audio>

              <button
                type="button"
                onClick={() => onChange(option.src)}
                className={[
                  "mt-4 w-full rounded-full px-4 py-3 text-sm font-black transition",
                  selected ? "bg-emerald text-white" : "bg-ink text-white hover:bg-gold hover:text-ink"
                ].join(" ")}
              >
                {selected ? "Canción seleccionada" : `Elegir canción ${index + 1}`}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => onChange("Sin música")}
          className={[
            "rounded-full border px-4 py-2 text-xs font-black transition",
            value === "Sin música" ? "border-ink bg-ink text-white" : "border-ink/10 bg-white text-ink hover:border-gold"
          ].join(" ")}
        >
          Sin música
        </button>
        <label className="flex flex-1 items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-xs font-black text-ink">
          O pega una liga propia
          <input
            value={value.startsWith("/music/baby-shower/") || value === "Sin música" ? "" : value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://..."
            className="min-w-0 flex-1 bg-transparent font-bold outline-none placeholder:text-ink/30"
          />
        </label>
      </div>
    </div>
  );
}

function Summary({ label, value, light = false }: { label: string; value: string; light?: boolean }) {
  return (
    <div>
      <p className={["text-xs font-black uppercase tracking-[0.18em]", light ? "text-gold" : "text-ink/45"].join(" ")}>{label}</p>
      <p className={["mt-1 font-bold leading-6", light ? "text-white" : "text-ink"].join(" ")}>{value || "Pendiente"}</p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
  error
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
}) {
  const inputId = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <label className="text-sm font-semibold text-ink" data-field-error={error ? "true" : undefined}>
      <span className="flex items-center gap-1">
        {label}
        {required ? <span className="text-red-600">*</span> : null}
      </span>
      <input
        id={inputId}
        type={type}
        value={value}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={[
          "mt-2 w-full rounded-md border bg-pearl px-4 py-3 outline-none transition",
          error ? "border-red-500 ring-2 ring-red-100 focus:border-red-600" : "border-ink/12 focus:border-gold"
        ].join(" ")}
      />
      {error ? (
        <p id={`${inputId}-error`} className="mt-2 text-xs font-bold leading-5 text-red-700">
          {error}
        </p>
      ) : null}
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder = ""
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="text-sm font-semibold text-ink">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="mt-2 w-full rounded-md border border-ink/12 bg-pearl px-4 py-3 outline-none transition focus:border-gold"
        placeholder={placeholder}
      />
    </label>
  );
}

