import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PostsList from '../components/PostsList';
import { authHelper, postsAPI } from '../services/api';

interface Post {
  _id: string;
  anonymousAuthorId: string;
  title: string;
  content: string;
  budget: number;
  durationDays: number;
  strategies: string[];
  region: string;
  userType: string;
  householdSize: number;
  avgRating: number;
  ratingCount: number;
  createdAt: string;
}

export default function PostsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ clusterId?: string; refresh?: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userFullName, setUserFullName] = useState('');
  const [clusterName, setClusterName] = useState('Community Posts');

  useEffect(() => {
    loadUserData();
    loadPosts();
  }, [params.clusterId, params.refresh]);

  const loadUserData = async () => {
    try {
      const userData = await authHelper.getUserData();
      if (userData && userData.fullName) {
        const capitalizedName = userData.fullName
          .split(' ')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        setUserFullName(capitalizedName);
      }

      // Set cluster name based on clusterId
      if (params.clusterId) {
        const clusterNames: { [key: string]: string } = {
          'ncr_students': 'NCR Students',
          'province_families': 'Province Families',
          'workers': 'Workers',
          // Add more cluster mappings as needed
        };
        setClusterName(clusterNames[params.clusterId] || 'Community Posts');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authHelper.removeToken();
      await authHelper.removeUserData();
      router.replace('/Welcome');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const clusterId = params.clusterId || 'ncr_students';
      
      console.log("🔄 Loading posts for cluster:", clusterId);
      const response = await postsAPI.getClusterPosts(clusterId);
      console.log("✅ Posts loaded:", response.data);

      // Sort posts by createdAt ascending (oldest first, newest last)
      const sortedPosts = response.data.sort((a: Post, b: Post) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      // Fallback posts in case of error
      setPosts([
        {
          _id: '1',
          anonymousAuthorId: 'User #247',
          title: 'Carenderia Strategy',
          content: 'I save by eating at carenderia near my school. The meals are affordable and filling!',
          budget: 3000,
          durationDays: 14,
          strategies: ['carenderia'],
          region: 'NCR',
          userType: 'student',
          householdSize: 1,
          avgRating: 4.8,
          ratingCount: 12,
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          anonymousAuthorId: 'User #156',
          title: 'Bulk Buying Tips',
          content: 'Buying in bulk from the palengke saves me a lot of money each month.',
          budget: 5000,
          durationDays: 30,
          strategies: ['bulk_buying', 'palengke'],
          region: 'Province',
          userType: 'family',
          householdSize: 4,
          avgRating: 4.5,
          ratingCount: 8,
          createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with User Fullname and Exit Icon */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{clusterName}</Text>
          <View style={styles.headerRight}>
            {userFullName ? (
              <Text style={styles.userName}>{userFullName}</Text>
            ) : null}
            <TouchableOpacity style={styles.logoutIconContainer} onPress={handleLogout}>
              <Image
                source={require('../assets/images/exit.png')}
                style={styles.logoutIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionSubtitle}>
            Real strategies from community members
          </Text>

          {/* Debug Info - Optional, you can remove this */}
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>
              {posts.length} posts • {loading ? 'Loading...' : 'Loaded'}
            </Text>
          </View>

          <PostsList posts={posts} loading={loading} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginTop: 70,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#1e40af',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textTransform: 'capitalize',
  },
  logoutIconContainer: {
    padding: 8,
  },
  logoutIcon: {
    width: 30,
    height: 30,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 50
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  debugContainer: {
    backgroundColor: '#fef3c7',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    color: '#92400e',
    textAlign: 'center',
  },
});