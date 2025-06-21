import { useState } from 'react'
import type { TimerSettings } from './types'
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
    <div>
      <Header />
      {screen === 'settings' || settings === null ? (
        <Settings onStart={handleStart} />
      ) : (
        <Timer settings={settings} onReset={handleReset} />
      )}
    </div>
  )
}

export default App
