import { useContext, useState, useEffect, createContext, FC } from "react";

interface Notification {
  browserNotificationPermissionGranted: boolean;
  sendBrowserNotification: (text: string) => void;
}

const NotificationContext = createContext({} as Notification);

const useNotification: () => Notification = () =>
  useContext(NotificationContext);

const NotificationProvider: FC = ({ children }): JSX.Element => {
  const [
    browserNotificationPermissionGranted,
    setBrowserNotificationPermissionGranted,
  ] = useState<boolean>(false);

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = () => {
    if (!("Notification" in window)) {
      setBrowserNotificationPermissionGranted(false);
      console.log("This browser does not support desktop notification");
      return;
    }

    if (Notification.permission === "granted") {
      setBrowserNotificationPermissionGranted(true);
      return;
    }

    if (["denied", "default"].includes(Notification.permission)) {
      Notification.requestPermission((permissionCallback) => {
        if (permissionCallback === "granted") {
          setBrowserNotificationPermissionGranted(true);
        }
      });
    }

    Notification.requestPermission((permissionCallback) => {
      if (permissionCallback === "granted") {
        setBrowserNotificationPermissionGranted(true);
      }
    });
  };

  const sendBrowserNotification = (text: string) => {
    if (!browserNotificationPermissionGranted) return;
    new Notification(text);
  };

  return (
    <NotificationContext.Provider
      value={{ browserNotificationPermissionGranted, sendBrowserNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationProvider, useNotification };
