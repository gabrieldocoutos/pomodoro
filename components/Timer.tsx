import React, { useReducer, useEffect, FC, Fragment } from "react";
import Head from "next/head";

import { useNotification } from "@/context/NotificationContext";

import useInterval from "@/hooks/useInterval";

import { Button } from "@/components/Button";

const formatNumber = (n: number): string => (n < 10 ? `0${n}` : n.toString());

type Timer = {
  minutes: number;
  seconds: number;
  isPlaying: boolean;
  timerType: "pomodoro" | "resting";
  focusCycles: number;
};

type TimerAction =
  | { type: "start_timer" }
  | { type: "stop_timer" }
  | { type: "toggle_timer" }
  | { type: "subtract_minute" }
  | { type: "subtract_second" }
  | { type: "set_seconds" }
  | { type: "switch_to_pomodoro" }
  | { type: "switch_to_resting" }
  | { type: "start_focus_cycle" };

const timerReducer = (state: Timer, action: TimerAction): Timer => {
  switch (action.type) {
    case "start_timer":
      return { ...state, isPlaying: true };
    case "stop_timer":
      return { ...state, isPlaying: false };
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
        ...state,
        minutes: 25,
        seconds: 0,
        isPlaying: false,
        timerType: "pomodoro",
      };
    case "switch_to_resting":
      return {
        ...state,
        seconds: 0,
        timerType: "resting",
        minutes: state.focusCycles === 4 ? 15 : 5,
        isPlaying: false,
      };
    case "start_focus_cycle":
      return {
        ...state,
        focusCycles: state.focusCycles === 4 ? 1 : state.focusCycles + 1,
      };
    default:
      return state;
  }
};

const Timer: FC = () => {
  const [timer, dispatchTimer] = useReducer(timerReducer, {
    minutes: 25,
    seconds: 0,
    isPlaying: false,
    timerType: "pomodoro",
    focusCycles: 1,
  });

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
        dispatchTimer({ type: "toggle_timer" });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useInterval(
    () => {
      if (minutes === 0 && seconds === 0) {
        if (isResting) {
          dispatchTimer({ type: "switch_to_pomodoro" });
          dispatchTimer({ type: "start_focus_cycle" });
          sendBrowserNotification("your rest is over for now!");
        } else {
          dispatchTimer({ type: "switch_to_resting" });
          sendBrowserNotification("your work is over for now!");
        }
        return;
      }

      if (seconds === 0) {
        dispatchTimer({ type: "subtract_minute" });
      }
      dispatchTimer({ type: "subtract_second" });
    },
    timer.isPlaying ? 1000 : null
  );

  const { seconds, minutes, isPlaying, timerType, focusCycles } = timer;
  const isResting = timerType === "resting";

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
            onClick={() => dispatchTimer({ type: "switch_to_pomodoro" })}
            variant={isResting ? "secondary" : "primary"}
          >
            pomodoro
          </Button>
          <Button
            variant={isResting ? "secondary" : "primary"}
            disabled={isResting}
            className="px-2"
            onClick={() => dispatchTimer({ type: "switch_to_resting" })}
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
            onClick={() => dispatchTimer({ type: "toggle_timer" })}
            className="h-10 w-24 mb-4"
            autoFocus={true}
            id="start_button"
          >
            {isPlaying ? "stop" : "start"}
          </Button>
        </div>
        <p className={isResting ? "text-gray-900" : "text-gray-100"}>
          focus cycles {focusCycles}/4
        </p>
      </div>
    </Fragment>
  );
};

export { Timer };
