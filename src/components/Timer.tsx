import { useTabata } from '../hooks/useTabata'
import styles from './Timer.module.css'

export function Timer() {
  const { phase, remaining, round, start, pause, reset } = useTabata()

  return (
    <div className={styles.container} data-testid="timer-container">
      <div className={styles.phase}>
        {phase} (Round {round})
      </div>
      <div className={styles.time}>{remaining}</div>
      <div className={styles.controls}>
        <button onClick={start}>Start</button>
        <button onClick={pause}>Pause</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  )
}
