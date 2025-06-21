import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import type { Settings } from '../types'

const defaultSettings: Settings = {
  work: 20,
  shortBreak: 10,
  longBreak: 60,
  sets: 8,
  cycles: 1,
}

const loadSettings = (): Settings => {
  try {
    const stored = localStorage.getItem('tabata-settings')
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.error('Failed to load settings from localStorage', error)
  }
  return defaultSettings
}

interface SettingsContextValue {
  settings: Settings
  saveSettings: (newSettings: Settings) => void
}

export const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(loadSettings)

  useEffect(() => {
    try {
      localStorage.setItem('tabata-settings', JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save settings to localStorage', error)
    }
  }, [settings])

  const saveSettings = (newSettings: Settings) => {
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
