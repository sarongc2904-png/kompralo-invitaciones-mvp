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
        <div
          key={label}
          className="rounded-xl border border-gold/55 bg-ink/82 p-3 text-center shadow-[0_18px_48px_rgba(0,0,0,0.38)] backdrop-blur-md sm:p-4"
        >
          <p className="font-display text-3xl leading-none text-pearl drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] sm:text-5xl">
            {String(value).padStart(2, "0")}
          </p>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-black sm:text-xs">{label}</p>
        </div>
      ))}
    </div>
  );
}
