import { useState } from 'react'
import type { Settings as TimerSettings } from './types'
import { Settings } from './components/Settings'
import { Timer } from './components/Timer'
import { Header } from './components/Header'
import { initAudio } from './utils/audio'
import { Footer } from './components/Footer'

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
      <Footer />
    </div>
  )
}

export default App
