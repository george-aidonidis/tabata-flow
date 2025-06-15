export type TimerPhase = "prepare" | "work" | "rest" | "finished";

export interface TimerState {
  phase: TimerPhase;
  remaining: number;
  round: number;
}

export type TimerAction =
  | { type: "DECREMENT" }
  | { type: "NEXT_PHASE" }
  | { type: "RESET" };
