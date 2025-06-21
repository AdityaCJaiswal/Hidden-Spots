import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { HiddenSpot } from '@/types';
import { MapPin, Star, Users, Shield, Sparkles, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

interface SpotCardProps {
  spot: HiddenSpot;
  onPress: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function SpotCard({ spot, onPress }: SpotCardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'romantic': return '#EC4899';
      case 'serene': return '#059669';
      case 'creative': return '#7C3AED';
      case 'adventure': return '#EA580C';
      default: return '#6B7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'romantic': return '💕';
      case 'serene': return '🧘';
      case 'creative': return '🎨';
      case 'adventure': return '🏃';
      default: return '📍';
    }
  };

  const tap = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
      opacity.value = withTiming(0.9, { duration: 100 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      opacity.value = withTiming(1, { duration: 150 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={tap}>
      <AnimatedTouchable style={[styles.container, animatedStyle]} onPress={onPress}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: spot.photos[0] }} style={styles.image} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.imageOverlay}
          />
          
          {/* Enhanced Category Badge */}
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(spot.category) + '15' }]}>
            <Text style={styles.categoryIcon}>{getCategoryIcon(spot.category)}</Text>
            <Text style={[styles.categoryText, { color: getCategoryColor(spot.category) }]}>
              {spot.category.toUpperCase()}
            </Text>
          </View>
          
          {/* Enhanced Rating Badge */}
          <View style={styles.ratingBadge}>
            <Star size={14} color="#FCD34D" fill="#FCD34D" />
            <Text style={styles.ratingText}>{spot.overallRating.toFixed(1)}</Text>
          </View>

          {/* Like Button */}
          <TouchableOpacity style={styles.likeButton}>
            <Heart size={16} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>{spot.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {spot.description}
          </Text>
          
          <View style={styles.location}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.locationText}>Gwalior, Madhya Pradesh</Text>
          </View>
          
          <View style={styles.metrics}>
            <View style={styles.metric}>
              <Sparkles size={12} color="#EC4899" />
              <Text style={styles.metricText}>{spot.ratings.uniqueness.toFixed(1)}</Text>
            </View>
            <View style={styles.metric}>
              <Shield size={12} color="#059669" />
              <Text style={styles.metricText}>{spot.ratings.safety.toFixed(1)}</Text>
            </View>
            <View style={styles.metric}>
              <Users size={12} color="#7C3AED" />
              <Text style={styles.metricText}>{spot.ratings.crowdLevel.toFixed(1)}</Text>
            </View>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.submittedBy}>by {spot.submittedBy}</Text>
            <Text style={styles.experienceCount}>
              {spot.experiences.length} experience{spot.experiences.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </AnimatedTouchable>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 220,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-ExtraBold',
    letterSpacing: 0.5,
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    marginLeft: 4,
  },
  likeButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Playfair-Bold',
    color: '#1F2937',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 6,
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  metricText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#374151',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  submittedBy: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  experienceCount: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#EA580C',
  },
});