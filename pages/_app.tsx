import "tailwind.scss";
import { AppProps } from "next/app";

import { NotificationProvider } from "@/context/NotificationContext";
import { TimerProvider } from "@/context/TimerContext";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <TimerProvider>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </TimerProvider>
  );
}

export default MyApp;
