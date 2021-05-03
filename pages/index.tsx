import { Fragment, useState } from "react";

import useInterval from "../useInterval";

const formatNumber = (n: number): string => (n < 10 ? `0${n}` : n.toString());

function App(): JSX.Element {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isResting, setIsResting] = useState(false);

  const startTimer = () => {
    setMinutes(isResting ? 5 : 25);
    setIsPlaying(true);
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
        } else {
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
    isPlaying ? 10 : null
  );

  return (
    <Fragment>
      {/* <Helmet>
        <title>{`${formatNumber(minutes)}:${formatNumber(seconds)}`}</title>
      </Helmet> */}
      <div
        className={`flex flex-col w-100 justify-center items-center h-screen ${
          isResting ? "bg-green-400" : "bg-red-400"
        }`}
      >
        <div className='flex items-center'>
        <p className="text-8xl text-white mb-4" style={{ width: 110 }}>
         {formatNumber(minutes)}
        </p>
        <p className='text-8xl text-white mb-4'>:</p>
        <p className='text-8xl text-white mb-4' style={{ width: 110 }}>{formatNumber(seconds)}</p>
        </div>
        <div className='flex'>
          <button
            className={`text-white px-2 rounded px-10 py-2 outline-none ${
              isResting ? "bg-green-300" : "bg-red-300"
            }`}
            onClick={startTimer}
          >
            start
          </button>
        </div>
      </div>
    </Fragment>
  );
}


export default App