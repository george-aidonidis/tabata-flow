import type { Meta, StoryObj } from '@storybook/react-vite'
import { PauseSettings } from './PauseSettings'
import type { Settings } from '../types'

const meta: Meta<typeof PauseSettings> = {
  title: 'Components/PauseSettings',
  component: PauseSettings,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onUpdateSettings: { action: 'settings-updated' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const defaultSettings: Settings = {
  cycles: 3,
  sets: 8,
  work: 20,
  shortBreak: 10,
  longBreak: 60,
}

export const EarlyInWorkout: Story = {
  args: {
    settings: defaultSettings,
    currentCycle: 1,
    currentSet: 2,
    onUpdateSettings: () => {},
  },
}

export const MidWorkout: Story = {
  args: {
    settings: defaultSettings,
    currentCycle: 2,
    currentSet: 5,
    onUpdateSettings: () => {},
  },
}

export const NearEnd: Story = {
  args: {
    settings: defaultSettings,
    currentCycle: 3,
    currentSet: 7,
    onUpdateSettings: () => {},
  },
}

export const LastRound: Story = {
  args: {
    settings: defaultSettings,
    currentCycle: 3,
    currentSet: 8,
    onUpdateSettings: () => {},
  },
}

export const SingleRoundWorkout: Story = {
  args: {
    settings: {
      cycles: 1,
      sets: 6,
      work: 30,
      shortBreak: 15,
      longBreak: 60,
    },
    currentCycle: 1,
    currentSet: 3,
    onUpdateSettings: () => {},
  },
}

export const Interactive: Story = {
  render: (args) => {
    return (
      <div style={{ width: '400px', padding: '1rem', background: '#22525c' }}>
        <PauseSettings {...args} />
      </div>
    )
  },
  args: {
    settings: defaultSettings,
    currentCycle: 2,
    currentSet: 4,
    onUpdateSettings: (newSettings: Settings) => {
      console.log('Settings updated:', newSettings)
    },
  },
}
