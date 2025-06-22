import type { Meta, StoryObj } from '@storybook/react-vite'
import { NumberInput } from './NumberInput'
import { useState } from 'react'

const meta: Meta<typeof NumberInput> = {
  title: 'Components/NumberInput',
  component: NumberInput,
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
  args: Parameters<typeof NumberInput>[0] & {
    onChange?: (value: number) => void
  },
) => {
  const [value, setValue] = useState(args.value)
  return (
    <div style={{ width: '200px' }}>
      <NumberInput
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

export const Rounds: Story = {
  render: Template,
  args: {
    label: 'Rounds',
    value: 2,
    min: 1,
    max: 50,
    id: 'rounds',
    name: 'rounds',
  },
}

export const Sets: Story = {
  render: Template,
  args: {
    label: 'Sets',
    value: 8,
    min: 1,
    max: 50,
    id: 'sets',
    name: 'sets',
  },
}

export const MinValue: Story = {
  render: Template,
  args: {
    label: 'Rounds',
    value: 1,
    min: 1,
    max: 50,
    id: 'rounds-min',
    name: 'rounds',
  },
}

export const MaxValue: Story = {
  render: Template,
  args: {
    label: 'Sets',
    value: 50,
    min: 1,
    max: 50,
    id: 'sets-max',
    name: 'sets',
  },
}

export const AllInputs: Story = {
  render: () => {
    const [rounds, setRounds] = useState(2)
    const [sets, setSets] = useState(8)

    return (
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          width: '500px',
        }}
      >
        <NumberInput
          label="Rounds"
          value={rounds}
          min={1}
          max={25}
          onChange={setRounds}
          id="rounds"
          name="rounds"
        />
        <NumberInput
          label="Sets"
          value={sets}
          min={1}
          max={25}
          onChange={setSets}
          id="sets"
          name="sets"
        />
      </div>
    )
  },
}
