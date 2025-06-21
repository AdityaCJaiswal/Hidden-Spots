export interface HiddenSpot {
  id: string;
  name: string;
  description: string;
  story: string;
  latitude: number;
  longitude: number;
  category: 'romantic' | 'serene' | 'creative' | 'adventure';
  photos: string[];
  ratings: {
    uniqueness: number;
    vibe: number;
    safety: number;
    crowdLevel: number;
  };
  overallRating: number;
  submittedBy: string;
  submittedAt: Date;
  experiences: Experience[];
  tips: string[];
}

export interface Experience {
  id: string;
  userId: string;
  userName: string;
  content: string;
  isAnonymous: boolean;
  createdAt: Date;
  likes: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  spotsDiscovered: number;
  spotsShared: number;
  joinedAt: Date;
  favoriteSpots: string[];
}

export type VibeCategory = {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
};