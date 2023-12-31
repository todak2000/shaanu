import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { StoreProvider } from "./store";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Museo: require("../assets/fonts/MuseoModerno-VariableFont_wght.ttf"),
    MuseoRegular: require("../assets/fonts/MuseoModerno-Regular.ttf"),
    MuseoBold: require("../assets/fonts/MuseoModerno-Bold.ttf"),
    MuseoBoldItalic: require("../assets/fonts/MuseoModerno-BoldItalic.ttf"),
    Naira: require("../assets/fonts/ADLaMDisplay-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  return (
    <StoreProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, gestureDirection: "horizontal" }}
          />
          <Stack.Screen
            name="item"
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen name="chat" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </StoreProvider>
  );
}
