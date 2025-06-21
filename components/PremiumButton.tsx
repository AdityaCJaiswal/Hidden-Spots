import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

interface PremiumButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  colors?: string[];
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function PremiumButton({
  title,
  onPress,
  style,
  textStyle,
  colors = ['#EA580C', '#DC2626', '#B91C1C'],
  disabled = false,
  icon,
  variant = 'primary',
  size = 'medium',
}: PremiumButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const shimmer = useSharedValue(0);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const tap = Gesture.Tap()
    .onBegin(() => {
      runOnJS(triggerHaptic)();
      scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
      opacity.value = withTiming(0.8, { duration: 100 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      opacity.value = withTiming(1, { duration: 150 });
      shimmer.value = withTiming(1, { duration: 600 }, () => {
        shimmer.value = 0;
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmer.value, [0, 1], [-100, 300]);
    return {
      transform: [{ translateX }],
      opacity: shimmer.value,
    };
  });

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`${size}Button`]];
    
    if (variant === 'ghost') {
      return [...baseStyle, styles.ghostButton];
    }
    if (variant === 'secondary') {
      return [...baseStyle, styles.secondaryButton];
    }
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];
    
    if (variant === 'ghost') {
      return [...baseStyle, styles.ghostText];
    }
    if (variant === 'secondary') {
      return [...baseStyle, styles.secondaryText];
    }
    return [...baseStyle, styles.primaryText];
  };

  if (variant === 'ghost' || variant === 'secondary') {
    return (
      <GestureDetector gesture={tap}>
        <AnimatedTouchable
          style={[...getButtonStyle(), style, animatedStyle, disabled && styles.disabled]}
          onPress={onPress}
          disabled={disabled}
          activeOpacity={1}
        >
          {icon && <>{icon}</>}
          <Text style={[...getTextStyle(), textStyle, disabled && styles.disabledText]}>
            {title}
          </Text>
        </AnimatedTouchable>
      </GestureDetector>
    );
  }

  return (
    <GestureDetector gesture={tap}>
      <AnimatedTouchable
        style={[...getButtonStyle(), style, animatedStyle, disabled && styles.disabled]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={1}
      >
        <LinearGradient
          colors={disabled ? ['#D1D5DB', '#9CA3AF'] : colors}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {!disabled && (
            <Animated.View style={[styles.shimmer, shimmerStyle]}>
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.shimmerGradient}
              />
            </Animated.View>
          )}
          {icon && <>{icon}</>}
          <Text style={[...getTextStyle(), textStyle, disabled && styles.disabledText]}>
            {title}
          </Text>
        </LinearGradient>
      </AnimatedTouchable>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  smallButton: {
    minHeight: 40,
  },
  mediumButton: {
    minHeight: 48,
  },
  largeButton: {
    minHeight: 56,
  },
  secondaryButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#EA580C',
    shadowOpacity: 0.1,
    elevation: 4,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: -100,
    right: -100,
    bottom: 0,
  },
  shimmerGradient: {
    flex: 1,
  },
  text: {
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#EA580C',
  },
  ghostText: {
    color: '#EA580C',
  },
  disabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  disabledText: {
    color: '#9CA3AF',
  },
});