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
import { useColorScheme } from "react-native";
import { GridItem } from "../../components/Home/GridList";
import {
  collection,
  DocumentData,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { db } from "../db/firebase";

export type StoreContextProps = {
  userData: userDataProps | null;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isRegistered: any;
  setIsRegistered: React.Dispatch<React.SetStateAction<any>>;
  refreshing: boolean;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  onRefresh: any;
  theme: any;
  curentLoc: string;
  setCurrentLoc: React.Dispatch<React.SetStateAction<string>>;
  data: GridItem[];
  setData: React.Dispatch<React.SetStateAction<GridItem[]>>;
  fetchData: any;
  lastDoc: any;
  setLastDoc: React.Dispatch<React.SetStateAction<any>>;
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
  curentLoc: "",
  setCurrentLoc: () => null,
  data: [],
  setData: () => null,
  fetchData: () => null,
  lastDoc: null,
  setLastDoc: () => null,
});

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useAsyncStorage("userData", {});
  const [refreshing, setRefreshing] = useState(false);
  const [curentLoc, setCurrentLoc] = useState("Searching...");
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState<any>();
  const [data, setData] = useState<GridItem[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);

  const theme = useColorScheme();
  useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(
      auth,
      (user: any) => {
        if (user) {
          setIsRegistered(true);
        } else {
          // User is signed out
          setUserData({});
          setIsRegistered(false);
        }
      }
    );
    return unsubscribeFromAuthStatuChanged;
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const fetchData = async (afterDoc?: DocumentData | null) => {
    try {
      let searchQuery;
      const boardDB = collection(db, "Inventory");
      if (afterDoc) {
        const initQuery = query(
          boardDB,
          where("status", "==", "Available"),
          orderBy("createdAt", "desc"),
          limit(20)
        );
        searchQuery = query(initQuery, startAfter(afterDoc));
      } else {
        searchQuery = query(
          boardDB,
          where("status", "==", "Available"),
          orderBy("createdAt", "desc"),
          limit(20)
        );
      }

      const snapshot = await getDocs(searchQuery);

      if (!snapshot.empty) {
        setData((prevData) => {
          const uniqueIds = new Set(prevData.map((item) => item.id));
          const newData = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() } as GridItem))
            .filter((item) => !uniqueIds.has(item.id))
            .filter((newItem) => newItem.interestedParties.length < 5);
          return [...prevData, ...newData];
        });
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

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
      theme,
      curentLoc,
      setCurrentLoc,
      data,
      setData,
      fetchData,
      lastDoc,
      setLastDoc,
    }),
    [
      userData,
      setUserData,
      loading,
      setLoading,
      isRegistered,
      setIsRegistered,
      refreshing,
      setRefreshing,
      onRefresh,
      theme,
      curentLoc,
      setCurrentLoc,
      data,
      setData,
      fetchData,
      lastDoc,
      setLastDoc,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
