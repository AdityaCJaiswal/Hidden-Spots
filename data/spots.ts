import { HiddenSpot } from '@/types';

export const gwaliorHiddenSpots: HiddenSpot[] = [
  {
    id: '1',
    name: 'Sunset Point at Gwalior Fort',
    description: 'A serene corner of the historic fort offering breathtaking sunset views over the city.',
    story: 'Discovered this magical spot during a solo exploration of the fort. The evening light filtering through the ancient stones creates an otherworldly atmosphere. Perfect for reflection and photography.',
    latitude: 26.2295,
    longitude: 78.1808,
    category: 'serene',
    photos: [
      'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg',
      'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg',
      'https://images.pexels.com/photos/1612461/pexels-photo-1612461.jpeg'
    ],
    ratings: {
      uniqueness: 4.5,
      vibe: 4.8,
      safety: 4.2,
      crowdLevel: 2.1
    },
    overallRating: 4.4,
    submittedBy: 'Arjun Sharma',
    submittedAt: new Date('2024-01-15'),
    experiences: [
      {
        id: 'exp1',
        userId: 'user1',
        userName: 'Priya Singh',
        content: 'Visited here with my partner last month. The sunset was absolutely stunning! We had the whole place to ourselves.',
        isAnonymous: false,
        createdAt: new Date('2024-01-20'),
        likes: 12
      }
    ],
    tips: ['Best time to visit is 6-7 PM', 'Carry water and snacks', 'Wear comfortable shoes for the climb']
  },
  {
    id: '2',
    name: 'Phool Bagh Secret Garden',
    description: 'A hidden section of the famous Phool Bagh with ancient trees and peaceful corners.',
    story: 'While exploring Phool Bagh, I discovered this secluded area behind the main garden. The century-old trees create a natural canopy, and there\'s a small stone seat perfect for reading or meditation.',
    latitude: 26.2124,
    longitude: 78.1772,
    category: 'romantic',
    photos: [
      'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg',
      'https://images.pexels.com/photos/1300510/pexels-photo-1300510.jpeg',
      'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg'
    ],
    ratings: {
      uniqueness: 4.2,
      vibe: 4.6,
      safety: 4.5,
      crowdLevel: 1.8
    },
    overallRating: 4.3,
    submittedBy: 'Kavya Patel',
    submittedAt: new Date('2024-01-18'),
    experiences: [
      {
        id: 'exp2',
        userId: 'user2',
        userName: 'Anonymous Explorer',
        content: 'Perfect spot for a quiet date. The morning light filtering through the leaves is magical.',
        isAnonymous: true,
        createdAt: new Date('2024-01-25'),
        likes: 8
      }
    ],
    tips: ['Early morning visits are best', 'Bring a book or journal', 'Respect the peaceful atmosphere']
  },
  {
    id: '3',
    name: 'Riverside Artist Corner',
    description: 'A creative space along the Chambal riverbank where local artists gather to paint and sketch.',
    story: 'Found this artistic community by accident while walking along the river. Local painters and sketchers meet here every evening to capture the changing light. The riverbank provides endless inspiration.',
    latitude: 26.2020,
    longitude: 78.1950,
    category: 'creative',
    photos: [
      'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg',
      'https://images.pexels.com/photos/1109354/pexels-photo-1109354.jpeg',
      'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg'
    ],
    ratings: {
      uniqueness: 4.7,
      vibe: 4.5,
      safety: 3.8,
      crowdLevel: 2.5
    },
    overallRating: 4.4,
    submittedBy: 'Rohit Verma',
    submittedAt: new Date('2024-01-22'),
    experiences: [
      {
        id: 'exp3',
        userId: 'user3',
        userName: 'Meera Artist',
        content: 'This place ignited my passion for painting again. The community here is so welcoming and inspiring.',
        isAnonymous: false,
        createdAt: new Date('2024-01-28'),
        likes: 15
      }
    ],
    tips: ['Bring your own art supplies', 'Join the evening art sessions', 'Respect the river environment']
  },
  {
    id: '4',
    name: 'Tighra Dam Viewpoint',
    description: 'A lesser-known viewpoint offering panoramic views of Tighra Dam and surrounding hills.',
    story: 'While cycling around Tighra Dam, I discovered this elevated spot off the main road. The view is spectacular, especially during monsoon when the dam is full. It\'s perfect for photography and peaceful contemplation.',
    latitude: 26.2850,
    longitude: 78.2100,
    category: 'adventure',
    photos: [
      'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg',
      'https://images.pexels.com/photos/1612461/pexels-photo-1612461.jpeg',
      'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg'
    ],
    ratings: {
      uniqueness: 4.6,
      vibe: 4.3,
      safety: 4.0,
      crowdLevel: 1.5
    },
    overallRating: 4.1,
    submittedBy: 'Ankit Gupta',
    submittedAt: new Date('2024-01-25'),
    experiences: [
      {
        id: 'exp4',
        userId: 'user4',
        userName: 'Travel Enthusiast',
        content: 'Went here for sunrise photography. The mist over the water and the golden light were absolutely breathtaking!',
        isAnonymous: false,
        createdAt: new Date('2024-02-01'),
        likes: 10
      }
    ],
    tips: ['Best during monsoon and winter', 'Carry camera for amazing shots', 'Visit during sunrise or sunset']
  }
];

export const vibeCategories = [
  {
    id: 'romantic',
    name: 'Romantic',
    color: '#EC4899',
    icon: '💕',
    description: 'Perfect for couples and intimate moments'
  },
  {
    id: 'serene',
    name: 'Serene',
    color: '#059669',
    icon: '🧘',
    description: 'Peaceful spots for meditation and reflection'
  },
  {
    id: 'creative',
    name: 'Creative',
    color: '#7C3AED',
    icon: '🎨',
    description: 'Inspiring spaces for artists and creators'
  },
  {
    id: 'adventure',
    name: 'Adventure',
    color: '#EA580C',
    icon: '🏃',
    description: 'Exciting spots for thrill-seekers'
  }
];