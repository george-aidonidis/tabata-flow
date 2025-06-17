import { useState } from 'react'
import { useSettings } from '../context/SettingsContext'
import type { TimerSettings } from '../types'
import styles from './Settings.module.css'

interface SettingsProps {
  onStart: (settings: TimerSettings) => void
}

export function Settings({ onStart }: SettingsProps) {
  const { settings: initialSettings, saveSettings } = useSettings()
  const [settings, setSettings] = useState<TimerSettings>(initialSettings)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveSettings(settings)
    onStart(settings)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: Number(value) }))
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h2>Settings</h2>
      <div className={styles.grid}>
        <label htmlFor="prepare">Prepare (s)</label>
        <input
          type="number"
          id="prepare"
          name="prepare"
          min="0"
          max="30"
          value={settings.prepare}
          onChange={handleChange}
        />
        <label htmlFor="work">Work (s)</label>
        <input
          type="number"
          id="work"
          name="work"
          min="1"
          max="90"
          value={settings.work}
          onChange={handleChange}
        />
        <label htmlFor="rest">Rest (s)</label>
        <input
          type="number"
          id="rest"
          name="rest"
          min="0"
          max="30"
          value={settings.rest}
          onChange={handleChange}
        />
        <label htmlFor="rounds">Rounds</label>
        <input
          type="number"
          id="rounds"
          name="rounds"
          min="1"
          max="16"
          value={settings.rounds}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Start Workout</button>
    </form>
  )
}
