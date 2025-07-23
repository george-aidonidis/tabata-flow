import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <img
        src="/tabata-icon.svg"
        alt="Tabata Timer Icon"
        className={styles.icon}
      />
      <span className={styles.title}>Tabata Timer</span>
    </header>
  )
}
