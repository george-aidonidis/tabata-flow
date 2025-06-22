import type { Meta, StoryObj } from '@storybook/react-vite'
import { TimeInput } from './TimeInput'
import { useState } from 'react'

const meta: Meta<typeof TimeInput> = {
  title: 'Components/TimeInput',
  component: TimeInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Template for interactive stories
const Template = (
  args: Parameters<typeof TimeInput>[0] & {
    onChange?: (value: number) => void
  },
) => {
  const [value, setValue] = useState(args.value)
  return (
    <div style={{ width: '200px' }}>
      <TimeInput
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
          args.onChange?.(newValue)
        }}
      />
    </div>
  )
}

export const Work: Story = {
  render: Template,
  args: {
    label: 'Work',
    value: 20, // 20 seconds
    min: 5,
    max: 240,
    id: 'work',
    name: 'work',
  },
}

export const ShortBreak: Story = {
  render: Template,
  args: {
    label: 'Short Break',
    value: 10, // 10 seconds
    min: 0,
    max: 120,
    id: 'shortBreak',
    name: 'shortBreak',
  },
}

export const LongBreak: Story = {
  render: Template,
  args: {
    label: 'Long Break',
    value: 60, // 1:00
    min: 0,
    max: 240,
    id: 'longBreak',
    name: 'longBreak',
  },
}

export const LongDuration: Story = {
  render: Template,
  args: {
    label: 'Work',
    value: 150, // 2:30
    min: 5,
    max: 240,
    id: 'work-long',
    name: 'work',
  },
}

export const ZeroValue: Story = {
  render: Template,
  args: {
    label: 'Short Break',
    value: 0, // 0:00
    min: 0,
    max: 120,
    id: 'shortBreak-zero',
    name: 'shortBreak',
  },
}

export const MaxValue: Story = {
  render: Template,
  args: {
    label: 'Work',
    value: 240, // 4:00
    min: 5,
    max: 240,
    id: 'work-max',
    name: 'work',
  },
}

export const AllTimeInputs: Story = {
  render: () => {
    const [work, setWork] = useState(20)
    const [shortBreak, setShortBreak] = useState(10)
    const [longBreak, setLongBreak] = useState(60)

    return (
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          width: '600px',
        }}
      >
        <TimeInput
          label="Work"
          value={work}
          min={5}
          max={240}
          onChange={setWork}
          id="work"
          name="work"
        />
        <TimeInput
          label="Short Break"
          value={shortBreak}
          min={0}
          max={120}
          onChange={setShortBreak}
          id="shortBreak"
          name="shortBreak"
        />
        <TimeInput
          label="Long Break"
          value={longBreak}
          min={0}
          max={240}
          onChange={setLongBreak}
          id="longBreak"
          name="longBreak"
        />
      </div>
    )
  },
}
