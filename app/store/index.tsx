import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { auth } from "../db/firebase";
import { onAuthStateChanged } from "firebase/auth";


export type UserProp = {
  name: string;
};

export type StoreContextProps = {
  userData: UserProp | null;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isRegistered: boolean;
  setIsRegistered: React.Dispatch<React.SetStateAction<boolean>>;
};

const StoreContext = createContext<StoreContextProps>({
  userData: null,
  setUserData: () => null,
  loading: false,
  setLoading: () => null,
  isRegistered: false,
  setIsRegistered: () => null,
});

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(
      auth,
      (user: any) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          setUserData(user);
          setIsRegistered(true);
        } else {
          // User is signed out
          setUserData(null);
          setIsRegistered(false);
        }
      }
    );
      // console.log(unsubscribeFromAuthStatuChanged, "unsubscribeFromAuthStatuChanged")
    return unsubscribeFromAuthStatuChanged;
  }, []);

  const value = useMemo(
    () => ({
      userData,
      setUserData,
      loading,
      setLoading,
      isRegistered,
      setIsRegistered,
    }),
    [userData, setUserData, loading, setLoading, isRegistered, setIsRegistered]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
