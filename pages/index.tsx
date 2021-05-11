import { Fragment, useEffect } from "react";
import Head from "next/head";

import useInterval from "../useInterval";

import { Button } from "../components/Button";
import { useNotification } from "../context/NotificationContext";
import { useTimerContext } from "../context/TimerContext";

const formatNumber = (n: number): string => (n < 10 ? `0${n}` : n.toString());

function App(): JSX.Element {
  const {
    timer,
    toggleTimer,
    switchToPomodoro,
    switchToResting,
    subtractMinute,
    subtractSecond,
  } = useTimerContext();
  const { seconds, minutes, isPlaying, timerType } = timer;
  const {
    // browserNotificationPermissionGranted,
    sendBrowserNotification,
  } = useNotification();

  const isResting = timerType === "resting";

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

  useInterval(
    () => {
      if (minutes === 0 && seconds === 0) {
        if (isResting) {
          switchToPomodoro();
          sendBrowserNotification("your rest is over for now!");
        } else {
          switchToResting();
          sendBrowserNotification("your work is over for now!");
        }
        return;
      }

      if (seconds === 0) {
        subtractMinute();
      }
      subtractSecond();
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
            onClick={() => switchToPomodoro()}
            variant={isResting ? "secondary" : "primary"}
          >
            pomodoro
          </Button>
          <Button
            variant={isResting ? "secondary" : "primary"}
            disabled={isResting}
            className="px-2"
            onClick={() => switchToResting()}
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
            onClick={() => toggleTimer()}
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
