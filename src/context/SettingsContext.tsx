import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import type { TimerSettings } from '../types'

const defaultSettings: TimerSettings = {
  prepare: 10,
  work: 20,
  rest: 10,
  rounds: 8,
}

const loadSettings = (): TimerSettings => {
  try {
    const stored = localStorage.getItem('tabata-settings')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load settings from localStorage', error)
  }
  return defaultSettings
}

interface SettingsContextValue {
  settings: TimerSettings
  saveSettings: (newSettings: TimerSettings) => void
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<TimerSettings>(loadSettings)

  useEffect(() => {
    try {
      localStorage.setItem('tabata-settings', JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save settings to localStorage', error)
    }
  }, [settings])

  const saveSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings)
  }

  return (
    <SettingsContext.Provider value={{ settings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
