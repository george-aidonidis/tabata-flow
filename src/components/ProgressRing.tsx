import type { TimerPhase } from '../types'

const PURE_ORANGE = '#F5A623'
const PURE_RED = '#E53E3E'
const PURE_TEAL = '#319795'
const PURE_GOLD = '#D69E2E'

const PHASE_COLORS: Record<TimerPhase, string> = {
  prepare: PURE_ORANGE,
  work: PURE_RED,
  rest: PURE_TEAL,
  finished: PURE_GOLD,
}

interface ProgressRingProps {
  phase: TimerPhase
  progress: number
}

export function ProgressRing({ phase, progress }: ProgressRingProps) {
  const stroke = PHASE_COLORS[phase]
  const radius = 120
  const normalizedRadius = radius - 10
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - progress * circumference

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#E6E6E6"
        fill="transparent"
        strokeWidth={10}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={stroke}
        fill="transparent"
        strokeWidth={10}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  )
}
