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
import { Search, Filter, MapPin, Navigation, Compass, Sparkles, TrendingUp } from 'lucide-react-native';
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

// Conditionally import MapView only for native platforms
let MapView: any = null;
let Marker: any = null;

if (Platform.OS !== 'web') {
  try {
    const MapModule = require('react-native-maps');
    MapView = MapModule.default;
    Marker = MapModule.Marker;
  } catch (error) {
    console.warn('react-native-maps not available:', error);
  }
}

const { width, height } = Dimensions.get('window');

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function DiscoverScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<HiddenSpot | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(Platform.OS !== 'web');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const gwaliorRegion: Region = {
    latitude: 26.2183,
    longitude: 78.1828,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

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

  const getMarkerColor = (category: string) => {
    switch (category) {
      case 'romantic': return '#EC4899';
      case 'serene': return '#059669';
      case 'creative': return '#7C3AED';
      case 'adventure': return '#EA580C';
      default: return '#6B7280';
    }
  };

  const renderWebMap = () => (
    <View style={styles.webMapContainer}>
      <GlassCard style={styles.webMapPlaceholder}>
        <View style={styles.webMapContent}>
          <Compass size={64} color="#EA580C" strokeWidth={1.5} />
          <Text style={styles.webMapTitle}>Interactive Map</Text>
          <Text style={styles.webMapSubtitle}>
            Map view is available on mobile devices
          </Text>
          <View style={styles.webMapStats}>
            <View style={styles.webMapStat}>
              <Sparkles size={20} color="#EA580C" />
              <Text style={styles.webMapStatText}>{filteredSpots.length} hidden spots</Text>
            </View>
            <View style={styles.webMapStat}>
              <TrendingUp size={20} color="#10B981" />
              <Text style={styles.webMapStatText}>Gwalior, MP</Text>
            </View>
          </View>
        </View>
      </GlassCard>
      
      <ScrollView 
        style={styles.webSpotsList} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.webSpotsGrid}>
          {filteredSpots.map((spot) => (
            <TouchableOpacity
              key={spot.id}
              style={styles.webSpotItem}
              onPress={() => handleSpotPress(spot)}
            >
              <View style={[styles.webSpotMarker, { backgroundColor: getMarkerColor(spot.category) + '20' }]}>
                <MapPin size={16} color={getMarkerColor(spot.category)} />
              </View>
              <View style={styles.webSpotInfo}>
                <Text style={styles.webSpotName}>{spot.name}</Text>
                <Text style={styles.webSpotCategory}>
                  {spot.category.charAt(0).toUpperCase() + spot.category.slice(1)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderNativeMap = () => {
    if (!MapView || !Marker) {
      return (
        <View style={styles.mapError}>
          <MapPin size={48} color="#6B7280" />
          <Text style={styles.mapErrorText}>Map not available</Text>
        </View>
      );
    }

    return (
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={gwaliorRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
          userLocationPriority="high"
          userLocationUpdateInterval={10000}
          mapType="standard"
          showsCompass={false}
          showsScale={false}
          showsBuildings={true}
          showsTraffic={false}
        >
          {filteredSpots.map((spot) => (
            <Marker
              key={spot.id}
              coordinate={{
                latitude: spot.latitude,
                longitude: spot.longitude,
              }}
              title={spot.name}
              description={spot.description}
              pinColor={getMarkerColor(spot.category)}
              onPress={() => handleSpotPress(spot)}
            />
          ))}
        </MapView>
        
        <ScrollView
          horizontal
          style={styles.spotCardsContainer}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          decelerationRate="fast"
          snapToInterval={width * 0.85 + width * 0.15}
        >
          {filteredSpots.map((spot) => (
            <View key={spot.id} style={styles.spotCardWrapper}>
              <SpotCard
                spot={spot}
                onPress={() => handleSpotPress(spot)}
              />
            </View>
          ))}
        </ScrollView>
      </View>
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

      {/* Enhanced Toggle View */}
      {Platform.OS !== 'web' && (
        <GlassCard style={styles.toggleContainer} intensity={95}>
          <View style={styles.toggleButtons}>
            <PremiumButton
              title="Map View"
              onPress={() => setShowMap(true)}
              variant={showMap ? 'primary' : 'ghost'}
              size="small"
              icon={<MapPin size={16} color={showMap ? '#FFFFFF' : '#6B7280'} />}
              style={styles.toggleButton}
            />
            <PremiumButton
              title="List View"
              onPress={() => setShowMap(false)}
              variant={!showMap ? 'primary' : 'ghost'}
              size="small"
              style={styles.toggleButton}
            />
          </View>
        </GlassCard>
      )}

      {/* Content with Loading States */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={50} />
          <Text style={styles.loadingText}>Discovering hidden spots...</Text>
        </View>
      ) : filteredSpots.length === 0 ? (
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
      ) : showMap ? (
        Platform.OS === 'web' ? renderWebMap() : renderNativeMap()
      ) : (
        <ScrollView 
          style={styles.listContainer} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          {filteredSpots.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              onPress={() => handleSpotPress(spot)}
            />
          ))}
        </ScrollView>
      )}

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
        style={[
          styles.locationButton,
          { bottom: (showMap && Platform.OS !== 'web') ? 240 : 80 }
        ]}
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
  toggleContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
  },
  toggleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapError: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  mapErrorText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 12,
  },
  webMapContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  webMapPlaceholder: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  webMapContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  webMapTitle: {
    fontSize: 24,
    fontFamily: 'Playfair-Bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  webMapSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  webMapStats: {
    flexDirection: 'row',
    gap: 24,
  },
  webMapStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  webMapStatText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  webSpotsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  webSpotsGrid: {
    gap: 12,
  },
  webSpotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  webSpotMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  webSpotInfo: {
    flex: 1,
  },
  webSpotName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  webSpotCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  spotCardsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 200,
  },
  spotCardWrapper: {
    width: width * 0.85,
    marginHorizontal: width * 0.075,
  },
  listContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  locationButton: {
    position: 'absolute',
    right: 20,
  },
});