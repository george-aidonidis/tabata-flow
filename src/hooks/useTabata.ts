import { useReducer, useEffect, useRef, useCallback } from "react";
import type { TimerState, TimerAction, TimerPhase } from "../types";

const PREPARE_TIME = 10;
const WORK_TIME = 20;
const REST_TIME = 10;
const NUM_ROUNDS = 8;

const initialState: TimerState = {
  phase: "prepare",
  remaining: PREPARE_TIME,
  round: 1,
};

function reducer(state: TimerState, action: TimerAction): TimerState {
  if (state.phase === "finished") {
    return state;
  }
  switch (action.type) {
    case "DECREMENT":
      if (state.remaining > 1) {
        return { ...state, remaining: state.remaining - 1 };
      }
      return { ...state, remaining: 0 };
    case "NEXT_PHASE":
      switch (state.phase) {
        case "prepare":
          return { ...state, phase: "work", remaining: WORK_TIME };
        case "work":
          return { ...state, phase: "rest", remaining: REST_TIME };
        case "rest":
          if (state.round < NUM_ROUNDS) {
            return {
              ...state,
              phase: "work",
              remaining: WORK_TIME,
              round: state.round + 1,
            };
          }
          return { ...state, phase: "finished", remaining: 0 };
      }
      break;
    case "RESET":
      return { ...initialState };
  }
  return state;
}

export function useTabata() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const workerRef = useRef<Worker | null>(null);

  const ensureWorker = useCallback(() => {
    if (workerRef.current === null) {
      workerRef.current = new Worker(
        new URL("../workers/timer.ts", import.meta.url),
        {
          type: "module",
        },
      );

      workerRef.current.onmessage = (e) => {
        if (e.data === "tick") {
          dispatch({ type: "DECREMENT" });
        }
      };
    }
  }, []);

  useEffect(() => {
    if (state.remaining === 0 && state.phase !== "finished") {
      dispatch({ type: "NEXT_PHASE" });
    }
  }, [state.remaining, state.phase]);

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const start = useCallback(() => {
    ensureWorker();
    if (workerRef.current) {
      workerRef.current.postMessage("start");
    }
  }, [ensureWorker]);

  const pause = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage("stop");
    }
  }, []);

  const reset = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage("stop");
    }
    dispatch({ type: "RESET" });
  }, []);

  return { ...state, start, pause, reset };
}
