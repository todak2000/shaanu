// import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialCommunityIcons, FontAwesome, SimpleLineIcons  } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';
import Colors, { primaryYellow } from '../../constants/Colors';
import OnboardingScreen from '../onboarding';
import { useStore } from '../store';
import Loader from '../../components/Loader';

function TabBarIcon(props: {
  name: any;
  // name: React.ComponentProps<typeof FontAwesome>['name'] | React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
}) {
  switch (props.name) {
    case "home":
      return <MaterialCommunityIcons  size={28} style={{ marginBottom: -3 }} {...props} />;
    case "hand-coin":
      return <MaterialCommunityIcons  size={28} style={{ marginBottom: -3 }} {...props} />;
    case "settings":
      return <SimpleLineIcons  size={28} style={{ marginBottom: -3 }} {...props} />;
    case "format-list-text":
      return <MaterialCommunityIcons  size={28} style={{ marginBottom: -3 }} {...props} />;
      
    default:
      return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} /> ;

  }
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isRegistered, loading, theme } = useStore();

  if (!isRegistered && !loading) {
    return <OnboardingScreen />
  }
  else if (!isRegistered && loading){
    return <Loader />
  }


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme === 'light' ? "#232323": primaryYellow,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
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
          title: 'Donate',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="hand-coin" color={color} />,
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Catalog',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="format-list-text" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}
