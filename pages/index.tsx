import { Fragment, useState, useEffect } from "react";
import Head from "next/head";

import useInterval from "../useInterval";

import { Button } from "../components/Button";

const formatNumber = (n: number): string => (n < 10 ? `0${n}` : n.toString());

function App(): JSX.Element {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [
    notificationPermissionGranted,
    setNotificationPermissionGranted,
  ] = useState(false);

  useEffect(() => {
    checkNotificationPermission();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.code === "Space" &&
        document?.activeElement?.id !== "start_button"
      ) {
        setIsPlaying((prevIsPlaying) => !prevIsPlaying);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const checkNotificationPermission = () => {
    if (!("Notification" in window)) {
      setNotificationPermissionGranted(false);
      console.log("This browser does not support desktop notification");
      return;
    }

    if (Notification.permission === "granted") {
      setNotificationPermissionGranted(true);
      return;
    }

    if (["denied", "default"].includes(Notification.permission)) {
      Notification.requestPermission((permissionCallback) => {
        if (permissionCallback === "granted") {
          setNotificationPermissionGranted(true);
        }
      });
    }

    Notification.requestPermission((permissionCallback) => {
      if (permissionCallback === "granted") {
        setNotificationPermissionGranted(true);
      }
    });
  };
  const startTimer = () => {
    setMinutes(isResting ? 5 : 25);
    setIsPlaying(true);
  };

  const stopTimer = () => {
    setIsPlaying(false);
  };

  const switchToPomodoro = () => {
    setIsResting(false);
    setIsPlaying(false);
    setMinutes(25);
    setSeconds(0);
  };

  const switchToRest = () => {
    setIsResting(true);
    setIsPlaying(false);
    setMinutes(5);
    setSeconds(0);
  };

  useInterval(
    () => {
      if (minutes === 0 && seconds === 0) {
        setIsPlaying(false);
        if (isResting) {
          setIsPlaying(false);
          setIsResting(false);
          setMinutes(25);
          setSeconds(0);
          if (notificationPermissionGranted) {
            new Notification("your rest is over for now!");
          }
        } else {
          if (notificationPermissionGranted) {
            new Notification("your work is over for now!");
          }
          setMinutes(5);
          setSeconds(0);
          setIsResting(true);
        }
        return;
      }

      if (seconds === 0) {
        setMinutes((prevMinutes) => prevMinutes - 1);
      }
      setSeconds((prevSeconds) => (prevSeconds === 0 ? 59 : prevSeconds - 1));
    },
    isPlaying ? 1 : null
  );

  return (
    <Fragment>
      <Head>
        <title>{`${formatNumber(minutes)}:${formatNumber(seconds)}`}</title>
      </Head>
      <div
        className={`flex flex-col w-100 justify-center items-center h-screen ${
          isResting ? "bg-green-400" : "bg-red-400"
        } transition duration-500 ease-in-out`}
        onKeyDown={(e) => console.log({ e })}
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
            className="text-8xl leading-normal text-white mb-4"
            style={{ width: 110 }}
          >
            {formatNumber(minutes)}
          </p>
          <p className="text-8xl leading-normal text-white mb-4">:</p>
          <p
            className="text-8xl leading-normal text-white mb-4"
            style={{ width: 110 }}
          >
            {formatNumber(seconds)}
          </p>
        </div>
        <div className="flex">
          <Button
            variant={isResting ? "secondary" : "primary"}
            onClick={isPlaying ? stopTimer : startTimer}
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
