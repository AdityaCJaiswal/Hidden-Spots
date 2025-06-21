import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { vibeCategories } from '@/data/spots';
import { Camera, MapPin, Plus, X, Save, Navigation, Star, Users, Shield, Sparkles, Image as ImageIcon, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LoadingSpinner from '@/components/LoadingSpinner';
import Toast from '@/components/Toast';
import GlassCard from '@/components/GlassCard';
import PremiumButton from '@/components/PremiumButton';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useToast } from '@/hooks/useToast';

const { width } = Dimensions.get('window');

interface FormData {
  name: string;
  description: string;
  story: string;
  category: string;
  photos: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
  ratings: {
    uniqueness: number;
    vibe: number;
    safety: number;
    crowdLevel: number;
  };
  tips: string[];
}

export default function AddSpotScreen() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    story: '',
    category: '',
    photos: [],
    location: null,
    ratings: {
      uniqueness: 0,
      vibe: 0,
      safety: 0,
      crowdLevel: 0,
    },
    tips: [],
  });

  const [newTip, setNewTip] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const pickImage = async () => {
    try {
      setPhotoLoading(true);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showToast('warning', 'Camera roll permissions required to add photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, result.assets[0].uri],
        }));
        showToast('success', 'Photo added successfully');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      showToast('error', 'Failed to pick image. Please try again.');
    } finally {
      setPhotoLoading(false);
    }
  };

  const takePhoto = async () => {
    try {
      setPhotoLoading(true);
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showToast('warning', 'Camera permissions required to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, result.assets[0].uri],
        }));
        showToast('success', 'Photo captured successfully');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      showToast('error', 'Failed to take photo. Please try again.');
    } finally {
      setPhotoLoading(false);
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
    showToast('info', 'Photo removed');
  };

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast('warning', 'Location access required to set spot location');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setFormData(prev => ({
        ...prev,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: address[0] ? `${address[0].street || ''}, ${address[0].city || 'Unknown location'}`.trim().replace(/^,\s*/, '') : 'Unknown location',
        },
      }));
      showToast('success', 'Location set successfully');
    } catch (error) {
      console.error('Error getting location:', error);
      showToast('error', 'Failed to get current location');
    } finally {
      setLocationLoading(false);
    }
  };

  const addTip = () => {
    if (newTip.trim()) {
      setFormData(prev => ({
        ...prev,
        tips: [...prev.tips, newTip.trim()],
      }));
      setNewTip('');
      showToast('success', 'Tip added');
    }
  };

  const removeTip = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tips: prev.tips.filter((_, i) => i !== index),
    }));
    showToast('info', 'Tip removed');
  };

  const updateRating = (type: keyof FormData['ratings'], value: number) => {
    setFormData(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [type]: value,
      },
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      showToast('error', 'Please enter a spot name');
      return false;
    }
    if (!formData.description.trim()) {
      showToast('error', 'Please enter a description');
      return false;
    }
    if (!formData.story.trim()) {
      showToast('error', 'Please share your discovery story');
      return false;
    }
    if (!formData.category) {
      showToast('error', 'Please select a category');
      return false;
    }
    if (formData.photos.length === 0) {
      showToast('error', 'Please add at least one photo');
      return false;
    }
    if (!formData.location) {
      showToast('error', 'Please set the location');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast('success', 'Hidden spot submitted successfully! It will be reviewed and published soon.');
      
      setTimeout(() => {
        resetForm();
      }, 1500);
    } catch (error) {
      console.error('Error submitting spot:', error);
      showToast('error', 'Failed to submit spot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      story: '',
      category: '',
      photos: [],
      location: null,
      ratings: {
        uniqueness: 0,
        vibe: 0,
        safety: 0,
        crowdLevel: 0,
      },
      tips: [],
    });
    setNewTip('');
  };

  const renderStars = (rating: number, onPress: (value: number) => void) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => onPress(star)}>
            <Star
              size={24}
              color={star <= rating ? '#FCD34D' : '#D1D5DB'}
              fill={star <= rating ? '#FCD34D' : 'transparent'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderHeader = () => (
    <LinearGradient
      colors={['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD']}
      style={styles.headerGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.headerContent}>
        <Zap size={32} color="#FFFFFF" strokeWidth={2} />
        <Text style={styles.headerTitle}>Add Hidden Spot</Text>
        <Text style={styles.headerSubtitle}>
          Share your discovery with the community
        </Text>
      </View>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <Toast
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onHide={hideToast}
      />

      <ParallaxScrollView
        headerComponent={renderHeader()}
        headerHeight={300}
      >
        {/* Basic Information */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Spot Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a descriptive name for the spot"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe what makes this spot special..."
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Discovery Story *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Share how you discovered this spot and what makes it meaningful..."
              value={formData.story}
              onChangeText={(text) => setFormData(prev => ({ ...prev, story: text }))}
              multiline
              numberOfLines={4}
            />
          </View>
        </GlassCard>

        {/* Enhanced Category Selection */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>Category *</Text>
          <View style={styles.categoryGrid}>
            {vibeCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  formData.category === category.id && styles.categoryCardActive,
                  { borderColor: category.color + '40' }
                ]}
                onPress={() => setFormData(prev => ({ ...prev, category: category.id }))}
              >
                <Text style={styles.categoryCardIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryCardText,
                  formData.category === category.id && { color: category.color },
                ]}>
                  {category.name}
                </Text>
                <Text style={styles.categoryCardDescription}>
                  {category.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Enhanced Photos Section */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>Photos *</Text>
          <Text style={styles.sectionSubtitle}>
            Add photos that capture the essence of this spot (max 5)
          </Text>
          
          <View style={styles.photoSection}>
            {formData.photos.length > 0 && (
              <View style={styles.photoGrid}>
                {formData.photos.map((photo, index) => (
                  <View key={index} style={styles.photoContainer}>
                    <Image source={{ uri: photo }} style={styles.photo} />
                    <TouchableOpacity
                      style={styles.removePhotoButton}
                      onPress={() => removePhoto(index)}
                    >
                      <X size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            
            {formData.photos.length < 5 && (
              <View style={styles.addPhotoContainer}>
                <PremiumButton
                  title="Take Photo"
                  onPress={takePhoto}
                  disabled={photoLoading}
                  variant="secondary"
                  size="small"
                  icon={photoLoading ? <LoadingSpinner size={20} color="#EA580C" /> : <Camera size={20} color="#EA580C" />}
                  style={styles.addPhotoButton}
                />
                
                <PremiumButton
                  title="From Gallery"
                  onPress={pickImage}
                  disabled={photoLoading}
                  variant="secondary"
                  size="small"
                  icon={photoLoading ? <LoadingSpinner size={20} color="#EA580C" /> : <ImageIcon size={20} color="#EA580C" />}
                  style={styles.addPhotoButton}
                />
              </View>
            )}
          </View>
        </GlassCard>

        {/* Enhanced Location Section */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>Location *</Text>
          
          <View style={styles.locationButtons}>
            <PremiumButton
              title="Use Current Location"
              onPress={getCurrentLocation}
              disabled={locationLoading}
              variant="secondary"
              icon={locationLoading ? <LoadingSpinner size={20} color="#EA580C" /> : <Navigation size={20} color="#EA580C" />}
              style={styles.locationButton}
            />
          </View>
          
          {formData.location && (
            <View style={styles.selectedLocation}>
              <MapPin size={16} color="#059669" />
              <Text style={styles.selectedLocationText}>{formData.location.address}</Text>
            </View>
          )}
        </GlassCard>

        {/* Enhanced Ratings */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>Rate This Spot</Text>
          <Text style={styles.sectionSubtitle}>
            Help others know what to expect
          </Text>

          <View style={styles.ratingGroup}>
            <View style={styles.ratingItem}>
              <Sparkles size={20} color="#EC4899" />
              <Text style={styles.ratingLabel}>Uniqueness</Text>
            </View>
            {renderStars(formData.ratings.uniqueness, (value) => updateRating('uniqueness', value))}
          </View>

          <View style={styles.ratingGroup}>
            <View style={styles.ratingItem}>
              <Star size={20} color="#7C3AED" />
              <Text style={styles.ratingLabel}>Vibe</Text>
            </View>
            {renderStars(formData.ratings.vibe, (value) => updateRating('vibe', value))}
          </View>

          <View style={styles.ratingGroup}>
            <View style={styles.ratingItem}>
              <Shield size={20} color="#059669" />
              <Text style={styles.ratingLabel}>Safety</Text>
            </View>
            {renderStars(formData.ratings.safety, (value) => updateRating('safety', value))}
          </View>

          <View style={styles.ratingGroup}>
            <View style={styles.ratingItem}>
              <Users size={20} color="#EA580C" />
              <Text style={styles.ratingLabel}>Crowd Level</Text>
            </View>
            {renderStars(formData.ratings.crowdLevel, (value) => updateRating('crowdLevel', value))}
          </View>
        </GlassCard>

        {/* Enhanced Tips */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>Tips for Visitors</Text>
          <Text style={styles.sectionSubtitle}>
            Share helpful advice for future visitors
          </Text>

          <View style={styles.tipInput}>
            <TextInput
              style={styles.input}
              placeholder="Add a helpful tip..."
              value={newTip}
              onChangeText={setNewTip}
            />
            <TouchableOpacity style={styles.addTipButton} onPress={addTip}>
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {formData.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Text style={styles.tipText}>• {tip}</Text>
              <TouchableOpacity onPress={() => removeTip(index)}>
                <X size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          ))}
        </GlassCard>

        {/* Enhanced Submit Button */}
        <PremiumButton
          title={isSubmitting ? 'Submitting...' : 'Submit Hidden Spot'}
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={styles.submitButton}
          size="large"
          icon={isSubmitting ? <LoadingSpinner size={20} color="#FFFFFF" /> : <Save size={20} color="#FFFFFF" />}
        />
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'Playfair-Bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#E2E8F0',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Playfair-Bold',
    color: '#1F2937',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  categoryCardActive: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryCardIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  categoryCardText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 4,
  },
  categoryCardDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  photoSection: {
    gap: 16,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoContainer: {
    position: 'relative',
    width: (width - 84) / 3,
    height: (width - 84) / 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  addPhotoButton: {
    flex: 1,
  },
  locationButtons: {
    marginBottom: 16,
  },
  locationButton: {
    width: '100%',
  },
  selectedLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  selectedLocationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#059669',
    marginLeft: 8,
    flex: 1,
  },
  ratingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ratingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginLeft: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  tipInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addTipButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  submitButton: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
});