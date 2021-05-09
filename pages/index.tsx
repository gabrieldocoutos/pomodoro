import { Fragment, useState, useEffect, useReducer } from "react";
import Head from "next/head";

import useInterval from "../useInterval";

import { Button } from "../components/Button";
import { useNotification } from "../context/NotificationContext";

type Timer = {
  minutes: number;
  seconds: number;
  isPlaying: boolean;
  timerType: "pomodoro" | "resting";
};

type TimerAction = {
  type:
    | "start_timer"
    | "stop_timer"
    | "toggle_timer"
    | "tick_minutes"
    | "tick_seconds"
    | "set_seconds"
    | "switch_to_pomodoro"
    | "switch_to_resting";
  payload?: unknown;
};

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
      return timerInitialState;
    case "switch_to_resting":
      return { ...timerInitialState, timerType: "resting", minutes: 5 };
  }
};

const timerInitialState: Timer = {
  minutes: 25,
  seconds: 0,
  isPlaying: false,
  timerType: "pomodoro",
};

const formatNumber = (n: number): string => (n < 10 ? `0${n}` : n.toString());

function App(): JSX.Element {
  const [timer, dispatchTimer] = useReducer(timerReducer, timerInitialState);
  const { seconds, minutes, isPlaying, timerType } = timer;
  const isResting = timerType === "resting";

  const {
    // browserNotificationPermissionGranted,
    sendBrowserNotification,
  } = useNotification();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.code === "Space" &&
        document?.activeElement?.id !== "start_button"
      ) {
        toggleTimer();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleTimer = () => dispatchTimer({ type: "toggle_timer" });

  const switchToPomodoro = () => dispatchTimer({ type: "switch_to_pomodoro" });

  const switchToRest = () => dispatchTimer({ type: "switch_to_resting" });

  useInterval(
    () => {
      if (minutes === 0 && seconds === 0) {
        if (isResting) {
          dispatchTimer({ type: "switch_to_pomodoro" });
          sendBrowserNotification("your rest is over for now!");
        } else {
          dispatchTimer({ type: "switch_to_resting" });
          sendBrowserNotification("your work is over for now!");
        }
        return;
      }

      if (seconds === 0) {
        dispatchTimer({ type: "tick_minutes" });
      }
      dispatchTimer({ type: "tick_seconds" });
    },
    isPlaying ? 10 : null
  );

  return (
    <Fragment>
      <Head>
        <title>{`${formatNumber(minutes)}:${formatNumber(seconds)}`}</title>
      </Head>
      <div
        className={`flex flex-col w-100 justify-center items-center h-screen transition duration-500 ease-in-out ${
          isResting ? "bg-gray-300" : "bg-gray-900"
        }`}
      >
        <div className="flex">
          <Button
            disabled={!isResting}
            className="mr-4 px-2"
            onClick={switchToPomodoro}
            variant={isResting ? "secondary" : "primary"}
          >
            pomodoro
          </Button>
          <Button
            variant={isResting ? "secondary" : "primary"}
            disabled={isResting}
            className="px-2"
            onClick={switchToRest}
          >
            rest
          </Button>
        </div>
        <div className="flex items-center">
          <p
            className={`text-8xl leading-normal ${
              isResting ? "text-gray-900" : "text-gray-100"
            } mb-4`}
            style={{ width: 110 }}
          >
            {formatNumber(minutes)}
          </p>
          <p
            className={`text-8xl leading-normal ${
              isResting ? "text-gray-900" : "text-gray-100"
            } mb-4`}
          >
            :
          </p>
          <p
            className={`text-8xl leading-normal ${
              isResting ? "text-gray-900" : "text-gray-100"
            } mb-4`}
            style={{ width: 110 }}
          >
            {formatNumber(seconds)}
          </p>
        </div>
        <div className="flex">
          <Button
            variant={isResting ? "secondary" : "primary"}
            onClick={toggleTimer}
            className="h-10 w-24"
            autoFocus={true}
            id="start_button"
          >
            {isPlaying ? "stop" : "start"}
          </Button>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
