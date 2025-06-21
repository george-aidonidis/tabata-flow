export type TimerPhase =
  | 'prepare'
  | 'work'
  | 'shortBreak'
  | 'longBreak'
  | 'finished'

export interface TimerState {
  phase: TimerPhase
  remaining: number
  set: number
  cycle: number
}

export type TimerAction =
  | { type: 'DECREMENT' }
  | { type: 'NEXT_PHASE' }
  | { type: 'RESET' }

export type Settings = {
  work: number
  shortBreak: number
  sets: number
  longBreak: number
  cycles: number
}
