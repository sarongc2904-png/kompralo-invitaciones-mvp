"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownProps = {
  date: string;
  time: string;
};

function getTimeLeft(targetDate: Date) {
  const difference = targetDate.getTime() - Date.now();
  const total = Math.max(difference, 0);

  return {
    dias: Math.floor(total / (1000 * 60 * 60 * 24)),
    horas: Math.floor((total / (1000 * 60 * 60)) % 24),
    min: Math.floor((total / 1000 / 60) % 60),
    seg: Math.floor((total / 1000) % 60)
  };
}

export function Countdown({ date, time }: CountdownProps) {
  const targetDate = useMemo(() => new Date(`${date}T${time}:00`), [date, time]);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => window.clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="rounded-lg bg-white/84 p-3 text-center shadow-glow luxury-border backdrop-blur">
          <p className="font-display text-2xl text-ink sm:text-4xl">{String(value).padStart(2, "0")}</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ink/58">{label}</p>
        </div>
      ))}
    </div>
  );
}
