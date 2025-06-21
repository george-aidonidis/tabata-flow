import { useState } from 'react'
import type { Settings as TimerSettings } from './types'
import { Settings } from './components/Settings'
import { Timer } from './components/Timer'
import { Header } from './components/Header'
import { initAudio } from './utils/audio'

type AppScreen = 'settings' | 'timer'

function App() {
  const [screen, setScreen] = useState<AppScreen>('settings')
  const [settings, setSettings] = useState<TimerSettings | null>(null)

  const handleStart = (newSettings: TimerSettings) => {
    initAudio()
    setSettings(newSettings)
    setScreen('timer')
  }

  const handleReset = () => {
    setScreen('settings')
    setSettings(null)
  }

  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Header />
      <div style={{ flex: 1 }}>
        {screen === 'settings' || settings === null ? (
          <Settings onStart={handleStart} />
        ) : (
          <Timer settings={settings} onReset={handleReset} />
        )}
      </div>
      <footer
        style={{
          textAlign: 'center',
          padding: '1rem',
          fontSize: '0.85rem',
          color: 'rgba(255, 255, 255, 0.7)',
          marginTop: 'auto',
        }}
      >
        Made with ❤️ by{' '}
        <a
          href="https://iamgeorge.dev/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#2ec4b6',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#26b3a6'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#2ec4b6'
          }}
        >
          George
        </a>
      </footer>
    </div>
  )
}

export default App
