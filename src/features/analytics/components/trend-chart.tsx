'use client'

import { useMemo, useRef, useState } from 'react'

export interface DayPoint {
  day: string
  views: number
  clicks: number
}

/**
 * Two-series 30-day trend. Palette validated with the dataviz
 * six-checks script (light surface): views #7C3AED, clicks #0D9488.
 */
const SERIES = [
  { key: 'views' as const, label: 'Views', color: '#7C3AED' },
  { key: 'clicks' as const, label: 'Clicks', color: '#0D9488' },
]

const W = 640
const H = 220
const PAD = { top: 16, right: 12, bottom: 24, left: 36 }

export function TrendChart({ data }: { data: DayPoint[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const { max, points } = useMemo(() => {
    const rawMax = Math.max(1, ...data.flatMap((d) => [d.views, d.clicks]))
    // Nice ceiling so gridline labels are round numbers.
    const magnitude = 10 ** Math.floor(Math.log10(rawMax))
    const niceMax = Math.ceil(rawMax / magnitude) * magnitude
    const innerW = W - PAD.left - PAD.right
    const innerH = H - PAD.top - PAD.bottom
    const x = (i: number) =>
      PAD.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW)
    const y = (v: number) => PAD.top + innerH - (v / niceMax) * innerH
    return {
      max: niceMax,
      points: data.map((d, i) => ({
        x: x(i),
        yViews: y(d.views),
        yClicks: y(d.clicks),
      })),
    }
  }, [data])

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current
    if (!svg || data.length === 0) return
    const rect = svg.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    const innerW = W - PAD.left - PAD.right
    const idx = Math.round(((px - PAD.left) / innerW) * (data.length - 1))
    setHover(Math.max(0, Math.min(data.length - 1, idx)))
  }

  const gridValues = [0, max / 2, max]
  const hovered = hover !== null ? data[hover] : null
  const hoveredPoint = hover !== null ? points[hover] : null

  const fmtDay = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })

  const linePath = (key: 'yViews' | 'yClicks') =>
    points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p[key]}`).join(' ')

  return (
    <figure className="m-0">
      {/* Legend — identity never by color alone (labels beside dots) */}
      <div className="mb-2 flex items-center gap-4 px-1">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 text-xs font-medium">
            <span
              className="size-2.5 rounded-full"
              style={{ background: s.color }}
              aria-hidden
            />
            <span className="text-muted-foreground">{s.label}</span>
          </span>
        ))}
        {hovered && (
          <span className="ml-auto text-xs text-muted-foreground tabular-nums">
            {fmtDay(hovered.day)} · {hovered.views} views · {hovered.clicks} clicks
          </span>
        )}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Daily profile views and link clicks, last 30 days"
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        {/* Recessive grid */}
        {gridValues.map((v) => {
          const y = PAD.top + (H - PAD.top - PAD.bottom) * (1 - v / max)
          return (
            <g key={v}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y}
                y2={y}
                className="stroke-border"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 8}
                y={y + 3.5}
                textAnchor="end"
                className="fill-muted-foreground"
                fontSize={10}
              >
                {v}
              </text>
            </g>
          )
        })}

        {/* First/last date labels */}
        {data.length > 1 && (
          <>
            <text x={PAD.left} y={H - 6} className="fill-muted-foreground" fontSize={10}>
              {fmtDay(data[0]!.day)}
            </text>
            <text
              x={W - PAD.right}
              y={H - 6}
              textAnchor="end"
              className="fill-muted-foreground"
              fontSize={10}
            >
              {fmtDay(data[data.length - 1]!.day)}
            </text>
          </>
        )}

        {/* Series lines — 2px, no fills */}
        <path
          d={linePath('yViews')}
          fill="none"
          stroke={SERIES[0]!.color}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d={linePath('yClicks')}
          fill="none"
          stroke={SERIES[1]!.color}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Crosshair + markers on hover */}
        {hoveredPoint && (
          <g>
            <line
              x1={hoveredPoint.x}
              x2={hoveredPoint.x}
              y1={PAD.top}
              y2={H - PAD.bottom}
              className="stroke-border"
              strokeWidth={1}
            />
            <circle
              cx={hoveredPoint.x}
              cy={hoveredPoint.yViews}
              r={4}
              fill={SERIES[0]!.color}
              className="stroke-card"
              strokeWidth={2}
            />
            <circle
              cx={hoveredPoint.x}
              cy={hoveredPoint.yClicks}
              r={4}
              fill={SERIES[1]!.color}
              className="stroke-card"
              strokeWidth={2}
            />
          </g>
        )}
      </svg>

      {/* Accessible fallback */}
      <details className="mt-2 px-1">
        <summary className="cursor-pointer text-xs text-muted-foreground">
          View as table
        </summary>
        <div className="mt-2 max-h-48 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-muted-foreground">
                <th className="py-1 font-medium">Day</th>
                <th className="py-1 font-medium">Views</th>
                <th className="py-1 font-medium">Clicks</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {data.map((d) => (
                <tr key={d.day} className="border-t border-border">
                  <td className="py-1">{fmtDay(d.day)}</td>
                  <td className="py-1">{d.views}</td>
                  <td className="py-1">{d.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}
