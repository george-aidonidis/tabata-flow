import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProgressCircles } from './ProgressCircles'

const meta: Meta<typeof ProgressCircles> = {
  title: 'Components/ProgressCircles',
  component: ProgressCircles,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const SingleRound: Story = {
  args: {
    currentCycle: 1,
    totalCycles: 1,
    currentSet: 2,
    totalSets: 4,
  },
}

export const MultipleRounds: Story = {
  args: {
    currentCycle: 2,
    totalCycles: 3,
    currentSet: 3,
    totalSets: 8,
  },
}

export const FirstSet: Story = {
  args: {
    currentCycle: 1,
    totalCycles: 4,
    currentSet: 1,
    totalSets: 8,
  },
}

export const LastSet: Story = {
  args: {
    currentCycle: 4,
    totalCycles: 4,
    currentSet: 8,
    totalSets: 8,
  },
}