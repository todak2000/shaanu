import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { auth } from "../db/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { userDataProps } from "../db/apis";
import useAsyncStorage from "../utils/hooks";
import { useColorScheme } from 'react-native';

export type StoreContextProps = {
  userData: userDataProps | null;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isRegistered: boolean;
  setIsRegistered: React.Dispatch<React.SetStateAction<boolean>>;
  refreshing: boolean; 
  setRefreshing:React.Dispatch<React.SetStateAction<boolean>>;
  onRefresh: any;
  theme: any;
};

export const StoreContext = createContext<StoreContextProps>({
  userData: null,
  setUserData: () => null,
  loading: false,
  setLoading: () => null,
  isRegistered: false,
  setIsRegistered: () => null,
  refreshing: false, 
  setRefreshing: () => null,
  onRefresh: () => null,
  theme: null,

});

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useAsyncStorage('userData', {});
  const [refreshing, setRefreshing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(true);

  const theme = useColorScheme();
  useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(
      auth,
      (user: any) => {
        if (user) {

          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          // setUserData(user);
          setIsRegistered(true);
        } else {
          // User is signed out
          setUserData({});
          setIsRegistered(false);
        }
      }
    );
      // console.log(unsubscribeFromAuthStatuChanged, "unsubscribeFromAuthStatuChanged")
    return unsubscribeFromAuthStatuChanged;
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const value = useMemo(
    () => ({
      userData,
      setUserData,
      loading,
      setLoading,
      isRegistered,
      setIsRegistered,
      refreshing, 
      setRefreshing,
      onRefresh,
      theme
    }),
    [userData, setUserData, loading, setLoading, isRegistered, setIsRegistered, refreshing, setRefreshing, onRefresh, theme]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
