import { useState, useRef } from 'react'
import type { Settings } from '../types'
import styles from './PauseSettings.module.css'
import { NumberInput } from './NumberInput'

interface PauseSettingsProps {
  settings: Settings
  onUpdateSettings: (newSettings: Settings) => void
  currentCycle: number
  currentSet: number
}

export function PauseSettings({
  settings,
  onUpdateSettings,
  currentCycle,
  currentSet,
}: PauseSettingsProps) {
  const [localSettings, setLocalSettings] = useState<Settings>(settings)
  // Store original settings on first render - use ref since it never changes
  const originalSettingsRef = useRef<Settings>(settings)
  const originalSettings = originalSettingsRef.current

  const handleNumberChange = (field: keyof Settings) => (value: number) => {
    const newSettings = { ...localSettings, [field]: value }
    setLocalSettings(newSettings)
    onUpdateSettings(newSettings)
  }

  // Calculate minimum values based on current position
  const minCycles = currentCycle
  const minSets = currentCycle === localSettings.cycles ? currentSet : 1

  // Determine what the user is extending compared to original workout
  const isExtendingRounds = localSettings.cycles > originalSettings.cycles
  const isExtendingSets = localSettings.sets > originalSettings.sets
  const isExtending = isExtendingRounds || isExtendingSets

  // Generate contextual warning message
  const getWarningMessage = () => {
    if (isExtendingRounds && isExtendingSets) {
      return '⚠️ Adding rounds and sets will extend your workout'
    } else if (isExtendingRounds) {
      return '⚠️ Adding rounds will extend your workout'
    } else if (isExtendingSets) {
      return '⚠️ Adding sets will extend your current round'
    }
    return ''
  }

  return (
    <div className={styles.container} data-testid="pause-settings">
      <h3 className={styles.title}>Adjust Workout</h3>
      <div className={styles.info}>
        Currently at Round {currentCycle}, Set {currentSet}
      </div>

      <div className={styles.grid}>
        <NumberInput
          label="Rounds"
          value={localSettings.cycles}
          min={minCycles}
          max={50}
          onChange={handleNumberChange('cycles')}
          id="pause-cycles"
          name="cycles"
        />

        <NumberInput
          label="Sets"
          value={localSettings.sets}
          min={minSets}
          max={50}
          onChange={handleNumberChange('sets')}
          id="pause-sets"
          name="sets"
        />
      </div>

      {isExtending && (
        <div className={styles.warning}>{getWarningMessage()}</div>
      )}
    </div>
  )
}
