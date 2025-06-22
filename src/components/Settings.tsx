import { useState, useContext } from 'react'
import { SettingsContext } from '../context/SettingsContext'
import type { Settings } from '../types'
import styles from './Settings.module.css'
import { ProgressCircles } from './ProgressCircles'
import { ProgressRing } from './ProgressRing'
import { NumberInput } from './NumberInput'
import { TimeInput } from './TimeInput'

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

  const handleNumberChange = (field: keyof Settings) => (value: number) => {
    setSettings((prev: Settings) => ({ ...prev, [field]: value }))
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
        <NumberInput
          label="Rounds"
          value={settings.cycles}
          min={1}
          max={25}
          onChange={handleNumberChange('cycles')}
          id="cycles"
          name="cycles"
        />

        <NumberInput
          label="Sets"
          value={settings.sets}
          min={1}
          max={25}
          onChange={handleNumberChange('sets')}
          id="sets"
          name="sets"
        />

        <TimeInput
          label="Work"
          value={settings.work}
          min={5}
          max={240}
          onChange={handleNumberChange('work')}
          id="work"
          name="work"
        />

        <TimeInput
          label="Short Break"
          value={settings.shortBreak}
          min={0}
          max={120}
          onChange={handleNumberChange('shortBreak')}
          id="shortBreak"
          name="shortBreak"
        />

        {/* Only show Long Break card when there's more than 1 round */}
        {settings.cycles > 1 && (
          <TimeInput
            label="Long Break"
            value={settings.longBreak}
            min={0}
            max={240}
            onChange={handleNumberChange('longBreak')}
            id="longBreak"
            name="longBreak"
          />
        )}
      </div>

      <button type="submit">Start Workout</button>
    </form>
  )
}
