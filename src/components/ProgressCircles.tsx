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
    <div className={styles.wrapper} data-testid="progress-circles">
      {/* Always render rounds row but make invisible when totalCycles = 1 to prevent layout shift */}
      <div className={styles.row} style={{ opacity: totalCycles > 1 ? 1 : 0 }}>
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
          />
        ))}
      </div>
      {/* Always show sets row */}
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
          />
        ))}
      </div>
    </div>
  )
}
