import {
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";
import { primaryYellow } from "../../constants/Colors";
import { useStore } from "../store";
import Loader from "../../components/Loader";
import CustomAlert from "../../components/CustomAlert";
import { getLocalItem } from "../utils/localStorage";
import { useEffect } from "react";
import { useRouter } from "expo-router";

function TabBarIcon(props: { name: any; color: string }) {
  switch (props.name) {
    case "home":
      return (
        <MaterialCommunityIcons
          size={28}
          style={{ marginBottom: -3 }}
          {...props}
        />
      );
    case "hand-coin":
      return (
        <MaterialCommunityIcons
          size={28}
          style={{ marginBottom: -3 }}
          {...props}
        />
      );
    case "ios-person-circle-sharp":
      return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
    case "format-list-text":
      return (
        <MaterialCommunityIcons
          size={28}
          style={{ marginBottom: -3 }}
          {...props}
        />
      );

    default:
      return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
  }
}

export default function TabLayout() {
  const router = useRouter()
  const { authState, theme, isLogedIn, setIsLogedIn, alertTitle, alertMessage, alertVisible, hideAlert } = useStore();
  useEffect(() => {
    getLocalItem('isLogedIn').then((islogin)=> {
      
      if (islogin === 'true') {
        setIsLogedIn(true)
      }
      else{
        setIsLogedIn(false)
        router.push('/onboarding/signin')
      }
    })
    .catch((error)=> console.log(error))
  }, [])
  
  if (!isLogedIn) {
    return <Loader />;
  } 

  return (
    <>
    <CustomAlert
      title={alertTitle}
      message={alertMessage}
      visible={alertVisible}
      onClose={hideAlert}
    />
    
    <Tabs
      screenOptions={{
        tabBarStyle: {backgroundColor: theme === 'light' ? '#fff' : '#000000', borderColor: theme === 'light' ? '#fff' : '#000000'},
        tabBarActiveTintColor: theme === "light" ? "#232323" : primaryYellow,
        tabBarLabelStyle:{ fontFamily:"MuseoRegular", marginBottom: 5, fontSize: 8}
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />
        }}
      />
      <Tabs.Screen
        name="donate"
        options={{
          title: "Donate",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="hand-coin" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: "Catalog",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="format-list-text" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-person-circle-sharp" color={color} />
          ),
        }}
      />
    </Tabs>
    </>
  );
}
