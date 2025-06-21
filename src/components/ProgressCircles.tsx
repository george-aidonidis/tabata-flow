import React from 'react'
import styles from './ProgressCircles.module.css'

interface ProgressCirclesProps {
  currentCycle: number
  totalCycles: number
  currentSet: number
  totalSets: number
}

export function ProgressCircles({
  currentCycle,
  totalCycles,
  currentSet,
  totalSets,
}: ProgressCirclesProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        {[...Array(totalCycles)].map((_, i) => (
          <div
            key={i}
            className={
              i + 1 < currentCycle
                ? styles.completed
                : i + 1 === currentCycle
                  ? styles.current
                  : styles.incomplete
            }
          >
            {i + 1}
          </div>
        ))}
      </div>
      <div className={styles.row}>
        {[...Array(totalSets)].map((_, i) => (
          <div
            key={i}
            className={
              i + 1 < currentSet
                ? styles.completed
                : i + 1 === currentSet
                  ? styles.current
                  : styles.incomplete
            }
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  )
}
