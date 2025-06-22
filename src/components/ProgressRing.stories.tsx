import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProgressRing } from './ProgressRing'

const meta: Meta<typeof ProgressRing> = {
  title: 'Components/ProgressRing',
  component: ProgressRing,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Prepare: Story = {
  args: {
    phase: 'prepare',
    progress: 0.7,
  },
}

export const Work: Story = {
  args: {
    phase: 'work',
    progress: 0.3,
  },
}

export const ShortBreak: Story = {
  args: {
    phase: 'shortBreak',
    progress: 0.8,
  },
}

export const LongBreak: Story = {
  args: {
    phase: 'longBreak',
    progress: 0.5,
  },
}

export const Finished: Story = {
  args: {
    phase: 'finished',
    progress: 1.0,
  },
}