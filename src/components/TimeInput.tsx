import { useState, useEffect } from 'react'
import styles from './TimeInput.module.css'

interface TimeInputProps {
  label: string
  value: number // value in seconds
  min: number // minimum seconds
  max: number // maximum seconds
  onChange: (value: number) => void
  id?: string
  name?: string
}

// Convert seconds to m:ss format
function secondsToTimeString(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Convert m:ss format to seconds
function timeStringToSeconds(timeString: string): number | null {
  const trimmed = timeString.trim()

  // Handle just seconds (e.g., "30")
  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10)
  }

  // Handle m:ss format (e.g., "2:30")
  const match = trimmed.match(/^(\d+):(\d{1,2})$/)
  if (!match) return null

  const minutes = parseInt(match[1], 10)
  const seconds = parseInt(match[2], 10)

  if (seconds >= 60) return null

  return minutes * 60 + seconds
}

export function TimeInput({
  label,
  value,
  min,
  max,
  onChange,
  id,
  name,
}: TimeInputProps) {
  const [inputValue, setInputValue] = useState(secondsToTimeString(value))

  useEffect(() => {
    setInputValue(secondsToTimeString(value))
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleBlur = () => {
    const seconds = timeStringToSeconds(inputValue)

    if (seconds === null) {
      // Invalid format, revert to current value
      setInputValue(secondsToTimeString(value))
      return
    }

    const clampedValue = Math.max(min, Math.min(max, seconds))
    setInputValue(secondsToTimeString(clampedValue))
    onChange(clampedValue)
  }

  const handleIncrement = () => {
    const increment = value < 60 ? 5 : 15 // 5 sec increments under 1 min, 15 sec above
    const newValue = Math.min(max, value + increment)
    onChange(newValue)
  }

  const handleDecrement = () => {
    const decrement = value <= 60 ? 5 : 15 // 5 sec decrements under 1 min, 15 sec above
    const newValue = Math.max(min, value - decrement)
    onChange(newValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      handleIncrement()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      handleDecrement()
    }
  }

  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.inputGroup}>
        <button
          type="button"
          className={styles.decrementButton}
          onClick={handleDecrement}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <input
          type="text"
          id={id}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={styles.input}
          placeholder="m:ss"
        />
        <button
          type="button"
          className={styles.incrementButton}
          onClick={handleIncrement}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  )
}
