"use client"

import { useEffect, useState } from "react"

const DEFAULT_WORDS = ["Cogito.", "Ergo.", "Sum."]
const MORPH = 0.45
const HOLD = 0.3

type PreloaderProps = {
    onFinish?: () => void
    words?: string[]
    bgColor?: string
    textColor?: string
    fontFamily?: string
}

export default function Preloader({
    onFinish,
    words = DEFAULT_WORDS,
    bgColor = "#000000",
    textColor = "#f5f5f0",
    // Modern/tech default. Swap for "'JetBrains Mono', monospace" if you want
    // an even more technical, code-like feel instead of a geometric sans.
    fontFamily = "'Space Grotesk', 'Inter', -apple-system, sans-serif",
}: PreloaderProps) {
    const [visible, setVisible] = useState(true)
    const [fading, setFading] = useState(false)
    const [started, setStarted] = useState(false)

    const slot = MORPH + HOLD
    const totalWordTime = slot * words.length
    const exitDelay = slot * (words.length - 1) + (2 * MORPH + HOLD)

    // Mount effect: set up black bg, lock scroll, kick off "started" once painted.
    useEffect(() => {
        const prevBodyOverflow = document.body.style.overflow
        const prevHtmlBg = document.documentElement.style.background
        const prevBodyBg = document.body.style.background

        document.body.style.overflow = "hidden"
        document.documentElement.style.background = bgColor
        document.body.style.background = bgColor

        let raf1 = 0
        let raf2 = 0
        raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(() => setStarted(true))
        })

        return () => {
            cancelAnimationFrame(raf1)
            cancelAnimationFrame(raf2)
            document.body.style.overflow = prevBodyOverflow
            document.documentElement.style.background = prevHtmlBg
            document.body.style.background = prevBodyBg
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Only schedule the fade-out once the word animation has actually
    // started, so the exitDelay is measured from real animation start
    // (not from mount, which is 1-2 frames earlier).
    useEffect(() => {
        if (!started) return

        const fadeTimer = setTimeout(() => setFading(true), exitDelay * 1000)
        const removeTimer = setTimeout(() => {
            setVisible(false)
            document.body.style.overflow = ""
            document.documentElement.style.background = ""
            document.body.style.background = ""
            onFinish?.()
        }, exitDelay * 1000 + 600)

        return () => {
            clearTimeout(fadeTimer)
            clearTimeout(removeTimer)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [started])

    if (!visible) return null

    const pct = (s: number) => ((s / totalWordTime) * 100).toFixed(2)
    const mIn = pct(MORPH)
    const mHold = pct(MORPH + HOLD)
    const mOut = pct(2 * MORPH + HOLD)

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: bgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                opacity: fading ? 0 : 1,
                transition: "opacity 0.6s ease",
                pointerEvents: fading ? "none" : "auto",
            }}
        >
            <style>{`
                @keyframes preloaderWordMorph {
                    0% {
                        opacity: 0;
                        filter: blur(6px);
                        transform: translate3d(-50%, -50%, 0) scale(0.92);
                    }
                    ${mIn}% {
                        opacity: 1;
                        filter: blur(0px);
                        transform: translate3d(-50%, -50%, 0) scale(1);
                    }
                    ${mHold}% {
                        opacity: 1;
                        filter: blur(0px);
                        transform: translate3d(-50%, -50%, 0) scale(1);
                    }
                    ${mOut}%, 100% {
                        opacity: 0;
                        filter: blur(6px);
                        transform: translate3d(-50%, -50%, 0) scale(1.08);
                    }
                }
            `}</style>

            <div
                style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "1.4em",
                }}
            >
                <span
                    style={{
                        visibility: "hidden",
                        whiteSpace: "nowrap",
                        fontFamily,
                        fontWeight: 600,
                        fontSize: "clamp(48px, 9vw, 84px)",
                        letterSpacing: "-0.01em",
                    }}
                >
                    {words.reduce((a, b) => (b.length > a.length ? b : a), "")}
                </span>

                {words.map((word, i) => (
                    <span
                        key={word + i}
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate3d(-50%, -50%, 0)",
                            opacity: 0,
                            color: textColor,
                            whiteSpace: "nowrap",
                            fontFamily,
                            fontWeight: 600,
                            fontSize: "clamp(48px, 9vw, 84px)",
                            letterSpacing: "-0.01em",
                            willChange: "transform, filter, opacity",
                            backfaceVisibility: "hidden",
                            animation: started
                                ? `preloaderWordMorph ${totalWordTime}s ${(
                                      slot * i
                                  ).toFixed(3)}s 1 ease-in-out forwards`
                                : "none",
                        }}
                    >
                        {word}
                    </span>
                ))}
            </div>
        </div>
    )
}