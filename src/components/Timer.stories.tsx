import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timer } from './Timer'

const defaultSettings = {
  work: 20,
  shortBreak: 10,
  longBreak: 60,
  sets: 8,
  cycles: 1,
}

const meta: Meta<typeof Timer> = {
  title: 'Components/Timer',
  component: Timer,
  parameters: {
    layout: 'centered',
  },
  args: {
    settings: defaultSettings,
    onReset: () => console.log('Reset clicked'),
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SingleRound: Story = {
  args: {
    settings: {
      ...defaultSettings,
      cycles: 1,
    },
  },
}

export const MultipleRounds: Story = {
  args: {
    settings: {
      ...defaultSettings,
      cycles: 4,
    },
  },
}

export const ShortWorkout: Story = {
  args: {
    settings: {
      ...defaultSettings,
      work: 10,
      shortBreak: 5,
      sets: 4,
    },
  },
}