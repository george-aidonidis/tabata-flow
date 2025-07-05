import type { Meta, StoryObj } from '@storybook/react-vite'
import { VolumeControl } from './VolumeControl'

const meta: Meta<typeof VolumeControl> = {
  title: 'Components/VolumeControl',
  component: VolumeControl,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // VolumeControl doesn't have props, but we can document its behavior
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <VolumeControl />,
  parameters: {
    docs: {
      description: {
        story:
          'The volume control component with speaker icon, slider, and percentage display.',
      },
    },
  },
}

export const InTimerContext: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        padding: '2rem',
        background: '#22525c',
        borderRadius: '1rem',
        minWidth: '300px',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
        }}
      >
        <button
          style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            borderRadius: '2rem',
            border: 'none',
            padding: '0.75rem 2.5rem',
            background: '#f5a623',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Resume
        </button>
        <button
          style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            borderRadius: '2rem',
            border: 'none',
            padding: '0.75rem 2.5rem',
            background: '#f5a623',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>
      <VolumeControl />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Volume control as it appears in the timer interface, below the Resume/Reset buttons with the dark background.',
      },
    },
  },
}

export const WithInteractionGuide: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        padding: '2rem',
      }}
    >
      <VolumeControl />
      <div
        style={{
          fontSize: '0.9rem',
          color: '#64748b',
          textAlign: 'center',
          maxWidth: '350px',
          lineHeight: '1.5',
        }}
      >
        <strong>Try it:</strong> Drag the slider to adjust volume from 0% to
        100%. The volume affects all timer sounds including countdown beeps,
        work/rest transitions, and workout completion sounds. The speaker icon
        is an SVG that works across all browsers and systems.
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo showing how the volume control works with updated guidance text.',
      },
    },
  },
}
