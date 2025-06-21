import { useReducer, useEffect, useRef, useCallback, useState } from 'react'
import type { TimerState, TimerAction, Settings } from '../types'
import { playSound } from '../utils/audio'

function getInitialState(): TimerState {
  return {
    phase: 'prepare',
    remaining: 5,
    set: 1,
    cycle: 1,
  }
}

function createReducer(settings: Settings) {
  return function reducer(state: TimerState, action: TimerAction): TimerState {
    if (state.phase === 'finished') {
      return state
    }
    switch (action.type) {
      case 'DECREMENT':
        if (state.remaining > 1) {
          return { ...state, remaining: state.remaining - 1 }
        }
        return { ...state, remaining: 0 }
      case 'NEXT_PHASE': {
        // PHASE TRANSITION LOGIC
        const { phase, set, cycle } = state
        if (phase === 'prepare') {
          return {
            ...state,
            phase: 'work',
            remaining: settings.work,
            set: 1,
            cycle: 1,
          }
        }
        if (phase === 'work') {
          // If not last set in cycle, go to short break
          if (set < settings.sets) {
            return {
              ...state,
              phase: 'shortBreak',
              remaining: settings.shortBreak,
            }
          } else {
            // Last set in cycle: if not last cycle, go to long break, else finish
            if (cycle < settings.cycles) {
              return {
                ...state,
                phase: 'longBreak',
                remaining: settings.longBreak,
              }
            } else {
              return {
                ...state,
                phase: 'finished',
                remaining: 0,
              }
            }
          }
        }
        if (phase === 'shortBreak') {
          // After short break, next set
          return {
            ...state,
            phase: 'work',
            remaining: settings.work,
            set: state.set + 1,
          }
        }
        if (phase === 'longBreak') {
          // After long break, next cycle
          return {
            ...state,
            phase: 'work',
            remaining: settings.work,
            set: 1,
            cycle: state.cycle + 1,
          }
        }
        return state
      }
      case 'RESET':
        return getInitialState()
      default:
        return state
    }
  }
}

export function useTabata(settings: Settings) {
  const initialState = getInitialState()
  const reducer = createReducer(settings)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [isRunning, setIsRunning] = useState(true)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (state.remaining === 0 && state.phase !== 'finished') {
      dispatch({ type: 'NEXT_PHASE' })
      if (
        (state.phase === 'work' &&
          state.set === settings.sets &&
          state.cycle === settings.cycles) ||
        (state.phase === 'work' &&
          state.set === settings.sets &&
          state.cycle < settings.cycles)
      ) {
        playSound('finish')
      } else if (state.phase === 'work') {
        playSound('start')
      } else if (state.phase === 'shortBreak' || state.phase === 'longBreak') {
        playSound('start')
      }
    } else if (state.remaining > 0 && state.remaining <= 3 && isRunning) {
      playSound('countdown')
    }
  }, [
    state.remaining,
    state.phase,
    isRunning,
    settings,
    state.set,
    state.cycle,
  ])

  useEffect(() => {
    if (isRunning) {
      console.log('Starting interval')
      timerRef.current = window.setInterval(() => {
        dispatch({ type: 'DECREMENT' })
      }, 1000)
    } else {
      console.log('Clearing interval')
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        console.log('Cleanup: interval cleared')
      }
    }
  }, [isRunning])

  const togglePause = useCallback(() => {
    setIsRunning((prev) => !prev)
  }, [])

  const reset = useCallback(() => {
    setIsRunning(false)
    dispatch({ type: 'RESET' })
  }, [])

  return { state, isRunning, togglePause, reset }
}
