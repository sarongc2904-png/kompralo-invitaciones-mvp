"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type RSVPFormProps = {
  eventSlug: string;
};

export function RSVPForm({ eventSlug }: RSVPFormProps) {
  const [name, setName] = useState("");
  const [answer, setAnswer] = useState("Confirmaré asistencia");
  const [saved, setSaved] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      name,
      answer,
      eventSlug,
      createdAt: new Date().toISOString()
    };
    window.localStorage.setItem(`kompralo-rsvp-${eventSlug}`, JSON.stringify(payload));
    setSaved(true);
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg bg-white p-5 shadow-glow luxury-border">
      <p className="font-display text-2xl text-ink">Confirmar asistencia</p>
      <label className="mt-5 block text-sm font-semibold text-ink">
        Nombre
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 w-full rounded-md border border-ink/12 bg-pearl px-4 py-3 outline-none transition focus:border-gold"
          placeholder="Tu nombre"
        />
      </label>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {["Confirmaré asistencia", "No podré asistir"].map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-3 rounded-md border border-ink/12 p-3 text-sm">
            <input
              type="radio"
              name="answer"
              value={option}
              checked={answer === option}
              onChange={(event) => setAnswer(event.target.value)}
              className="accent-gold"
            />
            {option}
          </label>
        ))}
      </div>
      <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-bold text-pearl transition hover:bg-emerald">
        <Send size={16} />
        Enviar RSVP
      </button>
      {saved ? <p className="mt-3 text-sm font-semibold text-emerald">Respuesta guardada correctamente.</p> : null}
    </form>
  );
}
