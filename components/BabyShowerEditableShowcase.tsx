"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { ImagePlus, Palette, Type } from "lucide-react";

const defaultCards = [
  {
    title: "Come to our Baby Shower",
    subtitle: "Domingo 15 de mayo · 4:00 PM",
    detail: "Jardín Casa Magnolia",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=86"
  },
  {
    title: "Celebramos a Isabella",
    subtitle: "Una tarde dulce para recibirla",
    detail: "RSVP por WhatsApp",
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=86"
  },
  {
    title: "Detalles para mamá",
    subtitle: "Mesa de regalos, ubicación y QR",
    detail: "Todo en un solo enlace",
    image: "https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=900&q=86"
  }
];

const themes = {
  nina: {
    label: "Niña",
    bg: "from-[#fff0f6] via-[#fff9fb] to-[#e8f8ff]",
    main: "text-[#ef6f9f]",
    accent: "text-[#55bfd4]",
    button: "bg-[#ef6f9f]",
    ring: "border-[#7bd7e6]",
    soft: "bg-[#ffe4ef]"
  },
  nino: {
    label: "Niño",
    bg: "from-[#eff8ff] via-[#fffaf4] to-[#e8fff7]",
    main: "text-[#3ca8d8]",
    accent: "text-[#f0b95b]",
    button: "bg-[#3ca8d8]",
    ring: "border-[#f0b95b]",
    soft: "bg-[#e0f5ff]"
  }
};

export function BabyShowerEditableShowcase() {
  const [themeKey, setThemeKey] = useState<keyof typeof themes>("nina");
  const [cards, setCards] = useState(defaultCards);
  const theme = themes[themeKey];

  const clouds = useMemo(() => ["left-5 bottom-5", "right-8 top-16", "left-1/2 bottom-12"], []);

  function updateText(index: number, key: "title" | "subtitle" | "detail", value: string) {
    setCards((current) => current.map((card, cardIndex) => (cardIndex === index ? { ...card, [key]: value } : card)));
  }

  function uploadImage(index: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCards((current) => current.map((card, cardIndex) => (cardIndex === index ? { ...card, image: String(reader.result) } : card)));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="rounded-[2rem] border border-ink/8 bg-white/82 p-4 shadow-[0_24px_80px_rgba(17,17,20,0.1)] sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--event-accent)]">Editor visual</p>
          <h3 className="mt-2 text-2xl font-black text-ink sm:text-3xl">Personaliza texto, color y foto</h3>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-ink/58">
            El diseño se adapta en segundos para baby shower de niña o niño, con espacio principal para la foto del bebé o de mamá.
          </p>
        </div>
        <div className="inline-flex rounded-full border border-ink/10 bg-pearl p-1">
          {(Object.keys(themes) as Array<keyof typeof themes>).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setThemeKey(key)}
              className={`rounded-full px-4 py-2 text-xs font-black transition ${
                themeKey === key ? "bg-ink text-pearl shadow-[0_10px_30px_rgba(17,17,20,0.16)]" : "text-ink/58 hover:text-ink"
              }`}
            >
              {themes[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {cards.map((card, index) => (
          <article key={index} className={`overflow-hidden rounded-[1.75rem] border border-ink/8 bg-gradient-to-br ${theme.bg} shadow-[0_20px_60px_rgba(17,17,20,0.12)]`}>
            <div className="relative min-h-[360px] overflow-hidden p-5">
              {clouds.map((position) => (
                <span key={position} className={`absolute ${position} h-10 w-24 rounded-full ${theme.soft} opacity-80 blur-[1px]`} />
              ))}
              <span className="absolute right-6 top-8 text-5xl text-[#ffd45d]">☾</span>
              <span className="absolute left-8 top-24 text-2xl text-[#ffd45d]">✦</span>

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-ink/48">Baby Shower</div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/78 px-3 py-2 text-xs font-black text-ink shadow-[0_10px_30px_rgba(17,17,20,0.12)] transition hover:bg-white">
                  <ImagePlus size={15} className={theme.accent} />
                  Foto
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => uploadImage(index, event)} />
                </label>
              </div>

              <div className="relative z-10 mt-8 grid gap-5">
                <div className={`mx-auto grid size-44 place-items-center rounded-full border-4 border-dashed ${theme.ring} bg-white/64 p-2 shadow-[0_18px_50px_rgba(17,17,20,0.14)]`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.image} alt={card.title} className="size-full rounded-full object-cover" />
                </div>

                <div>
                  <h4 className={`max-w-[12rem] text-4xl font-black uppercase leading-[0.9] tracking-[-0.04em] ${theme.main}`}>
                    {card.title}
                  </h4>
                  <p className="mt-4 text-sm font-black text-ink/70">{card.subtitle}</p>
                  <p className={`mt-2 text-sm font-black ${theme.accent}`}>{card.detail}</p>
                </div>

                <div className="mt-2 flex gap-2">
                  <span className={`rounded-full ${theme.button} px-4 py-2 text-xs font-black text-white shadow-[0_14px_30px_rgba(17,17,20,0.16)]`}>Invitar</span>
                  <span className="rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-xs font-black text-ink/62">Ver detalles</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 border-t border-ink/8 bg-white/86 p-4">
              <label className="grid gap-1 text-xs font-black text-ink/58">
                <span className="inline-flex items-center gap-1">
                  <Type size={13} /> Título
                </span>
                <input
                  value={card.title}
                  onChange={(event) => updateText(index, "title", event.target.value)}
                  className="rounded-xl border border-ink/10 bg-pearl px-3 py-2 text-sm font-black text-ink outline-none transition focus:border-[var(--event-accent)]"
                />
              </label>
              <label className="grid gap-1 text-xs font-black text-ink/58">
                Subtítulo
                <input
                  value={card.subtitle}
                  onChange={(event) => updateText(index, "subtitle", event.target.value)}
                  className="rounded-xl border border-ink/10 bg-pearl px-3 py-2 text-sm font-semibold text-ink outline-none transition focus:border-[var(--event-accent)]"
                />
              </label>
              <label className="grid gap-1 text-xs font-black text-ink/58">
                <span className="inline-flex items-center gap-1">
                  <Palette size={13} /> Detalle
                </span>
                <input
                  value={card.detail}
                  onChange={(event) => updateText(index, "detail", event.target.value)}
                  className="rounded-xl border border-ink/10 bg-pearl px-3 py-2 text-sm font-semibold text-ink outline-none transition focus:border-[var(--event-accent)]"
                />
              </label>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
