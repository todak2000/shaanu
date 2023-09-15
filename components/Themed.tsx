/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  useColorScheme,
  View as DefaultView,
  TouchableOpacity as DefaultTouchableOpacity,
  Pressable as DefaultPressable,
} from "react-native";

import Colors from "../constants/Colors";
import { useStore } from "../app/store";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type TouchableOpacityProps = ThemeProps &
  DefaultTouchableOpacity["props"];

export function useThemeColor(
  props: { light?: string; dark?: string } | any,
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { theme } = useStore()
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return null;
  }
}

export function Text(props: TextProps) {
  const { theme } = useStore()
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = theme === "light" ? "#000000" : "#ffffff";
  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { theme } = useStore()
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = theme === "light" ? "#ffffff" : "#000000";

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TouchableOpacity(props: TouchableOpacityProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <DefaultTouchableOpacity
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}
