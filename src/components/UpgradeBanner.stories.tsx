import type { Meta, StoryObj } from '@storybook/react-vite'
import { UpgradeBanner } from './UpgradeBanner'

const meta: Meta<typeof UpgradeBanner> = {
  title: 'Components/UpgradeBanner',
  component: UpgradeBanner,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithCustomClass: Story = {
  args: {
    className: 'custom-banner-class',
  },
}

// Story showing the banner ad in context
export const InContext: Story = {
  render: () => (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#1a1a1a',
      }}
    >
      <div
        style={{
          flex: 1,
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1 style={{ color: 'white', fontSize: '2rem' }}>Main App Content</h1>
      </div>
      <UpgradeBanner />
      <footer
        style={{
          textAlign: 'center',
          padding: '1rem',
          color: 'rgba(255, 255, 255, 0.7)',
        }}
      >
        Footer content
      </footer>
    </div>
  ),
}

// Story showing just the banner ad component
export const BannerOnly: Story = {
  render: () => (
    <div
      style={{
        background: '#1a1a1a',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'end',
      }}
    >
      <UpgradeBanner />
    </div>
  ),
}

// Story showing mobile view
export const MobileView: Story = {
  render: () => (
    <div
      style={{
        maxWidth: '375px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#1a1a1a',
      }}
    >
      <div
        style={{
          flex: 1,
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h2 style={{ color: 'white', fontSize: '1.5rem', textAlign: 'center' }}>
          Mobile App Content
        </h2>
      </div>
      <UpgradeBanner />
      <footer
        style={{
          textAlign: 'center',
          padding: '1rem',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.8rem',
        }}
      >
        Footer content
      </footer>
    </div>
  ),
}
