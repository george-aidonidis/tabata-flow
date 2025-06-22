import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings } from './Settings'
import { SettingsContext } from '../context/SettingsContext'
import { useState } from 'react'
import type { Settings as SettingsType } from '../types'

interface StoryArgs {
  onStart: (settings: SettingsType) => void
  initialSettings: SettingsType
}

const meta: Meta<typeof Settings> = {
  title: 'Components/Settings',
  component: Settings,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onStart: { action: 'start-workout' },
  },
}

export default meta
type Story = StoryObj<StoryArgs>

// Mock settings provider
const MockSettingsProvider = ({
  children,
  initialSettings,
}: {
  children: React.ReactNode
  initialSettings: SettingsType
}) => {
  const [settings, setSettings] = useState<SettingsType>(initialSettings)

  const contextValue = {
    settings,
    saveSettings: (newSettings: SettingsType) => {
      setSettings(newSettings)
    },
  }

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  )
}

const Template = (args: StoryArgs) => (
  <MockSettingsProvider initialSettings={args.initialSettings}>
    <div style={{ width: '600px', maxWidth: '100vw' }}>
      <Settings onStart={args.onStart} />
    </div>
  </MockSettingsProvider>
)

export const Default: Story = {
  render: Template,
  args: {
    onStart: () => {},
    initialSettings: {
      cycles: 2,
      sets: 8,
      work: 20,
      shortBreak: 10,
      longBreak: 60,
    },
  },
}

export const QuickWorkout: Story = {
  render: Template,
  args: {
    onStart: () => {},
    initialSettings: {
      cycles: 1,
      sets: 4,
      work: 15,
      shortBreak: 5,
      longBreak: 30,
    },
  },
}

export const LongWorkout: Story = {
  render: Template,
  args: {
    onStart: () => {},
    initialSettings: {
      cycles: 5,
      sets: 12,
      work: 45,
      shortBreak: 15,
      longBreak: 120,
    },
  },
}

export const MaxValues: Story = {
  render: Template,
  args: {
    onStart: () => {},
    initialSettings: {
      cycles: 50,
      sets: 50,
      work: 240, // 4:00
      shortBreak: 120, // 2:00
      longBreak: 240, // 4:00
    },
  },
}

export const MinimalBreaks: Story = {
  render: Template,
  args: {
    onStart: () => {},
    initialSettings: {
      cycles: 3,
      sets: 6,
      work: 30,
      shortBreak: 0,
      longBreak: 0,
    },
  },
}

export const SingleRound: Story = {
  render: Template,
  args: {
    onStart: () => {},
    initialSettings: {
      cycles: 1,
      sets: 8,
      work: 20,
      shortBreak: 10,
      longBreak: 60, // This won't be shown since cycles = 1
    },
  },
}
