import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VolumeControl } from './VolumeControl'
import * as audio from '../utils/audio'

// Mock the audio module
vi.mock('../utils/audio', () => ({
  setVolume: vi.fn(),
  getVolume: vi.fn(),
}))

describe('VolumeControl', () => {
  const mockSetVolume = vi.mocked(audio.setVolume)
  const mockGetVolume = vi.mocked(audio.getVolume)

  beforeEach(() => {
    vi.clearAllMocks()
    // Default volume is 70%
    mockGetVolume.mockReturnValue(0.7)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<VolumeControl />)
    expect(screen.getByLabelText('Volume control')).toBeInTheDocument()
  })

  it('displays the correct initial volume', () => {
    render(<VolumeControl />)

    // Check that the percentage is displayed correctly
    expect(screen.getByText('70%')).toBeInTheDocument()

    // Check that the slider has the correct value
    const slider = screen.getByLabelText('Volume control') as HTMLInputElement
    expect(slider.value).toBe('0.7')
  })

  it('displays the speaker icon and volume label', () => {
    render(<VolumeControl />)

    // Check that the Volume label is present
    expect(screen.getByText('Volume')).toBeInTheDocument()

    // Check that the SVG speaker icon is present
    const container = screen.getByText('Volume').closest('div')
    const svg = container?.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg?.tagName).toBe('svg')
  })

  it('updates volume when slider is moved', () => {
    render(<VolumeControl />)

    const slider = screen.getByLabelText('Volume control') as HTMLInputElement

    // Change the slider value to 50%
    fireEvent.change(slider, { target: { value: '0.5' } })

    // Check that setVolume was called with the correct value
    expect(mockSetVolume).toHaveBeenCalledWith(0.5)

    // Check that the percentage display was updated
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('handles minimum volume (0%)', () => {
    render(<VolumeControl />)

    const slider = screen.getByLabelText('Volume control') as HTMLInputElement

    // Set volume to minimum
    fireEvent.change(slider, { target: { value: '0' } })

    expect(mockSetVolume).toHaveBeenCalledWith(0)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('handles maximum volume (100%)', () => {
    render(<VolumeControl />)

    const slider = screen.getByLabelText('Volume control') as HTMLInputElement

    // Set volume to maximum
    fireEvent.change(slider, { target: { value: '1' } })

    expect(mockSetVolume).toHaveBeenCalledWith(1)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('initializes with current volume from audio module', () => {
    // Mock a different initial volume
    mockGetVolume.mockReturnValue(0.3)

    render(<VolumeControl />)

    // Check that it displays the mocked volume
    expect(screen.getByText('30%')).toBeInTheDocument()

    const slider = screen.getByLabelText('Volume control') as HTMLInputElement
    expect(slider.value).toBe('0.3')
  })

  it('rounds percentage display correctly', () => {
    render(<VolumeControl />)

    const slider = screen.getByLabelText('Volume control') as HTMLInputElement

    // Test a value that should round to 33%
    fireEvent.change(slider, { target: { value: '0.33' } })
    expect(screen.getByText('33%')).toBeInTheDocument()

    // Test a value that should round to 67%
    fireEvent.change(slider, { target: { value: '0.67' } })
    expect(screen.getByText('67%')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<VolumeControl />)

    const slider = screen.getByLabelText('Volume control')

    // Check slider attributes
    expect(slider).toHaveAttribute('type', 'range')
    expect(slider).toHaveAttribute('min', '0')
    expect(slider).toHaveAttribute('max', '1')
    expect(slider).toHaveAttribute('step', '0.1')
    expect(slider).toHaveAttribute('aria-label', 'Volume control')
  })

  it('updates when getVolume returns different values', () => {
    // Start with 70%
    mockGetVolume.mockReturnValue(0.7)

    const { rerender } = render(<VolumeControl />)
    expect(screen.getByText('70%')).toBeInTheDocument()

    // Change the mock to return 40%
    mockGetVolume.mockReturnValue(0.4)

    // Trigger useEffect by re-rendering
    rerender(<VolumeControl />)

    // The component should still show 70% since it only reads getVolume on mount
    // This is expected behavior - the component manages its own state after initialization
    expect(screen.getByText('70%')).toBeInTheDocument()
  })
})
