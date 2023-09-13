import {
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import Colors, { primaryYellow } from "../../constants/Colors";
import OnboardingScreen from "../onboarding";
import { useStore } from "../store";
import Loader from "../../components/Loader";
import CustomAlert from "../../components/CustomAlert";

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
  const { authState, theme, alertTitle, alertMessage, alertVisible, hideAlert } = useStore();
  if (!authState.isRegistered && !authState.loading) {
    return <OnboardingScreen />;
  } else if (!authState.isRegistered && authState.loading) {
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
        tabBarStyle: {backgroundColor: theme === 'light' ? '#fff' : 'transparent', borderColor: theme === 'light' ? '#fff' : 'transparent'},
        tabBarActiveTintColor: theme === "light" ? "#232323" : primaryYellow,
        tabBarLabelStyle:{ fontFamily:"MuseoRegular", marginBottom: 5, fontSize: 8}
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    // color={theme === "light" ?  : ''}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
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
