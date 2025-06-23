import { useTabata } from '../hooks/useTabata'
import styles from './Timer.module.css'
import type { Settings } from '../types'
import { ProgressRing } from './ProgressRing'
import { ProgressCircles } from './ProgressCircles'
import { PauseSettings } from './PauseSettings'

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
  const {
    state,
    settings: currentSettings,
    isRunning,
    togglePause,
    reset,
    updateSettings,
  } = useTabata(settings)
  const { phase, remaining, set, cycle } = state

  const handleReset = () => {
    reset()
    onReset()
  }

  let totalTimeForPhase = 1
  if (phase === 'prepare') totalTimeForPhase = 5
  else if (phase === 'work') totalTimeForPhase = currentSettings.work
  else if (phase === 'shortBreak')
    totalTimeForPhase = currentSettings.shortBreak
  else if (phase === 'longBreak') totalTimeForPhase = currentSettings.longBreak

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
            {`Set ${set}/${currentSettings.sets} | Round ${cycle}/${currentSettings.cycles}`}
          </div>
        )}
      </div>

      {/* Show progress dots during all phases */}
      <ProgressCircles
        currentCycle={cycle}
        totalCycles={currentSettings.cycles}
        currentSet={set}
        totalSets={currentSettings.sets}
      />

      <div className={styles.controls}>
        {phase !== 'finished' && (
          <button onClick={togglePause}>
            {isRunning ? 'Pause' : 'Resume'}
          </button>
        )}
        <button onClick={handleReset}>Reset</button>
      </div>

      {/* Reserved space for pause settings to prevent layout shift */}
      <div className={styles.pauseSettingsContainer}>
        {!isRunning && phase !== 'prepare' && phase !== 'finished' && (
          <PauseSettings
            settings={currentSettings}
            onUpdateSettings={updateSettings}
            currentCycle={cycle}
            currentSet={set}
          />
        )}
      </div>
    </div>
  )
}
