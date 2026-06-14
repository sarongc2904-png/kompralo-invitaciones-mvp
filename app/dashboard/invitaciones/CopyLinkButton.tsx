"use client"
import { useState } from "react"
import { IconLink, IconCheck } from "@tabler/icons-react"

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback: select text
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-full border border-ink/12 bg-white px-4 py-2.5 text-xs font-black text-ink transition hover:border-gold hover:text-emerald"
    >
      {copied ? (
        <>
          <IconCheck size={14} className="text-emerald" />
          ¡Copiado!
        </>
      ) : (
        <>
          <IconLink size={14} />
          Copiar enlace
        </>
      )}
    </button>
  )
}
