import "../globals.css";
import "../tailwind.scss";
import { AppProps } from "next/app";

import { NotificationProvider } from "../context/NotificationContext";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <NotificationProvider>
      <Component {...pageProps} />
    </NotificationProvider>
  );
}

export default MyApp;
