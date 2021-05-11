import { useContext, useReducer, createContext, FC, Dispatch } from "react";

type Timer = {
  minutes: number;
  seconds: number;
  isPlaying: boolean;
  timerType: "pomodoro" | "resting";
};

type TimerAction =
  | { type: "start_timer" }
  | { type: "stop_timer" }
  | { type: "toggle_timer" }
  | { type: "tick_minutes" }
  | { type: "tick_seconds" }
  | { type: "set_seconds" }
  | { type: "switch_to_pomodoro" }
  | { type: "switch_to_resting" };

export interface TimerContext {
  timer: Timer;
  isResting: boolean;
  toggleTimer: () => void;
  tickMinutes: () => void;
  tickSeconds: () => void;
  switchToPomodoro: () => void;
  switchToResting: () => void;
}

const timerReducer = (state: Timer, action: TimerAction): Timer => {
  switch (action.type) {
    case "start_timer":
      return {
        ...state,
        isPlaying: true,
      };
    case "stop_timer":
      return { ...state, isPlaying: false };
    case "toggle_timer":
      return { ...state, isPlaying: !state.isPlaying };
    case "tick_minutes":
      return { ...state, minutes: state.minutes - 1 };
    case "tick_seconds":
      return {
        ...state,
        seconds: state.seconds === 0 ? 59 : state.seconds - 1,
      };
    case "switch_to_pomodoro":
    default:
      return {
        minutes: 25,
        seconds: 0,
        isPlaying: false,
        timerType: "pomodoro",
      };
    case "switch_to_resting":
      return { seconds: 0, timerType: "resting", minutes: 5, isPlaying: false };
  }
};

const TimerContext = createContext<TimerContext | undefined>(undefined);

const useTimerContext = () => {
  const timerContext = useContext(TimerContext);
  if (timerContext === undefined) {
    throw new Error("useTimerContext must be within TimerProvider");
  }
  return timerContext;
};

const TimerProvider: FC = ({ children }) => {
  const [timer, dispatchTimer] = useReducer(timerReducer, {
    minutes: 25,
    seconds: 0,
    isPlaying: false,
    timerType: "pomodoro",
  });
  const { seconds, minutes, isPlaying, timerType } = timer;
  const isResting = timerType === "resting";

  const toggleTimer = () => dispatchTimer({ type: "toggle_timer" });

  const tickMinutes = () => dispatchTimer({ type: "tick_minutes" });

  const tickSeconds = () => dispatchTimer({ type: "tick_seconds" });

  const switchToPomodoro = () => dispatchTimer({ type: "switch_to_pomodoro" });

  const switchToResting = () => dispatchTimer({ type: "switch_to_resting" });

  return (
    <TimerContext.Provider
      value={{
        timer: { seconds, minutes, isPlaying, timerType },
        isResting,
        toggleTimer,
        tickMinutes,
        tickSeconds,
        switchToPomodoro,
        switchToResting,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export { TimerProvider, useTimerContext };
