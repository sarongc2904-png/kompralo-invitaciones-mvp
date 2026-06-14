"use client"
import { useState, useEffect } from "react"

function pad(n: number) {
  return String(n).padStart(2, "0")
}

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  }
}

export function CountdownTimer({
  fecha,
  accent,
  bg,
}: {
  fecha: string
  accent: string
  bg: string
}) {
  const target = new Date(fecha)
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null)

  useEffect(() => {
    setTime(getTimeLeft(target))
    const id = setInterval(() => setTime(getTimeLeft(target)), 1_000)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fecha])

  if (!time) return null

  const units = [
    { label: "Días",     value: time.days },
    { label: "Horas",    value: time.hours },
    { label: "Minutos",  value: time.minutes },
    { label: "Segundos", value: time.seconds },
  ]

  return (
    <div className="flex justify-center gap-4 sm:gap-8">
      {units.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <div
            className="text-4xl sm:text-5xl font-bold tabular-nums"
            style={{ color: accent }}
          >
            {pad(value)}
          </div>
          <div className="text-xs mt-1 uppercase tracking-widest opacity-60" style={{ color: accent }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}
