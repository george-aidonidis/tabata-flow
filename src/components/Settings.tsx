import { useState, useContext } from 'react'
import { SettingsContext } from '../context/SettingsContext'
import type { Settings } from '../types'
import styles from './Settings.module.css'
import { ProgressCircles } from './ProgressCircles'

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

  return (
    <form
      className={styles.container}
      data-testid="settings-container"
      onSubmit={handleSubmit}
    >
      <div
        style={{
          textAlign: 'center',
          fontSize: '2.2rem',
          fontWeight: 700,
          color: '#2d3a40',
          marginBottom: '1.2rem',
          letterSpacing: '0.04em',
        }}
      >
        Prepare
      </div>
      <ProgressCircles
        currentCycle={1}
        totalCycles={settings.cycles}
        currentSet={1}
        totalSets={settings.sets}
      />
      <div className={styles.grid}>
        {/* All settings as cards in a single row */}
        <div className={styles.card}>
          <span className={styles.cardLabel}>Cycles</span>
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
      </div>
      <button type="submit">Start Workout</button>
    </form>
  )
}
