import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
  RefreshControl,
} from 'react-native';
import * as Location from 'expo-location';
import { gwaliorHiddenSpots, vibeCategories } from '@/data/spots';
import { HiddenSpot } from '@/types';
import { Search, Filter, MapPin, Navigation, Sparkles, TrendingUp, Zap, Grid2x2 as Grid, List } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SpotCard from '@/components/SpotCard';
import SpotDetailModal from '@/components/SpotDetailModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import FloatingActionButton from '@/components/FloatingActionButton';
import Toast from '@/components/Toast';
import GlassCard from '@/components/GlassCard';
import PulsingDot from '@/components/PulsingDot';
import PremiumButton from '@/components/PremiumButton';
import { useToast } from '@/hooks/useToast';

const { width, height } = Dimensions.get('window');

export default function DiscoverScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<HiddenSpot | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast('warning', 'Location permission required to discover nearby spots');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);
      showToast('success', 'Location updated successfully');
    } catch (error) {
      console.error('Error getting location:', error);
      showToast('error', 'Failed to get current location');
    } finally {
      setLocationLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await getCurrentLocation();
    setIsRefreshing(false);
    showToast('success', 'Spots refreshed');
  };

  const filteredSpots = gwaliorHiddenSpots.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         spot.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || spot.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSpotPress = (spot: HiddenSpot) => {
    setSelectedSpot(spot);
    setShowModal(true);
  };

  const getCategoryColor = (category: string) => {
    const cat = vibeCategories.find(c => c.id === category);
    return cat ? cat.color : '#6B7280';
  };

  const renderGridItem = (spot: HiddenSpot) => (
    <TouchableOpacity
      key={spot.id}
      style={styles.gridItem}
      onPress={() => handleSpotPress(spot)}
      activeOpacity={0.8}
    >
      <View style={[styles.gridMarker, { backgroundColor: getCategoryColor(spot.category) + '20' }]}>
        <MapPin size={20} color={getCategoryColor(spot.category)} strokeWidth={2} />
      </View>
      <View style={styles.gridInfo}>
        <Text style={styles.gridName} numberOfLines={1}>{spot.name}</Text>
        <Text style={styles.gridCategory}>
          {spot.category.charAt(0).toUpperCase() + spot.category.slice(1)}
        </Text>
        <View style={styles.gridRating}>
          <Sparkles size={14} color="#FCD34D" fill="#FCD34D" />
          <Text style={styles.gridRatingText}>{spot.overallRating.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={50} />
          <Text style={styles.loadingText}>Discovering hidden spots...</Text>
        </View>
      );
    }

    if (filteredSpots.length === 0) {
      return (
        <EmptyState
          icon={MapPin}
          title="No spots found"
          subtitle="Try adjusting your search or explore different categories to discover amazing hidden spots in Gwalior."
          actionText="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory(null);
          }}
        />
      );
    }

    return (
      <ScrollView 
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Card */}
        <GlassCard style={styles.statsCard}>
          <View style={styles.statsContent}>
            <View style={styles.statsHeader}>
              <Zap size={24} color="#EA580C" strokeWidth={2} />
              <Text style={styles.statsTitle}>Discovery Hub</Text>
            </View>
            <Text style={styles.statsSubtitle}>
              Explore {filteredSpots.length} hidden gems in Gwalior
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Sparkles size={16} color="#EA580C" />
                <Text style={styles.statText}>{filteredSpots.length} spots</Text>
              </View>
              <View style={styles.statItem}>
                <TrendingUp size={16} color="#10B981" />
                <Text style={styles.statText}>Gwalior, MP</Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* View Mode Toggle */}
        <View style={styles.viewModeContainer}>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'grid' && styles.viewModeActive]}
            onPress={() => setViewMode('grid')}
          >
            <Grid size={16} color={viewMode === 'grid' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.viewModeText, viewMode === 'grid' && styles.viewModeTextActive]}>
              Grid
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeActive]}
            onPress={() => setViewMode('list')}
          >
            <List size={16} color={viewMode === 'list' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.viewModeText, viewMode === 'list' && styles.viewModeTextActive]}>
              List
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content based on view mode */}
        {viewMode === 'grid' ? (
          <View style={styles.gridContainer}>
            {filteredSpots.map(renderGridItem)}
          </View>
        ) : (
          <View style={styles.listContainer}>
            {filteredSpots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                onPress={() => handleSpotPress(spot)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Toast
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onHide={hideToast}
      />

      {/* Enhanced Header with Gradient */}
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Discover Hidden Spots</Text>
            <Text style={styles.headerSubtitle}>Gwalior, Madhya Pradesh</Text>
          </View>
          {location && (
            <View style={styles.locationIndicator}>
              <PulsingDot size={8} color="#10B981" />
              <Text style={styles.locationText}>Located</Text>
            </View>
          )}
        </View>
        
        {/* Premium Search Bar */}
        <GlassCard style={styles.searchCard} intensity={60}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search hidden spots..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Enhanced Category Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
          <TouchableOpacity
            style={[styles.categoryButton, !selectedCategory && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.categoryButtonText, !selectedCategory && styles.categoryButtonTextActive]}>
              All ({gwaliorHiddenSpots.length})
            </Text>
          </TouchableOpacity>
          {vibeCategories.map((category) => {
            const count = gwaliorHiddenSpots.filter(spot => spot.category === category.id).length;
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive,
                  { borderColor: category.color + '40' }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category.id && styles.categoryButtonTextActive
                ]}>
                  {category.name} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </LinearGradient>

      {/* Main Content */}
      {renderContent()}

      {/* Enhanced Floating Action Button */}
      <FloatingActionButton
        onPress={getCurrentLocation}
        icon={
          locationLoading ? (
            <LoadingSpinner size={24} color="#FFFFFF" />
          ) : (
            <Navigation size={24} color="#FFFFFF" />
          )
        }
        style={styles.locationButton}
        colors={['#EA580C', '#DC2626', '#B91C1C']}
      />

      {/* Enhanced Spot Detail Modal */}
      <SpotDetailModal
        spot={selectedSpot}
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'Playfair-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#E2E8F0',
  },
  locationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  searchCard: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  filterButton: {
    padding: 4,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryButtonActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  categoryButtonTextActive: {
    color: '#1E3A8A',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 100,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  contentContainer: {
    flex: 1,
  },
  statsCard: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
  },
  statsContent: {
    alignItems: 'center',
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  statsTitle: {
    fontSize: 24,
    fontFamily: 'Playfair-Bold',
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  statsSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 32,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  viewModeContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  viewModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  viewModeActive: {
    backgroundColor: '#EA580C',
  },
  viewModeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  viewModeTextActive: {
    color: '#FFFFFF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 100,
  },
  gridItem: {
    width: (width - 56) / 2,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
  },
  gridMarker: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  gridInfo: {
    alignItems: 'center',
    width: '100%',
  },
  gridName: {
    fontSize: 16,
    fontFamily: 'Playfair-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  gridCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 12,
  },
  gridRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gridRatingText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#EA580C',
  },
  listContainer: {
    paddingBottom: 100,
  },
  locationButton: {
    position: 'absolute',
    right: 20,
    bottom: 100,
  },
});