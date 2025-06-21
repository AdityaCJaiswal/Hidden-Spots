import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import { HiddenSpot } from '@/types';
import {
  X,
  MapPin,
  Star,
  Users,
  Shield,
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  Camera,
  Send,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface SpotDetailModalProps {
  spot: HiddenSpot | null;
  visible: boolean;
  onClose: () => void;
}

export default function SpotDetailModal({ spot, visible, onClose }: SpotDetailModalProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  if (!spot) return null;

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

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In a real app, this would send to backend
      console.log('Adding comment:', newComment, 'Anonymous:', isAnonymous);
      setNewComment('');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Heart size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Share2 size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Photo Gallery */}
          <View style={styles.photoGallery}>
            <Image source={{ uri: spot.photos[selectedPhotoIndex] }} style={styles.mainPhoto} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.photoOverlay}
            />
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryIcon}>{getCategoryIcon(spot.category)}</Text>
              <Text style={[styles.categoryText, { color: getCategoryColor(spot.category) }]}>
                {spot.category.toUpperCase()}
              </Text>
            </View>
            <View style={styles.ratingBadge}>
              <Star size={16} color="#FCD34D" fill="#FCD34D" />
              <Text style={styles.ratingText}>{spot.overallRating.toFixed(1)}</Text>
            </View>
          </View>

          {/* Photo Thumbnails */}
          <ScrollView horizontal style={styles.thumbnailContainer} showsHorizontalScrollIndicator={false}>
            {spot.photos.map((photo, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedPhotoIndex(index)}
                style={[
                  styles.thumbnail,
                  selectedPhotoIndex === index && styles.selectedThumbnail,
                ]}
              >
                <Image source={{ uri: photo }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.name}>{spot.name}</Text>
            
            <View style={styles.location}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.locationText}>Gwalior, Madhya Pradesh</Text>
            </View>

            <Text style={styles.description}>{spot.description}</Text>

            {/* Story Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Discovery Story</Text>
              <Text style={styles.story}>{spot.story}</Text>
              <Text style={styles.storyAuthor}>— {spot.submittedBy}</Text>
            </View>

            {/* Ratings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Community Ratings</Text>
              <View style={styles.ratingsGrid}>
                <View style={styles.ratingItem}>
                  <Sparkles size={20} color="#EC4899" />
                  <Text style={styles.ratingLabel}>Uniqueness</Text>
                  <Text style={styles.ratingValue}>{spot.ratings.uniqueness.toFixed(1)}</Text>
                </View>
                <View style={styles.ratingItem}>
                  <Heart size={20} color="#7C3AED" />
                  <Text style={styles.ratingLabel}>Vibe</Text>
                  <Text style={styles.ratingValue}>{spot.ratings.vibe.toFixed(1)}</Text>
                </View>
                <View style={styles.ratingItem}>
                  <Shield size={20} color="#059669" />
                  <Text style={styles.ratingLabel}>Safety</Text>
                  <Text style={styles.ratingValue}>{spot.ratings.safety.toFixed(1)}</Text>
                </View>
                <View style={styles.ratingItem}>
                  <Users size={20} color="#EA580C" />
                  <Text style={styles.ratingLabel}>Crowd Level</Text>
                  <Text style={styles.ratingValue}>{spot.ratings.crowdLevel.toFixed(1)}</Text>
                </View>
              </View>
            </View>

            {/* Tips */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tips from Visitors</Text>
              {spot.tips.map((tip, index) => (
                <View key={index} style={styles.tip}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>

            {/* Experiences */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Community Experiences</Text>
              {spot.experiences.map((exp) => (
                <View key={exp.id} style={styles.experience}>
                  <Text style={styles.experienceAuthor}>
                    {exp.isAnonymous ? 'Anonymous Explorer' : exp.userName}
                  </Text>
                  <Text style={styles.experienceContent}>{exp.content}</Text>
                  <View style={styles.experienceFooter}>
                    <TouchableOpacity style={styles.likeButton}>
                      <Heart size={14} color="#6B7280" />
                      <Text style={styles.likeCount}>{exp.likes}</Text>
                    </TouchableOpacity>
                    <Text style={styles.experienceDate}>
                      {exp.createdAt.toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Add Comment */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Share Your Experience</Text>
              <View style={styles.commentForm}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Share your experience at this spot..."
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                  numberOfLines={3}
                />
                <View style={styles.commentActions}>
                  <TouchableOpacity
                    style={[styles.anonymousToggle, isAnonymous && styles.anonymousToggleActive]}
                    onPress={() => setIsAnonymous(!isAnonymous)}
                  >
                    <Text style={[styles.anonymousText, isAnonymous && styles.anonymousTextActive]}>
                      Anonymous
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
                    <Send size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoGallery: {
    height: height * 0.4,
    position: 'relative',
  },
  mainPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
  },
  thumbnailContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: '#EA580C',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 6,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  story: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  storyAuthor: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'right',
  },
  ratingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  ratingItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
  },
  ratingValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  tip: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: '#EA580C',
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
  },
  experience: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  experienceAuthor: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  experienceContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  experienceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 4,
  },
  experienceDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  commentForm: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  commentInput: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  anonymousToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  anonymousToggleActive: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
  },
  anonymousText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  anonymousTextActive: {
    color: '#FFFFFF',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center',
  },
});