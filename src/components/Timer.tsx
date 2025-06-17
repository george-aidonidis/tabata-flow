import { useTabata } from '../hooks/useTabata'
import styles from './Timer.module.css'
import type { TimerSettings } from '../types'
import { ProgressRing } from './ProgressRing'

interface TimerProps {
  settings: TimerSettings
  onReset: () => void
}

export function Timer({ settings, onReset }: TimerProps) {
  const { state, isRunning, togglePause, reset } = useTabata(settings)
  const { phase, remaining, round } = state

  const handleReset = () => {
    reset()
    onReset()
  }

  const totalTimeForPhase =
    phase === 'prepare'
      ? settings.prepare
      : phase === 'work'
        ? settings.work
        : settings.rest
  const progress =
    totalTimeForPhase > 0
      ? (totalTimeForPhase - remaining) / totalTimeForPhase
      : 0

  return (
    <div className={styles.container} data-testid="timer-container">
      <div className={styles.ringContainer}>
        <ProgressRing phase={phase} progress={progress} />
        <div className={styles.time} data-testid="time-display">
          {remaining}
        </div>
      </div>

      <div className={styles.phase}>
        {phase === 'finished' ? (
          'Workout Complete!'
        ) : (
          <>
            {phase} (Round {round})
          </>
        )}
      </div>
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
