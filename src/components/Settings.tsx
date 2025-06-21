import { useState, useContext } from 'react'
import { SettingsContext } from '../context/SettingsContext'
import type { Settings } from '../types'
import styles from './Settings.module.css'
import { ProgressCircles } from './ProgressCircles'
import { ProgressRing } from './ProgressRing'

interface SettingsProps {
  onStart: (settings: Settings) => void
}

export function Settings({ onStart }: SettingsProps) {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('SettingsContext not found')
  const { settings: initialSettings, saveSettings } = context
  const [settings, setSettings] = useState<Settings>(initialSettings)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveSettings(settings)
    onStart(settings)
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setSettings((prev: Settings) => ({ ...prev, [name]: Number(value) }))
  }

  // Calculate progress for the work duration ring (always full for settings preview)
  const workProgress = 1.0

  return (
    <form
      className={styles.container}
      data-testid="settings-container"
      onSubmit={handleSubmit}
    >
      <div className={styles.timerContainer}>
        {/* Prepare title inside the white container */}
        <div className={styles.prepareTitle}>Prepare</div>

        <div
          style={{
            position: 'relative',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <ProgressRing phase="work" progress={workProgress} />

          {/* Large number in center */}
          <div className={styles.timerNumber}>{settings.work}</div>
        </div>
      </div>

      {/* Always show progress circles - they'll handle the conditional logic internally */}
      <ProgressCircles
        currentCycle={1}
        totalCycles={settings.cycles}
        currentSet={1}
        totalSets={settings.sets}
      />

      <div className={styles.grid}>
        {/* All settings as cards in a single row */}
        <div className={styles.card}>
          <span className={styles.cardLabel}>Rounds</span>
          <span className={styles.cardSelectWrapper}>
            <select
              className={styles.cardSelect}
              id="cycles"
              name="cycles"
              value={settings.cycles}
              onChange={handleChange}
            >
              {[...Array(16)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Sets</span>
          <span className={styles.cardSelectWrapper}>
            <select
              className={styles.cardSelect}
              id="sets"
              name="sets"
              value={settings.sets}
              onChange={handleChange}
            >
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Work</span>
          <span className={styles.cardSelectWrapper}>
            <select
              className={styles.cardSelect}
              id="work"
              name="work"
              value={settings.work}
              onChange={handleChange}
            >
              {[20, 30, 40, 45, 50, 60, 70, 80, 90].map((v) => (
                <option key={v} value={v}>
                  {v} seconds
                </option>
              ))}
            </select>
          </span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Short Break</span>
          <span className={styles.cardSelectWrapper}>
            <select
              className={styles.cardSelect}
              id="shortBreak"
              name="shortBreak"
              value={settings.shortBreak}
              onChange={handleChange}
            >
              {[0, 5, 10, 15, 20, 25, 30].map((v) => (
                <option key={v} value={v}>
                  {v} seconds
                </option>
              ))}
            </select>
          </span>
        </div>
        {/* Only show Long Break card when there's more than 1 round */}
        {settings.cycles > 1 && (
          <div className={styles.card}>
            <span className={styles.cardLabel}>Long Break</span>
            <span className={styles.cardSelectWrapper}>
              <select
                className={styles.cardSelect}
                id="longBreak"
                name="longBreak"
                value={settings.longBreak}
                onChange={handleChange}
              >
                {[0, 10, 20, 30, 40, 50, 60].map((v) => (
                  <option key={v} value={v}>
                    {v} seconds
                  </option>
                ))}
              </select>
            </span>
          </div>
        )}
      </div>
      <button type="submit">Start Workout</button>
    </form>
  )
}
