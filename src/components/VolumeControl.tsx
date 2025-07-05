import { useState, useEffect } from 'react'
import { setVolume, getVolume } from '../utils/audio'
import styles from './VolumeControl.module.css'

export function VolumeControl() {
  const [volume, setVolumeState] = useState(getVolume())

  useEffect(() => {
    // Initialize component with current volume
    setVolumeState(getVolume())
  }, [])

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolumeState(newVolume)
    setVolume(newVolume)
  }

  return (
    <div className={styles.container}>
      <div className={styles.labelContainer}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
        <span className={styles.label}>Volume</span>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={handleVolumeChange}
        className={styles.slider}
        aria-label="Volume control"
      />
      <span className={styles.percentage}>{Math.round(volume * 100)}%</span>
    </div>
  )
}
