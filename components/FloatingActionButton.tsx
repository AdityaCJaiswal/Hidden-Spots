import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  style?: ViewStyle;
  colors?: string[];
  size?: number;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function FloatingActionButton({
  onPress,
  icon,
  style,
  colors = ['#EA580C', '#DC2626'],
  size = 56,
}: FloatingActionButtonProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const tap = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.9);
    })
    .onFinalize(() => {
      scale.value = withSpring(1);
      rotation.value = withSequence(
        withTiming(15, { duration: 100 }),
        withTiming(-15, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <GestureDetector gesture={tap}>
      <AnimatedTouchable
        style={[
          styles.fab,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          style,
          animatedStyle,
        ]}
        onPress={onPress}
        activeOpacity={1}
      >
        <LinearGradient
          colors={colors}
          style={[
            styles.gradient,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          {icon}
        </LinearGradient>
      </AnimatedTouchable>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  fab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});