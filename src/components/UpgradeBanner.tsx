import styles from './UpgradeBanner.module.css'

interface UpgradeBannerProps {
  className?: string
}

export const UpgradeBanner = ({ className = '' }: UpgradeBannerProps) => {
  return (
    <div className={`${styles.upgradeBanner} ${className}`}>
      <div className={styles.upgradeBannerContent}>
        <span className={styles.upgradeBannerText}>
          🚀 Upgrade to <strong>Pro</strong> for ad-free experience, unlimited
          presets & more!
        </span>
        <button className={styles.upgradeBannerButton}>Upgrade Now</button>
      </div>
    </div>
  )
}
