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
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../db/firebase";
import * as Location from "expo-location";

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
  allData: GridItem[];
  setAllData: React.Dispatch<React.SetStateAction<GridItem[]>>;
  getAllItemDataStore: any;
  getLocation: any;
  donorData: GridItem[];
  setDonorData: React.Dispatch<React.SetStateAction<GridItem[]>>;
  requestData: GridItem[];
  setRequestData: React.Dispatch<React.SetStateAction<GridItem[]>>;
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
  allData: [],
  setAllData: () => null,
  getAllItemDataStore: () => null,
  donorData: [],
  setDonorData: () => null,
  requestData: [],
  setRequestData: () => null,
  getLocation: () => null,
});

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useAsyncStorage("userData", {});
  const [refreshing, setRefreshing] = useState(false);
  const [curentLoc, setCurrentLoc] = useState("Searching...");
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState<any>();
  const [data, setData] = useState<GridItem[]>([]);
  const [allData, setAllData] = useState<GridItem[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);

  const [requestData, setRequestData] = useState<GridItem[]>([]);
  const [donorData, setDonorData] = useState<GridItem[]>([]);

  const theme = useColorScheme();

  const getAllItemDataStore = async () => {
    const boardDB = collection(db, "Inventory");
    onSnapshot(boardDB, (querySnapshot) => {
      if (querySnapshot) {
        setAllData(() => {
          const newData = querySnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as GridItem)
          );
          return newData;
        });
      }
    });
  };

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

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    } else {
      if (curentLoc === "Searching...") {
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        }).then(async (location) => {
          const { latitude, longitude } = location.coords;
          let response = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });
          let fullLoc = response[0].city + ", " + response[0].region;
          setCurrentLoc(fullLoc);
        });
      }
    }
  };
  useEffect(() => {
    getLocation();
    console.log(curentLoc, "current location");
  }, [curentLoc]);

  useEffect(() => {
    getAllItemDataStore();
  }, []);

  useEffect(() => {
    setRequestData(
      allData?.filter((item) =>
        item?.interestedParties?.includes(userData?.id as string)
      )
    );
    setDonorData(allData?.filter((item) => item?.donor === userData?.id));
  }, [allData]);

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
      allData,
      setAllData,
      getAllItemDataStore,
      requestData,
      setRequestData,
      donorData,
      setDonorData,
      getLocation,
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
      allData,
      setAllData,
      getAllItemDataStore,
      requestData,
      setRequestData,
      donorData,
      setDonorData,
      getLocation,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
