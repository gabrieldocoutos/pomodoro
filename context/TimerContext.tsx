import { useContext, useReducer, createContext, FC } from "react";

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
  | { type: "subtract_minute" }
  | { type: "subtract_second" }
  | { type: "set_seconds" }
  | { type: "switch_to_pomodoro" }
  | { type: "switch_to_resting" };

const timerReducer = (state: Timer, action: TimerAction): Timer => {
  switch (action.type) {
    case "toggle_timer":
      return { ...state, isPlaying: !state.isPlaying };
    case "subtract_minute":
      return { ...state, minutes: state.minutes - 1 };
    case "subtract_second":
      return {
        ...state,
        seconds: state.seconds === 0 ? 59 : state.seconds - 1,
      };
    case "switch_to_pomodoro":
      return {
        minutes: 25,
        seconds: 0,
        isPlaying: false,
        timerType: "pomodoro",
      };
    case "switch_to_resting":
      return { seconds: 0, timerType: "resting", minutes: 5, isPlaying: false };
    default:
      return state;
  }
};

interface TimerContext {
  timer: Timer;
  toggleTimer: () => void;
  subtractMinute: () => void;
  subtractSecond: () => void;
  switchToPomodoro: () => void;
  switchToResting: () => void;
}

const TimerContext = createContext<TimerContext | undefined>(undefined);

const TimerProvider: FC = ({ children }) => {
  const [timer, dispatchTimer] = useReducer(timerReducer, {
    minutes: 25,
    seconds: 0,
    isPlaying: false,
    timerType: "pomodoro",
  });
  const { seconds, minutes, isPlaying, timerType } = timer;

  const toggleTimer = () => dispatchTimer({ type: "toggle_timer" });

  const subtractMinute = () => dispatchTimer({ type: "subtract_minute" });

  const subtractSecond = () => dispatchTimer({ type: "subtract_second" });

  const switchToPomodoro = () => dispatchTimer({ type: "switch_to_pomodoro" });

  const switchToResting = () => dispatchTimer({ type: "switch_to_resting" });

  return (
    <TimerContext.Provider
      value={{
        timer: { seconds, minutes, isPlaying, timerType },
        toggleTimer,
        subtractMinute,
        subtractSecond,
        switchToPomodoro,
        switchToResting,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

const useTimerContext = () => {
  const timerContext = useContext(TimerContext);
  if (timerContext === undefined) {
    throw new Error("useTimerContext must be within TimerProvider");
  }
  return timerContext;
};

export { TimerProvider, useTimerContext };
