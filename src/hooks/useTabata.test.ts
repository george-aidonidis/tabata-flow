import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTabata } from './useTabata'
import type { Settings } from '../types'
import * as audio from '../utils/audio'

// Mock the audio module
vi.mock('../utils/audio', () => ({
  playSound: vi.fn(),
  setVolume: vi.fn(),
  getVolume: vi.fn(),
  initAudio: vi.fn(),
  cleanupAudio: vi.fn(),
}))

const testSettings: Settings = {
  work: 3,
  shortBreak: 2,
  longBreak: 4,
  sets: 2,
  cycles: 2,
}

describe('useTabata hook', () => {
  const mockPlaySound = vi.mocked(audio.playSound)

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with the prepare phase and be running', () => {
    const { result } = renderHook(() => useTabata(testSettings))
    expect(result.current.state.phase).toBe('prepare')
    expect(result.current.state.remaining).toBe(5)
    expect(result.current.state.set).toBe(1)
    expect(result.current.state.cycle).toBe(1)
    expect(result.current.isRunning).toBe(true)
  })

  it('should transition through a full round and sets, including breaks', () => {
    const { result } = renderHook(() => useTabata(testSettings))
    // Prepare → Work
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(result.current.state.phase).toBe('work')
    expect(result.current.state.set).toBe(1)
    expect(result.current.state.cycle).toBe(1)
    // Work → Short Break
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.state.phase).toBe('shortBreak')
    expect(result.current.state.set).toBe(1)
    // Short Break → Work (set 2)
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(result.current.state.phase).toBe('work')
    expect(result.current.state.set).toBe(2)
    // Work (set 2) → Long Break (end of round 1)
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.state.phase).toBe('longBreak')
    expect(result.current.state.set).toBe(2)
    expect(result.current.state.cycle).toBe(1)
    // Long Break → Work (round 2, set 1)
    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(result.current.state.phase).toBe('work')
    expect(result.current.state.set).toBe(1)
    expect(result.current.state.cycle).toBe(2)
    // Work → Short Break (round 2)
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.state.phase).toBe('shortBreak')
    expect(result.current.state.set).toBe(1)
    expect(result.current.state.cycle).toBe(2)
    // Short Break → Work (round 2, set 2)
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(result.current.state.phase).toBe('work')
    expect(result.current.state.set).toBe(2)
    // Work (round 2, set 2) → Finished
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.state.phase).toBe('finished')
    expect(result.current.state.cycle).toBe(2)
  })

  it('should pause and resume the timer', () => {
    const { result } = renderHook(() => useTabata(testSettings))
    // Pause the timer
    act(() => {
      result.current.togglePause()
    })
    expect(result.current.isRunning).toBe(false)
    // Advance time, but state should not change
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(result.current.state.remaining).toBe(5)
    // Resume the timer
    act(() => {
      result.current.togglePause()
    })
    expect(result.current.isRunning).toBe(true)
    // After resuming, the first tick happens immediately
    expect(result.current.state.remaining).toBe(5)
    // Advance time, and now state should change again
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.state.remaining).toBe(4)
  })

  it('should reset the timer to the initial state', () => {
    const { result } = renderHook(() => useTabata(testSettings))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(result.current.state.phase).toBe('work')
    act(() => {
      result.current.reset()
    })
    expect(result.current.state.phase).toBe('prepare')
    expect(result.current.state.remaining).toBe(5)
    expect(result.current.state.set).toBe(1)
    expect(result.current.state.cycle).toBe(1)
    expect(result.current.isRunning).toBe(false)
  })

  it('should update settings mid-workout', () => {
    const { result } = renderHook(() => useTabata(testSettings))

    // Advance to work phase
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(result.current.state.phase).toBe('work')
    expect(result.current.state.set).toBe(1)
    expect(result.current.state.cycle).toBe(1)

    // Pause the timer first (updateSettings only works when paused)
    act(() => {
      result.current.togglePause()
    })
    expect(result.current.isRunning).toBe(false)

    // Update settings to extend the workout
    const newSettings: Settings = {
      ...testSettings,
      sets: 3, // Increase from 2 to 3
      cycles: 3, // Increase from 2 to 3
      work: 5, // Increase work duration
    }

    act(() => {
      result.current.updateSettings(newSettings)
    })

    // Verify the settings were updated
    expect(result.current.state.set).toBe(1)
    expect(result.current.state.cycle).toBe(1)
    expect(result.current.state.phase).toBe('work')
    // The remaining time should be adjusted proportionally
    expect(result.current.state.remaining).toBeGreaterThan(0)
  })

  it('should handle reducing settings below current position', () => {
    const { result } = renderHook(() => useTabata(testSettings))

    // Advance to second set of first cycle
    act(() => {
      vi.advanceTimersByTime(5000) // prepare
    })
    act(() => {
      vi.advanceTimersByTime(3000) // work
    })
    act(() => {
      vi.advanceTimersByTime(2000) // short break
    })
    expect(result.current.state.phase).toBe('work')
    expect(result.current.state.set).toBe(2)

    // Pause the timer first (updateSettings only works when paused)
    act(() => {
      result.current.togglePause()
    })
    expect(result.current.isRunning).toBe(false)

    // Try to reduce sets to 1 (less than current set 2)
    const newSettings: Settings = {
      ...testSettings,
      sets: 1, // Reduce from 2 to 1
    }

    act(() => {
      result.current.updateSettings(newSettings)
    })

    // Should finish the workout gracefully
    expect(result.current.state.phase).toBe('finished')
  })

  it('should play sounds for different scenarios', () => {
    renderHook(() => useTabata(testSettings))

    // Test countdown sound (remaining <= 3)
    act(() => {
      vi.advanceTimersByTime(2000) // advance to 3 seconds remaining
    })
    expect(mockPlaySound).toHaveBeenCalledWith('countdown', 0.1)

    // Test phase transition: prepare → work
    act(() => {
      vi.advanceTimersByTime(3000) // complete prepare phase
    })
    expect(mockPlaySound).toHaveBeenCalledWith('work')

    // Test phase transition: work → rest (not final set)
    act(() => {
      vi.advanceTimersByTime(3000) // complete work phase
    })
    expect(mockPlaySound).toHaveBeenCalledWith('rest')

    // Test phase transition: rest → work
    act(() => {
      vi.advanceTimersByTime(2000) // complete short break
    })
    expect(mockPlaySound).toHaveBeenCalledWith('work')

    // Test phase transition: work → long break (end of set)
    act(() => {
      vi.advanceTimersByTime(3000) // complete work phase
    })
    expect(mockPlaySound).toHaveBeenCalledWith('rest')

    // Test phase transition: long break → work (next cycle)
    act(() => {
      vi.advanceTimersByTime(4000) // complete long break
    })
    expect(mockPlaySound).toHaveBeenCalledWith('work')

    // Test phase transition: work → rest (not final set of final cycle)
    act(() => {
      vi.advanceTimersByTime(3000) // complete work phase
    })
    expect(mockPlaySound).toHaveBeenCalledWith('rest')

    // Test phase transition: rest → work
    act(() => {
      vi.advanceTimersByTime(2000) // complete short break
    })
    expect(mockPlaySound).toHaveBeenCalledWith('work')

    // Test phase transition: work → finish (final set of final cycle)
    act(() => {
      vi.advanceTimersByTime(3000) // complete work phase
    })
    expect(mockPlaySound).toHaveBeenCalledWith('finish')
  })
})
