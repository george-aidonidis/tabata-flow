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
      case 'UPDATE_SETTINGS': {
        // Handle mid-workout settings update with validation
        const newSettings = action.payload
        const { phase, set, cycle } = state

        // Validate current position against new settings
        const validatedCycle = Math.min(cycle, newSettings.cycles)
        const validatedSet = Math.min(set, newSettings.sets)

        // If we're beyond the new limits, finish the workout
        if (
          cycle > newSettings.cycles ||
          set > newSettings.sets ||
          (cycle === newSettings.cycles && set > newSettings.sets)
        ) {
          return {
            ...state,
            phase: 'finished',
            remaining: 0,
          }
        }

        // Update remaining time for current phase if needed
        let newRemaining = state.remaining
        if (phase === 'work' && newSettings.work !== settings.work) {
          // Keep the same proportion of time remaining
          const progress = (settings.work - state.remaining) / settings.work
          newRemaining = Math.max(
            1,
            Math.round(newSettings.work * (1 - progress)),
          )
        } else if (
          phase === 'shortBreak' &&
          newSettings.shortBreak !== settings.shortBreak
        ) {
          const progress =
            (settings.shortBreak - state.remaining) / settings.shortBreak
          newRemaining = Math.max(
            1,
            Math.round(newSettings.shortBreak * (1 - progress)),
          )
        } else if (
          phase === 'longBreak' &&
          newSettings.longBreak !== settings.longBreak
        ) {
          const progress =
            (settings.longBreak - state.remaining) / settings.longBreak
          newRemaining = Math.max(
            1,
            Math.round(newSettings.longBreak * (1 - progress)),
          )
        }

        return {
          ...state,
          set: validatedSet,
          cycle: validatedCycle,
          remaining: newRemaining,
        }
      }
      case 'RESET':
        return getInitialState()
      default:
        return state
    }
  }
}

export function useTabata(initialSettings: Settings) {
  const [settings, setSettings] = useState(initialSettings)
  const initialState = getInitialState()
  const reducer = createReducer(settings)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [isRunning, setIsRunning] = useState(true)
  const timerRef = useRef<number | null>(null)

  // Update settings mid-workout (only when paused)
  const updateSettings = useCallback(
    (newSettings: Settings) => {
      if (!isRunning) {
        setSettings(newSettings)
        dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings })
      }
    },
    [isRunning],
  )

  useEffect(() => {
    if (state.remaining === 0 && state.phase !== 'finished') {
      dispatch({ type: 'NEXT_PHASE' })

      // Determine what phase we're transitioning TO and play appropriate sound
      if (state.phase === 'prepare') {
        // prepare → work
        playSound('work')
      } else if (state.phase === 'work') {
        // work → rest (short or long break) OR finish
        if (state.set === settings.sets && state.cycle === settings.cycles) {
          // Last set of last cycle - workout finished
          playSound('finish')
        } else {
          // Going to rest phase
          playSound('rest')
        }
      } else if (state.phase === 'shortBreak' || state.phase === 'longBreak') {
        // rest → work
        playSound('work')
      }
    } else if (state.remaining > 0 && state.remaining <= 3 && isRunning) {
      playSound('countdown', 0.1)
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

  return { state, settings, isRunning, togglePause, reset, updateSettings }
}
