"use client"
import { useEffect, useRef, useState } from "react"

// ── YouTube URL → video ID ─────────────────────────────────────────────────────
// Handles: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, /embed/ID
function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.searchParams.has("v")) return u.searchParams.get("v")
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0]
    const m = u.pathname.match(/\/(?:shorts|embed)\/([^/?#]+)/)
    return m?.[1] ?? null
  } catch {
    return null
  }
}

// ── Minimal YT types (the full @types/youtube package is overkill here) ────────
interface YTPlayerInstance {
  playVideo(): void
  pauseVideo(): void
  unMute(): void
  setVolume(n: number): void
  getVideoData(): { title?: string } | null
  destroy(): void
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT: any
    onYouTubeIframeAPIReady?: () => void
  }
}

type PlayState = "loading" | "muted" | "playing" | "paused"

// ── Component ──────────────────────────────────────────────────────────────────
export function MusicPlayer({
  url,
  accent,
  bg,
}: {
  url: string
  accent: string
  bg: string
}) {
  const videoId = extractVideoId(url)
  const [playState, setPlayState] = useState<PlayState>("loading")
  const [title, setTitle] = useState("")
  const playerRef = useRef<YTPlayerInstance | null>(null)
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!videoId) return
    let unmounted = false

    function initPlayer() {
      if (unmounted || !mountRef.current) return

      playerRef.current = new window.YT.Player(mountRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: videoId, // required alongside loop=1 for looping to work
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          mute: 1,           // start muted — autoplay policy requires it
          playsinline: 1,
        },
        events: {
          onReady(e: { target: YTPlayerInstance }) {
            if (unmounted) return
            e.target.playVideo()
            setTitle(e.target.getVideoData()?.title ?? "")
            setPlayState("muted")
          },
        },
      }) as YTPlayerInstance
    }

    if (typeof window.YT?.Player === "function") {
      // API already loaded (e.g. second navigation to this page)
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
      if (!document.getElementById("yt-iframe-api")) {
        const tag = document.createElement("script")
        tag.id = "yt-iframe-api"
        tag.src = "https://www.youtube.com/iframe_api"
        document.head.appendChild(tag)
      }
    }

    return () => {
      unmounted = true
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [videoId])

  function toggle() {
    const p = playerRef.current
    if (!p) return
    if (playState === "muted") {
      // First tap: unmute and hand over volume
      p.unMute()
      p.setVolume(75)
      setPlayState("playing")
    } else if (playState === "playing") {
      p.pauseVideo()
      setPlayState("paused")
    } else if (playState === "paused") {
      p.playVideo()
      setPlayState("playing")
    }
  }

  if (!videoId) return null

  const isPlaying = playState === "playing"
  const isMuted   = playState === "muted"
  const isPaused  = playState === "paused"

  return (
    <>
      {/* Equalizer bar keyframes */}
      <style>{`
        @keyframes yt-bar {
          0%, 100% { transform: scaleY(0.28) }
          50%       { transform: scaleY(1) }
        }
      `}</style>

      {/*
        Hidden YT iframe container.
        Must NOT use display:none or visibility:hidden — the IFrame API needs a
        visible (even if off-screen) element to initialise the player correctly.
      */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: -9999,
          left: -9999,
          width: 1,
          height: 1,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div ref={mountRef} />
      </div>

      {/* Floating button */}
      <button
        type="button"
        onClick={toggle}
        disabled={playState === "loading"}
        className="fixed bottom-6 right-6 z-50 flex max-w-[230px] items-center gap-2.5 rounded-full px-4 py-3 shadow-2xl backdrop-blur-md transition-transform duration-200 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-0"
        style={{ background: `${accent}dd`, color: bg }}
        aria-label={
          isMuted  ? "Activar sonido"
          : isPlaying ? "Pausar música"
          : "Reproducir música"
        }
      >
        {/* Left icon */}
        <span className="flex h-[18px] w-[18px] shrink-0 items-end justify-between">
          {isPlaying ? (
            // Animated equalizer — 4 bars with staggered delays
            <>
              {([0, 220, 90, 340] as const).map((delay, i) => (
                <span
                  key={i}
                  style={{
                    display: "block",
                    width: 3,
                    height: "100%",
                    borderRadius: 99,
                    background: bg,
                    transformOrigin: "bottom",
                    animation: "yt-bar .75s ease-in-out infinite",
                    animationDelay: `${delay}ms`,
                  }}
                />
              ))}
            </>
          ) : isMuted ? (
            // Crossed-out speaker
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]">
              <path d="M9.547 3.062A.75.75 0 0 1 10 3.75v12.5a.75.75 0 0 1-1.264.546L4.703 13H3.167a1.75 1.75 0 0 1-1.75-1.75v-2.5c0-.966.784-1.75 1.75-1.75h1.536l4.033-3.296a.75.75 0 0 1 .811-.142ZM13.78 7.22a.75.75 0 1 0-1.06 1.06L13.94 9.5l-1.22 1.22a.75.75 0 0 0 1.06 1.06L15 10.56l1.22 1.22a.75.75 0 1 0 1.06-1.06L16.06 9.5l1.22-1.22a.75.75 0 1 0-1.06-1.06L15 8.44l-1.22-1.22Z" />
            </svg>
          ) : (isPlaying || isPaused || playState === "loading") ? (
            // Play arrow
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]">
              <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" />
            </svg>
          ) : null}
        </span>

        {/* Label */}
        {playState !== "loading" && (
          <span
            className="truncate text-[11px] font-bold leading-none"
            style={{ color: bg }}
          >
            {isMuted
              ? "Toca para activar sonido"
              : isPlaying
              ? (title || "Reproduciendo…")
              : "Toca para continuar"}
          </span>
        )}
      </button>
    </>
  )
}
