import { AppProps } from "next/app";

import { NotificationProvider } from "../context/NotificationContext";
import "../globals.css";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <NotificationProvider>
      <Component {...pageProps} />
    </NotificationProvider>
  );
}

export default MyApp;
