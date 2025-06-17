import { useReducer, useEffect, useRef, useCallback, useState } from 'react'
import type { TimerState, TimerAction, TimerSettings } from '../types'
import { playSound } from '../utils/audio'

function createReducer(settings: TimerSettings) {
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
      case 'NEXT_PHASE':
        switch (state.phase) {
          case 'prepare':
            return { ...state, phase: 'work', remaining: settings.work }
          case 'work':
            return { ...state, phase: 'rest', remaining: settings.rest }
          case 'rest':
            if (state.round < settings.rounds) {
              return {
                ...state,
                phase: 'work',
                remaining: settings.work,
                round: state.round + 1,
              }
            }
            return { ...state, phase: 'finished', remaining: 0 }
        }
        break
      case 'RESET':
        return getInitialState(settings)
    }
    return state
  }
}

const getInitialState = (settings: TimerSettings): TimerState => ({
  phase: 'prepare',
  remaining: settings.prepare,
  round: 1,
})

export function useTabata(settings: TimerSettings) {
  const initialState = getInitialState(settings)
  const reducer = useCallback(createReducer(settings), [settings])
  const [state, dispatch] = useReducer(reducer, initialState)
  const [isRunning, setIsRunning] = useState(true)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (state.remaining === 0 && state.phase !== 'finished') {
      dispatch({ type: 'NEXT_PHASE' })
      if (state.phase === 'rest' && state.round === settings.rounds) {
        playSound('finish')
      } else {
        playSound('start')
      }
    } else if (state.remaining > 0 && state.remaining <= 3 && isRunning) {
      playSound('countdown')
    }
  }, [state.remaining, state.phase, isRunning, settings.rounds, state.round])

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        dispatch({ type: 'DECREMENT' })
      }, 1000)
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
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
