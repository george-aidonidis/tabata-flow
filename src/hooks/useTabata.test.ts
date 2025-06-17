import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTabata } from './useTabata'
import type { TimerSettings } from '../types'

const testSettings: TimerSettings = {
  prepare: 5,
  work: 10,
  rest: 5,
  rounds: 2,
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
    expect(result.current.isRunning).toBe(true)
  })

  it('should transition to work phase after prepare phase ends', () => {
    const { result } = renderHook(() => useTabata(testSettings))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(result.current.state.phase).toBe('work')
    expect(result.current.state.remaining).toBe(10)
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
      vi.advanceTimersByTime(2000)
    })
    expect(result.current.state.remaining).toBe(5)

    // Resume the timer
    act(() => {
      result.current.togglePause()
    })
    expect(result.current.isRunning).toBe(true)

    // Advance time, and now state should change
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(result.current.state.remaining).toBe(3)
  })

  it('should reset the timer to the initial state', () => {
    const { result } = renderHook(() => useTabata(testSettings))

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(result.current.state.remaining).toBe(3)

    act(() => {
      result.current.reset()
    })

    expect(result.current.state.phase).toBe('prepare')
    expect(result.current.state.remaining).toBe(5)
    expect(result.current.isRunning).toBe(false)
  })
})
