import * as React from "react"
import { motion } from "framer-motion"

/**
 * LIQUID GLASS MUSIC PLAYER (Final Polish)
 * - Added 'Track Color' control for the empty progress bar.
 * - Added inner shadow to progress track for "carved glass" depth.
 */

// --- ICONS ---
const IconArrowLeft = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
    </svg>
)
const IconArrowRight = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
)
const IconPlay = ({ fill }: { fill?: string }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={fill}
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
)
const IconPause = ({ fill }: { fill?: string }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={fill}
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
    </svg>
)
const IconMore = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
    </svg>
)

// --- STYLES ---
const LIQUID_SHADOWS = `
    0 0 6px rgba(0,0,0,0.03),
    0 2px 6px rgba(0,0,0,0.08),
    inset 3px 3px 0.5px -3px rgba(255,255,255,0.9),
    inset -3px -3px 0.5px -3px rgba(255,255,255,0.85),
    inset 1px 1px 1px -0.5px rgba(255,255,255,0.6),
    inset -1px -1px 1px -0.5px rgba(255,255,255,0.6),
    inset 0 0 6px 6px rgba(255,255,255,0.12),
    inset 0 0 2px 2px rgba(255,255,255,0.06),
    0 0 12px rgba(255,255,255,0.15)
`

// --- HELPER COMPONENTS ---

const LiquidGlassFilter = ({ id }: { id: string }) => (
    <svg
        style={{
            position: "absolute",
            width: 0,
            height: 0,
            overflow: "hidden",
        }}
    >
        <defs>
            <filter
                id={id}
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
                colorInterpolationFilters="sRGB"
            >
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.05 0.05"
                    numOctaves="1"
                    seed="1"
                    result="turbulence"
                />
                <feGaussianBlur
                    in="turbulence"
                    stdDeviation="2"
                    result="blurredNoise"
                />
                <feDisplacementMap
                    in="SourceGraphic"
                    in2="blurredNoise"
                    scale="30"
                    xChannelSelector="R"
                    yChannelSelector="B"
                    result="displaced"
                />
                <feGaussianBlur
                    in="displaced"
                    stdDeviation="1"
                    result="finalBlur"
                />
                <feComposite in="finalBlur" in2="finalBlur" operator="over" />
            </filter>
        </defs>
    </svg>
)

const LiquidButton = ({ children, onClick, color }: any) => {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
                position: "relative",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: color,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    boxShadow: LIQUID_SHADOWS,
                }}
            />
            <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
        </motion.button>
    )
}

const VolumeBars = ({
    isPlaying,
    color,
}: {
    isPlaying: boolean
    color: string
}) => {
    const bars = [0, 1, 2, 3, 4, 5, 6, 7]
    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 2,
                height: 24,
                marginBottom: 6,
            }}
        >
            {bars.map((i) => (
                <motion.div
                    key={i}
                    animate={
                        isPlaying
                            ? { height: [4, 16, 8, 20, 6] }
                            : { height: 6 }
                    }
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: i * 0.1,
                        ease: "linear",
                    }}
                    style={{
                        width: 3,
                        borderRadius: 2,
                        backgroundColor: color,
                    }}
                />
            ))}
        </div>
    )
}

const ProgressBar = ({
    currentTime,
    totalDuration,
    onSeek,
    tintColor,
    textColor,
    trackColor,
}: any) => {
    const safeDuration = totalDuration > 0 ? totalDuration : 1
    const progress = (currentTime / safeDuration) * 100
    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00"
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (totalDuration <= 0) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        onSeek((x / rect.width) * totalDuration)
    }

    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 8,
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    fontWeight: 500,
                    color: textColor,
                    fontVariantNumeric: "tabular-nums",
                }}
            >
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(totalDuration)}</span>
            </div>

            {/* PROGRESS TRACK CONTAINER */}
            <div
                onClick={handleClick}
                style={{
                    position: "relative",
                    height: 8, // Slightly thicker for better visibility
                    width: "100%",
                    backgroundColor: trackColor, // User defined color
                    borderRadius: 99,
                    cursor: "pointer",
                    overflow: "hidden",
                    // This inset shadow gives it the "carved" look
                    boxShadow:
                        "inset 0 1px 3px rgba(0,0,0,0.15), inset 0 0 0 0.5px rgba(0,0,0,0.05)",
                }}
            >
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{
                        height: "100%",
                        backgroundColor: tintColor,
                        borderRadius: 99,
                        boxShadow: "0 0 10px rgba(0,0,0,0.1)", // Slight glow on the fill
                    }}
                />
            </div>
        </div>
    )
}

// --- MAIN COMPONENT ---

type LiquidMusicPlayerProps = {
    songTitle?: string
    artistName?: string
    coverImage?: string
    audioFile?: string
    tint?: string
    glassEffect?: boolean
    showUploadButton?: boolean
    titleFont?: {
        fontSize?: string
        fontWeight?: number | string
        fontFamily?: string
    }
    artistFont?: {
        fontSize?: string
        fontWeight?: number | string
        fontFamily?: string
    }
    titleColor?: string
    artistColor?: string
    timeColor?: string
    buttonColor?: string
    trackColor?: string
    [key: string]: any
}

export default function LiquidMusicPlayer(props: LiquidMusicPlayerProps) {
    const {
        songTitle = "Glow",
        artistName = "Echo",
        coverImage,
        audioFile,
        tint = "#FF2E55",
        glassEffect = true,
        showUploadButton = true,
        titleFont = {
            fontSize: "20px",
            fontWeight: 700,
            fontFamily: "Inter",
        },
        artistFont = {
            fontSize: "14px",
            fontWeight: 500,
            fontFamily: "Inter",
        },
        // Colors
        titleColor = "#1a1a1a",
        artistColor = "#666666",
        timeColor = "#666666",
        buttonColor = "#333333",
        trackColor = "rgba(0,0,0,0.1)", // New prop
    } = props

    const audioRef = React.useRef<HTMLAudioElement>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const [currentSource, setCurrentSource] = React.useState(audioFile)
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [currentTime, setCurrentTime] = React.useState(0)
    const [duration, setDuration] = React.useState(0)

    const filterId = React.useId()
    const cleanFilterId = filterId.replace(/:/g, "")

    React.useEffect(() => {
        if (audioFile) setCurrentSource(audioFile)
    }, [audioFile])

    const handleUserUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const objectUrl = URL.createObjectURL(file)
            setCurrentSource(objectUrl)
            setIsPlaying(true)
        }
    }
    const togglePlay = () => {
        if (!audioRef.current) return
        isPlaying ? audioRef.current.pause() : audioRef.current.play()
        setIsPlaying(!isPlaying)
    }
    const handleTimeUpdate = () => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime)
    }
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration)
            if (isPlaying) audioRef.current.play()
        }
    }
    const handleSeek = (newTime: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = newTime
            setCurrentTime(newTime)
        }
    }

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
            }}
        >
            <audio
                ref={audioRef}
                src={currentSource}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => {
                    setIsPlaying(false)
                    setCurrentTime(0)
                }}
            />
            <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                style={{ display: "none" }}
                onChange={handleUserUpload}
            />

            <div
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 420,
                    padding: 24,
                    borderRadius: 32,
                    isolation: "isolate",
                }}
            >
                {/* 1. Liquid Shadows */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        borderRadius: 32,
                        boxShadow: LIQUID_SHADOWS,
                        zIndex: 0,
                        pointerEvents: "none",
                    }}
                />

                {/* 2. Liquid Distortion */}
                {glassEffect && (
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            borderRadius: 32,
                            zIndex: -1,
                            backdropFilter: `url(#${cleanFilterId})`,
                            overflow: "hidden",
                        }}
                    />
                )}

                {/* 3. Content */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 10,
                        display: "flex",
                        flexDirection: "column",
                        gap: 24,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                        }}
                    >
                        <div
                            style={{
                                width: 72,
                                height: 72,
                                borderRadius: 20,
                                overflow: "hidden",
                                flexShrink: 0,
                                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                                background: tint,
                            }}
                        >
                            {coverImage ? (
                                <img
                                    src={coverImage}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "white",
                                        fontSize: 24,
                                    }}
                                >
                                    ♪
                                </div>
                            )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h3
                                style={{
                                    margin: 0,
                                    color: titleColor,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    fontSize: titleFont.fontSize,
                                    fontWeight: titleFont.fontWeight,
                                    fontFamily: titleFont.fontFamily,
                                }}
                            >
                                {songTitle}
                            </h3>
                            <p
                                style={{
                                    margin: "4px 0 0 0",
                                    color: artistColor,
                                    fontSize: artistFont.fontSize,
                                    fontWeight: artistFont.fontWeight,
                                    fontFamily: artistFont.fontFamily,
                                }}
                            >
                                {artistName}
                            </p>
                        </div>
                        <VolumeBars isPlaying={isPlaying} color={tint} />
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 16,
                        }}
                    >
                        {/* Passed tint for bar color, timeColor for text, trackColor for bg */}
                        <ProgressBar
                            currentTime={currentTime}
                            totalDuration={duration}
                            onSeek={handleSeek}
                            tintColor={tint}
                            textColor={timeColor}
                            trackColor={trackColor}
                        />

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: 8,
                            }}
                        >
                            <div style={{ display: "flex", gap: 12 }}>
                                <LiquidButton
                                    color={buttonColor}
                                    onClick={() =>
                                        handleSeek(
                                            Math.max(0, currentTime - 10)
                                        )
                                    }
                                >
                                    <IconArrowLeft />
                                </LiquidButton>
                                <LiquidButton color={tint} onClick={togglePlay}>
                                    {isPlaying ? (
                                        <IconPause fill={tint} />
                                    ) : (
                                        <IconPlay fill={tint} />
                                    )}
                                </LiquidButton>
                                <LiquidButton
                                    color={buttonColor}
                                    onClick={() =>
                                        handleSeek(
                                            Math.min(duration, currentTime + 10)
                                        )
                                    }
                                >
                                    <IconArrowRight />
                                </LiquidButton>
                            </div>
                            {showUploadButton && (
                                <LiquidButton
                                    color={buttonColor}
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    <IconMore />
                                </LiquidButton>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {glassEffect && <LiquidGlassFilter id={cleanFilterId} />}
        </div>
    )
}
