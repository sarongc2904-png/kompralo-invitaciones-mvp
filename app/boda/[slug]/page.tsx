import { notFound } from "next/navigation"
import Image from "next/image"
import { Great_Vibes, Cormorant_Garamond, Montserrat } from "next/font/google"
import { prisma } from "@/lib/prisma"
import { CountdownTimer } from "./CountdownTimer"
import { MusicPlayer } from "./MusicPlayer"
import { RsvpForm } from "./RsvpForm"

// ── Fonts ─────────────────────────────────────────────────────────────────────

const script = Great_Vibes({ subsets: ["latin"], weight: "400", display: "swap" })
const serif  = Cormorant_Garamond({
  subsets: ["latin"], weight: ["300","400","600"],
  style: ["normal","italic"], display: "swap",
})
const sans = Montserrat({
  subsets: ["latin"], weight: ["300","400","500","600"], display: "swap",
})

// ── Palette ───────────────────────────────────────────────────────────────────

const BG       = "#1a0a0e"
const BURGUNDY = "#6B2737"
const GOLD     = "#C9A84C"
const CREAM    = "#FAF6F0"
const TEXT     = "#2C1810"

// ── Types ─────────────────────────────────────────────────────────────────────

interface Modules {
  countdown?:    boolean
  galeria?:      boolean
  confirmacion?: boolean
  musica?:       boolean
  mapa?:         boolean
  historia?:     boolean
  qr?:           boolean
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatFechaLong(d: Date) {
  return d.toLocaleDateString("es-MX", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  })
}

function formatFechaDisplay(d: Date) {
  const day     = d.getDate().toString().padStart(2, "0")
  const month   = d.toLocaleDateString("es-MX", { month: "long" }).toUpperCase()
  const year    = d.getFullYear()
  const weekday = d.toLocaleDateString("es-MX", { weekday: "long" }).toUpperCase()
  return `${weekday} · ${day} · ${month} · ${year}`
}

// ── SVG Components ────────────────────────────────────────────────────────────

function GoldOrnament({ small = false }: { small?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "12px 0" }}>
      <svg
        viewBox="0 0 400 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: small ? 200 : 320, height: "auto" }}
      >
        <path d="M200 30 C190 15, 175 8, 160 15 C145 22, 145 38, 160 45 C175 52, 190 45, 200 30Z" fill={GOLD} opacity="0.9"/>
        <path d="M200 30 C210 15, 225 8, 240 15 C255 22, 255 38, 240 45 C225 52, 210 45, 200 30Z" fill={GOLD} opacity="0.9"/>
        <path d="M155 30 Q130 30 110 22 Q90 14 70 20 Q50 26 40 38" stroke={GOLD} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M245 30 Q270 30 290 22 Q310 14 330 20 Q350 26 360 38" stroke={GOLD} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M40 38 Q30 44 20 38 Q10 32 15 22 Q20 12 30 18" stroke={GOLD} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M360 38 Q370 44 380 38 Q390 32 385 22 Q380 12 370 18" stroke={GOLD} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <circle cx="15" cy="30" r="8" stroke={GOLD} strokeWidth="1.5" fill="none"/>
        <circle cx="385" cy="30" r="8" stroke={GOLD} strokeWidth="1.5" fill="none"/>
        <line x1="110" y1="20" x2="100" y2="12" stroke={GOLD} strokeWidth="1" opacity="0.6" strokeLinecap="round"/>
        <line x1="120" y1="18" x2="115" y2="8" stroke={GOLD} strokeWidth="1" opacity="0.6" strokeLinecap="round"/>
        <line x1="290" y1="20" x2="300" y2="12" stroke={GOLD} strokeWidth="1" opacity="0.6" strokeLinecap="round"/>
        <line x1="280" y1="18" x2="285" y2="8" stroke={GOLD} strokeWidth="1" opacity="0.6" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

function CornerOrnament({ style }: { style: React.CSSProperties }) {
  return (
    <svg
      style={{ position: "absolute", width: 64, height: 64, ...style }}
      viewBox="0 0 80 80"
      fill="none"
    >
      <path d="M4 4 Q30 4 40 20 Q50 4 76 4" stroke={GOLD} strokeWidth="1" fill="none"/>
      <path d="M4 4 Q4 30 20 40 Q4 50 4 76" stroke={GOLD} strokeWidth="1" fill="none"/>
      <circle cx="4" cy="4" r="3" fill={GOLD} opacity="0.6"/>
    </svg>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BodaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inv = await (prisma as any).weddingInvitation.findUnique({ where: { slug } })
  if (!inv) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  void (prisma as any).weddingInvitation
    .update({ where: { slug }, data: { vistas: { increment: 1 } } })
    .catch(() => null)

  const modules  = (inv.modules as Modules) ?? {}
  const fotos    = ((inv.fotos ?? []) as string[]).filter(Boolean)
  const fecha    = new Date(inv.fecha)
  const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
  const invUrl   = `${baseUrl}/boda/${slug}`
  const nombre1  = inv.nombre1 as string
  const nombre2  = inv.nombre2 as string
  const iniciales = `${nombre1[0] ?? ""}${nombre2[0] ?? ""}`

  return (
    <main className={sans.className} style={{ background: BG, minHeight: "100dvh", overflowX: "hidden" }}>

      {/* CSS animations */}
      <style>{`
        @keyframes seal-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .seal-ring { animation: seal-spin 24s linear infinite; }
        @keyframes scroll-pulse {
          0%, 100% { transform: translateY(0); opacity: 0.35; }
          50%       { transform: translateY(6px); opacity: 0.7; }
        }
        .scroll-hint { animation: scroll-pulse 2s ease-in-out infinite; }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-a { animation: fade-up 1.1s ease both; }
        .fade-b { animation: fade-up 1.1s 0.25s ease both; }
        .fade-c { animation: fade-up 1.1s 0.5s ease both; }
      `}</style>

      {/* Floating music player */}
      {modules.musica && inv.musicaUrl ? (
        <MusicPlayer url={inv.musicaUrl as string} accent={GOLD} bg={BURGUNDY} />
      ) : null}

      {/* ══════════════════════════════════════════════════════════
          1. COVER
      ══════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(160deg, #4A1526 0%, ${BURGUNDY} 60%, #9B304B 100%)`,
          overflow: "hidden",
        }}
      >
        {inv.fotoportada ? (
          <>
            <Image
              src={inv.fotoportada as string}
              alt="Foto de portada"
              fill
              className="object-cover"
              priority
              unoptimized={(inv.fotoportada as string).startsWith("/")}
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(74,21,38,0.75)" }} />
          </>
        ) : null}

        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(to bottom, transparent 50%, ${BG} 100%)`,
        }} />

        <CornerOrnament style={{ top: 20, left: 20 }} />
        <CornerOrnament style={{ top: 20, right: 20, transform: "scaleX(-1)" }} />
        <CornerOrnament style={{ bottom: 20, left: 20, transform: "scaleY(-1)" }} />
        <CornerOrnament style={{ bottom: 20, right: 20, transform: "scale(-1,-1)" }} />

        {/* Rotating seal */}
        <div className="fade-a" style={{ position: "relative", width: 116, height: 116, marginBottom: 24 }}>
          <div className="seal-ring" style={{ position: "absolute", inset: 0 }}>
            <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
              <path id="seal-circle" d="M 50,50 m -32,0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0" fill="none"/>
              <text fontFamily="Montserrat, sans-serif" fontSize="6.2" fill={GOLD} letterSpacing="2.8" fontWeight="300">
                <textPath href="#seal-circle">NOS CASAMOS  ✦  WEDDING  ✦  AMOR  ✦ </textPath>
              </text>
            </svg>
          </div>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span className={script.className} style={{ color: GOLD, fontSize: "2rem", lineHeight: 1 }}>
              {iniciales}
            </span>
          </div>
        </div>

        {/* Names */}
        <div className="fade-b" style={{ textAlign: "center", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <h1
            className={script.className}
            style={{ color: GOLD, fontSize: "clamp(3.5rem,13vw,6.5rem)", lineHeight: 1.05 }}
          >
            {nombre1}
          </h1>
          <p style={{ color: GOLD, opacity: 0.45, fontSize: "1.5rem", margin: "6px 0", fontWeight: 300 }}>
            &amp;
          </p>
          <h1
            className={script.className}
            style={{ color: GOLD, fontSize: "clamp(3.5rem,13vw,6.5rem)", lineHeight: 1.05 }}
          >
            {nombre2}
          </h1>
        </div>

        <div style={{ width: 56, height: 1, background: GOLD, opacity: 0.35, margin: "22px auto", position: "relative", zIndex: 1 }} />

        <p
          className={`${sans.className} fade-c`}
          style={{
            color: GOLD, opacity: 0.72,
            fontSize: "0.6rem", letterSpacing: "0.32em",
            textTransform: "uppercase",
            position: "relative", zIndex: 1,
            textAlign: "center", padding: "0 24px",
          }}
        >
          {formatFechaDisplay(fecha)}
        </p>

        <div className="scroll-hint" style={{
          position: "absolute", bottom: 28, left: 0, right: 0,
          display: "flex", justifyContent: "center",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" opacity={0.35}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. FRASE / VERSO
      ══════════════════════════════════════════════════════════ */}
      {inv.frase ? (
        <section style={{ background: CREAM, padding: "64px 24px", textAlign: "center" }}>
          <GoldOrnament />
          <p
            className={serif.className}
            style={{
              color: TEXT, fontSize: "clamp(1.15rem,3.5vw,1.55rem)",
              fontStyle: "italic", lineHeight: 1.75,
              maxWidth: 520, margin: "24px auto",
              fontWeight: 300,
            }}
          >
            &ldquo;{inv.frase as string}&rdquo;
          </p>
          <GoldOrnament />
          <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 6, alignItems: "center" }}>
            <span className={script.className} style={{ color: TEXT, fontSize: "2.2rem", lineHeight: 1 }}>
              {nombre1[0]}
            </span>
            <span style={{ color: GOLD, fontSize: "2rem", lineHeight: 1, margin: "0 4px" }}>❧</span>
            <span className={script.className} style={{ color: TEXT, fontSize: "2.2rem", lineHeight: 1 }}>
              {nombre2[0]}
            </span>
          </div>
        </section>
      ) : null}

      {/* ══════════════════════════════════════════════════════════
          3. COUNTDOWN
      ══════════════════════════════════════════════════════════ */}
      {modules.countdown ? (
        <section style={{
          background: `linear-gradient(135deg, ${BURGUNDY} 0%, #350F1B 100%)`,
          padding: "72px 24px",
          textAlign: "center",
        }}>
          <p
            className={sans.className}
            style={{
              color: GOLD, fontSize: "0.62rem",
              letterSpacing: "0.36em", textTransform: "uppercase",
              marginBottom: 6, opacity: 0.75,
            }}
          >
            Faltan
          </p>
          <p
            className={serif.className}
            style={{
              color: GOLD, fontSize: "clamp(0.95rem,3vw,1.25rem)",
              fontStyle: "italic", marginBottom: 36, opacity: 0.85,
            }}
          >
            {formatFechaLong(fecha)}
          </p>
          <CountdownTimer fecha={fecha.toISOString()} accent={GOLD} bg={BURGUNDY} />
        </section>
      ) : null}

      {/* ══════════════════════════════════════════════════════════
          4. HERO PHOTO (first from gallery)
      ══════════════════════════════════════════════════════════ */}
      {fotos.length > 0 ? (
        <div style={{
          position: "relative",
          height: "min(55vw, 480px)",
          minHeight: 220,
          overflow: "hidden",
        }}>
          <Image
            src={fotos[0]}
            alt="Foto de los novios"
            fill
            className="object-cover"
            unoptimized={fotos[0].startsWith("/")}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to bottom, #350F1B 0%, transparent 18%, transparent 82%, ${CREAM} 100%)`,
          }} />
        </div>
      ) : null}

      {/* ══════════════════════════════════════════════════════════
          5. EVENT INFO
      ══════════════════════════════════════════════════════════ */}
      <section style={{ background: CREAM, padding: "64px 24px" }}>
        <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <p
            className={sans.className}
            style={{
              color: GOLD, fontSize: "0.58rem",
              letterSpacing: "0.36em", textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Ceremonia &amp; Recepción
          </p>
          <h2
            className={serif.className}
            style={{
              color: TEXT, fontSize: "clamp(1.7rem,5vw,2.4rem)",
              fontWeight: 300, marginBottom: 20,
            }}
          >
            {inv.hora as string} hrs.
          </h2>
          <p
            className={serif.className}
            style={{ color: TEXT, fontSize: "clamp(1.25rem,3.5vw,1.5rem)", fontWeight: 400 }}
          >
            {inv.lugar as string}
          </p>
          {inv.direccion ? (
            <p
              className={sans.className}
              style={{ color: TEXT, opacity: 0.55, fontSize: "0.82rem", marginTop: 6, lineHeight: 1.6 }}
            >
              {inv.direccion as string}
            </p>
          ) : null}
          <div style={{ margin: "24px 0 8px" }}>
            <GoldOrnament small />
          </div>
          <p
            className={sans.className}
            style={{ color: TEXT, opacity: 0.5, fontSize: "0.78rem", fontStyle: "italic" }}
          >
            {formatFechaLong(fecha)}
          </p>

          {modules.mapa && inv.mapsUrl ? (
            <a
              href={inv.mapsUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                marginTop: 24, padding: "11px 28px",
                border: `1.5px solid ${GOLD}60`,
                borderRadius: 2, color: BURGUNDY,
                fontSize: "0.75rem", fontWeight: 600,
                textDecoration: "none", letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
              </svg>
              Cómo llegar
            </a>
          ) : null}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6. GALLERY
      ══════════════════════════════════════════════════════════ */}
      {modules.galeria && fotos.length > 1 ? (
        <section style={{ background: CREAM, padding: "0 16px 64px" }}>
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              {fotos.slice(1).map((url, i) => (
                <div
                  key={url + i}
                  style={{
                    position: "relative",
                    aspectRatio: "1/1",
                    borderRadius: 2,
                    overflow: "hidden",
                    gridColumn: i === 0 ? "span 2" : "span 1",
                    gridRow: i === 0 ? "span 2" : "span 1",
                  }}
                >
                  <Image
                    src={url}
                    alt={`Foto ${i + 2}`}
                    fill
                    className="object-cover"
                    unoptimized={url.startsWith("/")}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ══════════════════════════════════════════════════════════
          7. ITINERARY
      ══════════════════════════════════════════════════════════ */}
      <section style={{ background: CREAM, padding: "64px 24px" }}>
        <div style={{ maxWidth: 460, margin: "0 auto" }}>
          <GoldOrnament />
          <h2
            className={serif.className}
            style={{
              color: TEXT, fontSize: "clamp(1.45rem,4.5vw,2rem)",
              fontWeight: 300, fontStyle: "italic",
              textAlign: "center", margin: "18px 0 36px",
            }}
          >
            Itinerario del día
          </h2>
          {[
            { time: "15:30", icon: "🌸", title: "Llegada de invitados", desc: "Bienvenida y aperitivos" },
            { time: "17:00", icon: "💍", title: "Ceremonia",            desc: "El momento más especial" },
            { time: "18:30", icon: "🥂", title: "Cocktail & Fotos",     desc: "Brindis y fotos con los novios" },
            { time: "20:00", icon: "🍽️", title: "Recepción & Cena",     desc: "Cena y primeros bailes" },
            { time: "21:30", icon: "🎉", title: "Hora Loca & Baile",    desc: "¡A celebrar hasta el amanecer!" },
          ].map((item, i, arr) => (
            <div key={item.time} style={{ display: "flex", gap: 16 }}>
              {/* Timeline dot + line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${BURGUNDY}, #9B304B)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem",
                  boxShadow: `0 4px 18px rgba(107,39,55,0.28)`,
                }}>
                  {item.icon}
                </div>
                {i < arr.length - 1 ? (
                  <div style={{ width: 1, flex: 1, background: `${GOLD}28`, margin: "4px 0", minHeight: 24 }} />
                ) : null}
              </div>
              {/* Text */}
              <div style={{ paddingBottom: 28, paddingTop: 6 }}>
                <p
                  className={sans.className}
                  style={{
                    color: GOLD, fontSize: "0.6rem",
                    letterSpacing: "0.22em", fontWeight: 600,
                    textTransform: "uppercase", marginBottom: 3,
                  }}
                >
                  {item.time} hrs
                </p>
                <p
                  className={serif.className}
                  style={{ color: TEXT, fontSize: "1.1rem", fontWeight: 500 }}
                >
                  {item.title}
                </p>
                <p
                  className={sans.className}
                  style={{ color: TEXT, opacity: 0.5, fontSize: "0.78rem", marginTop: 2 }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          8. DRESSCODE
      ══════════════════════════════════════════════════════════ */}
      {inv.dresscode ? (
        <section style={{ background: CREAM, padding: "0 24px 64px", textAlign: "center" }}>
          <GoldOrnament />
          <div style={{ maxWidth: 380, margin: "20px auto 0" }}>
            <p
              className={sans.className}
              style={{
                color: GOLD, fontSize: "0.58rem",
                letterSpacing: "0.36em", textTransform: "uppercase", marginBottom: 10,
              }}
            >
              Código de vestimenta
            </p>
            <h2
              className={serif.className}
              style={{
                color: TEXT, fontSize: "clamp(1.4rem,4vw,1.9rem)",
                fontWeight: 300,
              }}
            >
              {inv.dresscode as string}
            </h2>
            <div style={{ display: "flex", justifyContent: "center", gap: 36, marginTop: 28 }}>
              {[{ label: "Damas", icon: "👗" }, { label: "Caballeros", icon: "🤵" }].map((g) => (
                <div key={g.label} style={{ textAlign: "center" }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%",
                    border: `1.5px solid ${GOLD}55`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.75rem", margin: "0 auto 8px",
                  }}>
                    {g.icon}
                  </div>
                  <p
                    className={sans.className}
                    style={{ color: TEXT, opacity: 0.55, fontSize: "0.72rem" }}
                  >
                    {g.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ══════════════════════════════════════════════════════════
          9. REGALOS
      ══════════════════════════════════════════════════════════ */}
      {inv.regalos ? (
        <section style={{ background: CREAM, padding: "0 24px 64px", textAlign: "center" }}>
          <GoldOrnament />
          <div style={{ maxWidth: 380, margin: "20px auto 0" }}>
            <p
              className={sans.className}
              style={{
                color: GOLD, fontSize: "0.58rem",
                letterSpacing: "0.36em", textTransform: "uppercase", marginBottom: 12,
              }}
            >
              Mesa de regalos
            </p>
            <div style={{ fontSize: "2.2rem", marginBottom: 16 }}>🎁</div>
            {(inv.regalos as string).startsWith("http") ? (
              <a
                href={inv.regalos as string}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 28px",
                  background: `linear-gradient(135deg, ${BURGUNDY}, #9B304B)`,
                  color: GOLD, borderRadius: 2,
                  fontSize: "0.75rem", fontWeight: 600,
                  textDecoration: "none", letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  boxShadow: `0 8px 28px rgba(107,39,55,0.32)`,
                }}
              >
                Ver mesa de regalos →
              </a>
            ) : (
              <p
                className={serif.className}
                style={{ color: TEXT, fontSize: "1.2rem", fontStyle: "italic" }}
              >
                {inv.regalos as string}
              </p>
            )}
          </div>
        </section>
      ) : null}

      {/* ══════════════════════════════════════════════════════════
          10. RSVP
      ══════════════════════════════════════════════════════════ */}
      {modules.confirmacion ? (
        <section style={{
          background: `linear-gradient(135deg, #350F1B 0%, ${BURGUNDY} 100%)`,
          padding: "72px 24px",
        }}>
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <GoldOrnament />
            <h2
              className={serif.className}
              style={{
                color: GOLD, fontSize: "clamp(1.6rem,5vw,2.2rem)",
                fontWeight: 300, fontStyle: "italic",
                textAlign: "center", margin: "20px 0 32px",
              }}
            >
              ¿Nos acompañas?
            </h2>
            <RsvpForm slug={slug} accent={GOLD} bg={BURGUNDY} />
          </div>
        </section>
      ) : null}

      {/* ══════════════════════════════════════════════════════════
          11. QR CODE
      ══════════════════════════════════════════════════════════ */}
      {modules.qr ? (
        <section style={{ background: CREAM, padding: "64px 24px", textAlign: "center" }}>
          <p
            className={sans.className}
            style={{
              color: GOLD, fontSize: "0.58rem",
              letterSpacing: "0.36em", textTransform: "uppercase", marginBottom: 20,
            }}
          >
            Tu pase de entrada
          </p>
          <div style={{
            display: "inline-block", padding: 16,
            background: "white", borderRadius: 4,
            boxShadow: `0 12px 48px rgba(107,39,55,0.15)`,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(invUrl)}&bgcolor=ffffff&color=6B2737&qzone=1`}
              alt="Código QR de la invitación"
              width={180}
              height={180}
            />
          </div>
          <p
            className={sans.className}
            style={{ color: TEXT, opacity: 0.38, fontSize: "0.72rem", marginTop: 14 }}
          >
            Muestra este código en la entrada
          </p>
        </section>
      ) : null}

      {/* ══════════════════════════════════════════════════════════
          12. CLOSING
      ══════════════════════════════════════════════════════════ */}
      <footer style={{
        background: `linear-gradient(160deg, #350F1B 0%, ${BURGUNDY} 100%)`,
        padding: "80px 24px",
        textAlign: "center",
      }}>
        <GoldOrnament />
        <div style={{ margin: "32px 0" }}>
          <p
            className={sans.className}
            style={{
              color: GOLD, opacity: 0.55, fontSize: "0.6rem",
              letterSpacing: "0.38em", textTransform: "uppercase", marginBottom: 20,
            }}
          >
            Muchas Gracias
          </p>
          <h2
            className={script.className}
            style={{ color: GOLD, fontSize: "clamp(2.5rem,9vw,4.5rem)", lineHeight: 1.15 }}
          >
            {nombre1} &amp; {nombre2}
          </h2>
          <div style={{ width: 56, height: 1, background: GOLD, opacity: 0.28, margin: "20px auto" }} />
          <p
            className={sans.className}
            style={{
              color: GOLD, opacity: 0.5, fontSize: "0.65rem",
              letterSpacing: "0.22em", textTransform: "uppercase",
            }}
          >
            {formatFechaDisplay(fecha)}
          </p>
        </div>
        <GoldOrnament />
        <p
          className={sans.className}
          style={{
            color: GOLD, opacity: 0.18, fontSize: "0.62rem",
            marginTop: 32, letterSpacing: "0.18em",
          }}
        >
          Invitación digital por Kompralo
        </p>
      </footer>

    </main>
  )
}
