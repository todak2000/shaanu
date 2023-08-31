import React, { useState, useEffect } from "react";
import { Animated } from "react-native";
import { Text } from "./Themed";
import { Svg, Path } from "react-native-svg";
import { useStore } from "../app/store";
import { primaryRed } from "../constants/Colors";

interface AnimatedSvgProps {
  duration: number;
  colors: string[];
}

const AnimatedLoader: React.FC<AnimatedSvgProps> = ({ duration, colors }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [colorIndex, setColorIndex] = useState(0);
  const { theme } = useStore();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    fadeAnim.removeAllListeners();
    fadeAnim.addListener(({ value }) => {
      if (value === 1 || value === 0) {
        setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
      }
    });
    return () => fadeAnim.removeAllListeners();
  }, [colors]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Svg width={50} height={50} viewBox="0 0 725 521" fill="none">
        <Path
          d="M581.241 19.7887C575.027 24.8385 557.189 36.5421 536.343 51.8866C517.446 26.565 493.14 2.84741 465.204 0.822932C428.258 -2.65295 384.377 15.8571 346.908 31.5494C346.908 31.5494 310.441 46.0281 297.519 50.5474C270.67 60.7996 245.926 69.7405 225.787 80.5232C186.609 101.991 118.125 181.171 79.0044 240.878C66.3642 261.12 44.2897 300.194 25.2235 335.628C17.4982 348.685 11.8772 360.432 6.05844 369.946C-6.4829 391.303 1.49693 418.717 22.6113 431.469L163.209 514.623C173.717 520.441 186.131 522.716 198.051 519.411C199.153 519.313 200.255 519.215 200.156 518.099C210.875 513.775 219.095 506.298 224.914 496.784L261.747 423.782C325.739 419.238 393.348 405.375 436.423 390.311L437.525 390.213C500.939 366.598 591.553 286.582 704.058 152.886C733.138 117.69 731.994 67.174 699.99 31.7653C673.989 1.44891 627.142 -13.5229 581.241 19.7887ZM178.9 453.618L65.221 386.076C69.1331 380.105 72.8475 371.903 76.6607 364.816C80.474 357.729 85.29 349.429 90.1059 341.128L201.483 407.749L178.9 453.618ZM659.443 112.97C526.783 269.824 454.529 318.968 417.964 332.331L416.862 332.428C378.094 345.986 315.895 358.245 256.309 362.399C253.004 362.692 250.801 362.887 247.595 364.296L119.807 287.88C122.716 283.123 125.626 278.366 128.634 274.725C168.758 213.805 229.516 147.682 253.864 134.277C269.696 125.001 293.437 117.273 318.083 107.216C332.107 102.599 369.576 86.9071 369.576 86.9071C399.531 74.13 438.201 59.4561 460.53 60.8525C465.035 61.5782 474.738 70.842 486.037 85.5885C469.301 97.1946 453.666 108.703 444.246 115.162C426.408 126.865 379.223 145.668 340.355 158.11L332.743 159.909C316.515 164.721 308.084 182.34 312.773 197.672C317.561 214.12 334.975 222.701 350.101 217.987L357.713 216.187C396.58 203.746 451.28 182.028 476.532 166.293C516.416 140.263 543.476 119.869 544.578 119.771C544.578 119.771 608.217 73.64 615.632 69.6086C635.475 55.4777 649.683 65.4673 655.784 71.6757C665.586 82.0556 670.473 99.6198 659.443 112.97Z"
          fill={colors[colorIndex]}
        />
      </Svg>
      <Text
        style={{
          fontFamily: "Museo",
          color: theme === "dark" ? "#ccc" : primaryRed,
        }}
      >
        Please wait
      </Text>
    </Animated.View>
  );
};

export default AnimatedLoader;
