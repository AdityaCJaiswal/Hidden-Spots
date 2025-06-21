import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Check, AlertCircle, Info, X } from 'lucide-react-native';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  type: ToastType;
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export default function Toast({
  type,
  message,
  visible,
  onHide,
  duration = 3000,
}: ToastProps) {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check size={20} color="#FFFFFF" />;
      case 'error':
        return <X size={20} color="#FFFFFF" />;
      case 'warning':
        return <AlertCircle size={20} color="#FFFFFF" />;
      case 'info':
        return <Info size={20} color="#FFFFFF" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: '#059669' };
      case 'error':
        return { backgroundColor: '#DC2626' };
      case 'warning':
        return { backgroundColor: '#D97706' };
      case 'info':
        return { backgroundColor: '#2563EB' };
    }
  };

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0);
      opacity.value = withTiming(1);

      const timer = setTimeout(() => {
        translateY.value = withSpring(-100);
        opacity.value = withTiming(0, {}, () => {
          runOnJS(onHide)();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, getColors(), animatedStyle]}>
      <View style={styles.content}>
        {getIcon()}
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
});