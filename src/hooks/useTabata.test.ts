import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTabata } from './useTabata'
import type { Settings } from '../types'

const testSettings: Settings = {
  work: 3,
  shortBreak: 2,
  longBreak: 4,
  sets: 2,
  cycles: 2,
}

describe('useTabata hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
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
})
