import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { gwaliorHiddenSpots, vibeCategories } from '@/data/spots';
import { HiddenSpot } from '@/types';
import { Search, Filter, Star, TrendingUp, Clock, MapPin, Sliders } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SpotCard from '@/components/SpotCard';
import SpotDetailModal from '@/components/SpotDetailModal';
import EmptyState from '@/components/EmptyState';
import SkeletonLoader from '@/components/SkeletonLoader';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

const { width } = Dimensions.get('window');

export default function SpotsScreen() {
  const [selectedSpot, setSelectedSpot] = useState<HiddenSpot | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'recent' | 'trending'>('rating');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const filteredSpots = gwaliorHiddenSpots
    .filter(spot => {
      const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           spot.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || spot.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.overallRating - a.overallRating;
        case 'recent':
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        case 'trending':
          return b.experiences.length - a.experiences.length;
        default:
          return 0;
      }
    });

  const onRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    showToast('success', 'Spots refreshed');
  };

  const handleSpotPress = (spot: HiddenSpot) => {
    setSelectedSpot(spot);
    setShowModal(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSortBy('rating');
    showToast('info', 'Filters cleared');
  };

  const getSortIcon = () => {
    switch (sortBy) {
      case 'rating': return <Star size={16} color="#EA580C" />;
      case 'recent': return <Clock size={16} color="#EA580C" />;
      case 'trending': return <TrendingUp size={16} color="#EA580C" />;
      default: return <Star size={16} color="#EA580C" />;
    }
  };

  const renderSkeletonCards = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map((index) => (
        <View key={index} style={styles.skeletonCard}>
          <SkeletonLoader height={200} borderRadius={16} style={styles.skeletonImage} />
          <View style={styles.skeletonContent}>
            <SkeletonLoader height={20} width="80%" style={styles.skeletonTitle} />
            <SkeletonLoader height={16} width="100%" style={styles.skeletonDescription} />
            <SkeletonLoader height={16} width="60%" style={styles.skeletonMeta} />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Toast
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onHide={hideToast}
      />

      {/* Enhanced Header */}
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6', '#60A5FA']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Hidden Spots</Text>
            <Text style={styles.headerSubtitle}>
              {filteredSpots.length} spots in Gwalior
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.filterToggle}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Sliders size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        {/* Enhanced Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search spots..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Enhanced Filter and Sort Controls */}
      {showFilters && (
        <View style={styles.controlsContainer}>
          {/* Category Filters */}
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

          {/* Sort Options */}
          <View style={styles.sortContainer}>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'rating' && styles.sortButtonActive]}
              onPress={() => setSortBy('rating')}
            >
              <Star size={14} color={sortBy === 'rating' ? '#FFFFFF' : '#6B7280'} />
              <Text style={[styles.sortText, sortBy === 'rating' && styles.sortTextActive]}>
                Top Rated
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'recent' && styles.sortButtonActive]}
              onPress={() => setSortBy('recent')}
            >
              <Clock size={14} color={sortBy === 'recent' ? '#FFFFFF' : '#6B7280'} />
              <Text style={[styles.sortText, sortBy === 'recent' && styles.sortTextActive]}>
                Recent
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'trending' && styles.sortButtonActive]}
              onPress={() => setSortBy('trending')}
            >
              <TrendingUp size={14} color={sortBy === 'trending' ? '#FFFFFF' : '#6B7280'} />
              <Text style={[styles.sortText, sortBy === 'trending' && styles.sortTextActive]}>
                Trending
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Enhanced Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <MapPin size={20} color="#EA580C" />
          <Text style={styles.statNumber}>{filteredSpots.length}</Text>
          <Text style={styles.statLabel}>Spots Found</Text>
        </View>
        <View style={styles.statItem}>
          <Star size={20} color="#EA580C" />
          <Text style={styles.statNumber}>
            {filteredSpots.length > 0 
              ? (filteredSpots.reduce((sum, spot) => sum + spot.overallRating, 0) / filteredSpots.length).toFixed(1)
              : '0.0'
            }
          </Text>
          <Text style={styles.statLabel}>Avg Rating</Text>
        </View>
        <View style={styles.statItem}>
          <TrendingUp size={20} color="#EA580C" />
          <Text style={styles.statNumber}>
            {filteredSpots.reduce((sum, spot) => sum + spot.experiences.length, 0)}
          </Text>
          <Text style={styles.statLabel}>Experiences</Text>
        </View>
      </View>

      {/* Enhanced Spots List */}
      {isLoading ? (
        renderSkeletonCards()
      ) : filteredSpots.length > 0 ? (
        <ScrollView 
          style={styles.spotsContainer} 
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
      ) : (
        <EmptyState
          icon={MapPin}
          title="No spots found"
          subtitle="Try adjusting your search or filter criteria to discover amazing hidden spots in Gwalior."
          actionText="Clear Filters"
          onAction={clearFilters}
        />
      )}

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
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#E2E8F0',
  },
  filterToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginLeft: 12,
  },
  filterButton: {
    padding: 4,
  },
  controlsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  sortContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
  },
  sortButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  sortButtonActive: {
    backgroundColor: '#EA580C',
  },
  sortText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  sortTextActive: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  spotsContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  skeletonContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  skeletonImage: {
    marginBottom: 16,
  },
  skeletonContent: {
    padding: 16,
    gap: 8,
  },
  skeletonTitle: {
    marginBottom: 4,
  },
  skeletonDescription: {
    marginBottom: 4,
  },
  skeletonMeta: {
    marginBottom: 0,
  },
});