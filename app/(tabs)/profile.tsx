import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { gwaliorHiddenSpots } from '@/data/spots';
import {
  User,
  MapPin,
  Calendar,
  Star,
  Heart,
  Share2,
  Settings,
  Camera,
  Trophy,
  TrendingUp,
  Users,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'spots' | 'favorites' | 'activity'>('spots');

  // Mock user data
  const userData = {
    name: 'Priya Sharma',
    joinedDate: new Date('2023-08-15'),
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    spotsShared: 3,
    spotsDiscovered: 12,
    totalLikes: 45,
    level: 'Explorer',
    badges: [
      { id: 'first-spot', name: 'First Discovery', icon: '🏃', earned: true },
      { id: 'photographer', name: 'Photographer', icon: '📸', earned: true },
      { id: 'storyteller', name: 'Storyteller', icon: '📖', earned: false },
      { id: 'local-guide', name: 'Local Guide', icon: '🗺️', earned: false },
    ],
  };

  const mySpots = gwaliorHiddenSpots.slice(0, 3); // Mock user's spots
  const favoriteSpots = gwaliorHiddenSpots.slice(1, 4); // Mock favorite spots

  const renderBadge = (badge: any) => (
    <View key={badge.id} style={[styles.badge, !badge.earned && styles.badgeDisabled]}>
      <Text style={styles.badgeIcon}>{badge.icon}</Text>
      <Text style={[styles.badgeName, !badge.earned && styles.badgeNameDisabled]}>
        {badge.name}
      </Text>
    </View>
  );

  const renderSpotCard = (spot: any) => (
    <TouchableOpacity key={spot.id} style={styles.spotCard}>
      <Image source={{ uri: spot.photos[0] }} style={styles.spotCardImage} />
      <View style={styles.spotCardContent}>
        <Text style={styles.spotCardName}>{spot.name}</Text>
        <View style={styles.spotCardMeta}>
          <Star size={12} color="#FCD34D" fill="#FCD34D" />
          <Text style={styles.spotCardRating}>{spot.overallRating.toFixed(1)}</Text>
          <MapPin size={12} color="#6B7280" />
          <Text style={styles.spotCardLocation}>Gwalior</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: userData.avatar }} style={styles.avatar} />
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userLevel}>{userData.level}</Text>
            <Text style={styles.joinDate}>
              Joined {userData.joinedDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MapPin size={20} color="#EA580C" />
            <Text style={styles.statNumber}>{userData.spotsDiscovered}</Text>
            <Text style={styles.statLabel}>Discovered</Text>
          </View>
          <View style={styles.statItem}>
            <Share2 size={20} color="#EA580C" />
            <Text style={styles.statNumber}>{userData.spotsShared}</Text>
            <Text style={styles.statLabel}>Shared</Text>
          </View>
          <View style={styles.statItem}>
            <Heart size={20} color="#EA580C" />
            <Text style={styles.statNumber}>{userData.totalLikes}</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.badgesContainer}>
            {userData.badges.map(renderBadge)}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'spots' && styles.tabActive]}
            onPress={() => setActiveTab('spots')}
          >
            <MapPin size={16} color={activeTab === 'spots' ? '#EA580C' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'spots' && styles.tabTextActive]}>
              My Spots
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'favorites' && styles.tabActive]}
            onPress={() => setActiveTab('favorites')}
          >
            <Heart size={16} color={activeTab === 'favorites' ? '#EA580C' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'favorites' && styles.tabTextActive]}>
              Favorites
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'activity' && styles.tabActive]}
            onPress={() => setActiveTab('activity')}
          >
            <TrendingUp size={16} color={activeTab === 'activity' ? '#EA580C' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'activity' && styles.tabTextActive]}>
              Activity
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'spots' && (
            <View>
              <Text style={styles.tabContentTitle}>Spots You've Shared</Text>
              <View style={styles.spotsGrid}>
                {mySpots.map(renderSpotCard)}
              </View>
            </View>
          )}

          {activeTab === 'favorites' && (
            <View>
              <Text style={styles.tabContentTitle}>Your Favorite Spots</Text>
              <View style={styles.spotsGrid}>
                {favoriteSpots.map(renderSpotCard)}
              </View>
            </View>
          )}

          {activeTab === 'activity' && (
            <View>
              <Text style={styles.tabContentTitle}>Recent Activity</Text>
              <View style={styles.activityList}>
                <View style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Heart size={16} color="#EC4899" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>
                      You liked <Text style={styles.activitySpot}>Riverside Artist Corner</Text>
                    </Text>
                    <Text style={styles.activityTime}>2 hours ago</Text>
                  </View>
                </View>
                
                <View style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Share2 size={16} color="#059669" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>
                      You shared <Text style={styles.activitySpot}>Sunset Point at Gwalior Fort</Text>
                    </Text>
                    <Text style={styles.activityTime}>1 day ago</Text>
                  </View>
                </View>
                
                <View style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Users size={16} color="#7C3AED" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>
                      You commented on <Text style={styles.activitySpot}>Phool Bagh Secret Garden</Text>
                    </Text>
                    <Text style={styles.activityTime}>3 days ago</Text>
                  </View>
                </View>
                
                <View style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Trophy size={16} color="#EA580C" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>
                      You earned the <Text style={styles.activitySpot}>Photographer</Text> badge
                    </Text>
                    <Text style={styles.activityTime}>1 week ago</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
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
    paddingBottom: 30,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  settingsButton: {
    position: 'absolute',
    top: 0,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userLevel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: -20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#EA580C',
    alignItems: 'center',
    minWidth: 80,
  },
  badgeDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  badgeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  badgeName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#EA580C',
  },
  badgeNameDisabled: {
    color: '#9CA3AF',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#FEF3F2',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 6,
  },
  tabTextActive: {
    color: '#EA580C',
  },
  tabContent: {
    marginBottom: 40,
  },
  tabContentTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  spotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  spotCard: {
    width: (width - 64) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  spotCardImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  spotCardContent: {
    padding: 12,
  },
  spotCardName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  spotCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  spotCardRating: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  spotCardLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
  },
  activitySpot: {
    fontFamily: 'Inter-SemiBold',
    color: '#EA580C',
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 4,
  },
});