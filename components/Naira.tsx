import { Text, TextProps } from "./Themed";
import { useStore } from "../app/store";

interface NairaProps extends TextProps {
  color?: string;
}
export function Naira(props: NairaProps) {
  const { theme } = useStore();

  return (
    <Text
      {...props}
      style={[props.style, { fontFamily: "Naira" }, { color: props.color }]}
    >
      NGN
    </Text>
  );
}
