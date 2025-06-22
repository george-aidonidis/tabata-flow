import { useState, useEffect } from 'react'
import styles from './NumberInput.module.css'

interface NumberInputProps {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  id?: string
  name?: string
}

export function NumberInput({
  label,
  value,
  min,
  max,
  onChange,
  id,
  name,
}: NumberInputProps) {
  const [inputValue, setInputValue] = useState(value.toString())

  useEffect(() => {
    setInputValue(value.toString())
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleBlur = () => {
    const numValue = parseInt(inputValue, 10)
    if (isNaN(numValue)) {
      setInputValue(value.toString())
      return
    }

    const clampedValue = Math.max(min, Math.min(max, numValue))
    setInputValue(clampedValue.toString())
    onChange(clampedValue)
  }

  const handleIncrement = () => {
    const newValue = Math.min(max, value + 1)
    onChange(newValue)
  }

  const handleDecrement = () => {
    const newValue = Math.max(min, value - 1)
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
          inputMode="numeric"
          pattern="[0-9]*"
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
