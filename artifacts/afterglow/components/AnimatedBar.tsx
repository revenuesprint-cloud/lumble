import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

interface AnimatedBarProps {
  value: number; // 0–100
  color?: string;
  color2?: string;
  height?: number;
  delay?: number;
}

export function AnimatedBar({
  value,
  color = "#5B4CE8",
  color2,
  height = 7,
  delay = 0,
}: AnimatedBarProps) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: value,
      duration: 500,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [value]);

  const widthPercent = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  return (
    <View style={[styles.track, { height }]}>
      <Animated.View style={{ width: widthPercent, height: "100%", overflow: "hidden", borderRadius: height }}>
        <LinearGradient
          colors={[color, color2 || color]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
  },
});
