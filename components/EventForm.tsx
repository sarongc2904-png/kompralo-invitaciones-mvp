"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { BadgeCheck, UploadCloud } from "lucide-react";
import { categories } from "@/lib/categories";
import { getPlanLabel } from "@/lib/plans";

type FormState = {
  nombre: string;
  whatsapp: string;
  correo: string;
  tipoEvento: string;
  festejado: string;
  fecha: string;
  hora: string;
  direccion: string;
  googleMaps: string;
  musica: string;
  dressCode: string;
  mesaRegalos: string;
  comentarios: string;
};

const initialState: FormState = {
  nombre: "",
  whatsapp: "",
  correo: "",
  tipoEvento: "XV años",
  festejado: "",
  fecha: "",
  hora: "",
  direccion: "",
  googleMaps: "",
  musica: "",
  dressCode: "",
  mesaRegalos: "",
  comentarios: ""
};

export function EventForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan");
  const paymentSessionId = searchParams.get("session_id");
  const [form, setForm] = useState(initialState);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...form,
      plan: selectedPlan,
      paymentSessionId,
      modelo: searchParams.get("modelo"),
      photos: files.map((file) => ({ name: file.name, size: file.size, type: file.type }))
    };

    const response = await fetch("/api/public-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(data?.error ?? "No se pudo crear la invitación. Intenta de nuevo.");
      return;
    }

    window.localStorage.setItem("kompralo-invitacion-formulario", JSON.stringify({
      ...payload,
      publicUrl: data.publicUrl,
      createdAt: new Date().toISOString()
    }));

    router.push(data.publicUrl ?? "/gracias");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 rounded-lg bg-white p-5 shadow-glow luxury-border sm:p-8">
      {selectedPlan || paymentSessionId ? (
        <div className="rounded-lg bg-champagne/55 p-4 luxury-border">
          <div className="flex items-start gap-3">
            <BadgeCheck className="mt-0.5 shrink-0 text-emerald" size={22} />
            <div>
              <p className="font-semibold text-ink">Compra vinculada al formulario</p>
              <p className="mt-1 text-sm leading-6 text-ink/62">
                Plan: {getPlanLabel(selectedPlan)}
                {paymentSessionId ? ` · Sesión Stripe: ${paymentSessionId}` : ""}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Input label="Nombre del cliente" value={form.nombre} onChange={(value) => updateField("nombre", value)} required />
        <Input label="WhatsApp" value={form.whatsapp} onChange={(value) => updateField("whatsapp", value)} required />
        <Input label="Correo" type="email" value={form.correo} onChange={(value) => updateField("correo", value)} required />
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
        <Input label="Nombre del festejado" value={form.festejado} onChange={(value) => updateField("festejado", value)} required />
        <Input label="Fecha" type="date" value={form.fecha} onChange={(value) => updateField("fecha", value)} required />
        <Input label="Hora" type="time" value={form.hora} onChange={(value) => updateField("hora", value)} required />
        <Input label="Dirección" value={form.direccion} onChange={(value) => updateField("direccion", value)} required />
        <Input label="Google Maps" value={form.googleMaps} onChange={(value) => updateField("googleMaps", value)} />
        <Input label="Música" value={form.musica} onChange={(value) => updateField("musica", value)} />
        <Input label="Dress Code" value={form.dressCode} onChange={(value) => updateField("dressCode", value)} />
        <Input label="Mesa de regalos" value={form.mesaRegalos} onChange={(value) => updateField("mesaRegalos", value)} />
      </div>

      <label className="text-sm font-semibold text-ink">
        Comentarios
        <textarea
          value={form.comentarios}
          onChange={(event) => updateField("comentarios", event.target.value)}
          rows={5}
          className="mt-2 w-full rounded-md border border-ink/12 bg-pearl px-4 py-3 outline-none transition focus:border-gold"
          placeholder="Detalles especiales, tono, colores, frases, referencias..."
        />
      </label>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gold/70 bg-champagne/50 px-4 py-8 text-center transition hover:bg-champagne">
        <UploadCloud className="text-gold" size={34} />
        <span className="mt-3 text-sm font-bold text-ink">Subida de fotografías</span>
        <span className="mt-1 text-xs text-ink/56">{files.length ? `${files.length} archivo(s) seleccionado(s)` : "JPG, PNG o WEBP"}</span>
        <input
          type="file"
          multiple
          accept="image/*"
          className="sr-only"
          onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
        />
      </label>

      {error ? <p className="text-sm font-semibold text-rose">{error}</p> : null}

      <button disabled={loading} className="rounded-md bg-ink px-5 py-4 text-sm font-bold text-pearl transition hover:-translate-y-0.5 hover:bg-emerald disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Creando invitación..." : "Crear invitación"}
      </button>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="text-sm font-semibold text-ink">
      {label}
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-ink/12 bg-pearl px-4 py-3 outline-none transition focus:border-gold"
      />
    </label>
  );
}
