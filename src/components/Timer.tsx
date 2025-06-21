import { useTabata } from '../hooks/useTabata'
import styles from './Timer.module.css'
import type { Settings } from '../types'
import { ProgressRing } from './ProgressRing'
import { ProgressCircles } from './ProgressCircles'

const PHASE_LABELS: Record<string, string> = {
  prepare: 'PREPARE',
  work: 'WORK',
  shortBreak: 'REST',
  longBreak: 'REST',
  finished: 'COMPLETE',
}

interface TimerProps {
  settings: Settings
  onReset: () => void
}

export function Timer({ settings, onReset }: TimerProps) {
  const { state, isRunning, togglePause, reset } = useTabata(settings)
  const { phase, remaining, set, cycle } = state

  const handleReset = () => {
    reset()
    onReset()
  }

  let totalTimeForPhase = 1
  if (phase === 'prepare') totalTimeForPhase = 5
  else if (phase === 'work') totalTimeForPhase = settings.work
  else if (phase === 'shortBreak') totalTimeForPhase = settings.shortBreak
  else if (phase === 'longBreak') totalTimeForPhase = settings.longBreak

  const progress =
    totalTimeForPhase > 0
      ? (totalTimeForPhase - remaining) / totalTimeForPhase
      : 0

  return (
    <div className={styles.container} data-testid="timer-container">
      <div className={styles.ringContainer}>
        <div className={styles.phaseLabel} data-testid="phase-label">
          {PHASE_LABELS[phase]}
        </div>
        <ProgressRing phase={phase} progress={progress} />
        <div className={styles.time} data-testid="time-display">
          {remaining}
        </div>
        {phase !== 'prepare' && phase !== 'finished' && (
          <div className={styles.setCycleBelow}>
            {`Set ${set}/${settings.sets} | Round ${cycle}/${settings.cycles}`}
          </div>
        )}
      </div>

      {/* Show progress dots during all phases */}
      <ProgressCircles
        currentCycle={cycle}
        totalCycles={settings.cycles}
        currentSet={set}
        totalSets={settings.sets}
      />

      <div className={styles.controls}>
        {phase !== 'finished' && (
          <button onClick={togglePause}>
            {isRunning ? 'Pause' : 'Resume'}
          </button>
        )}
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  )
}
