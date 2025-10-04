import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { clustersAPI, postsAPI } from '../../services/api';

interface Cluster {
  clusterId: string;
  name: string;
  memberCount: number;
  demographics: { avgBudget: number; commonSituations: string[] };
}

interface Post {
  _id: string;
  anonymousAuthorId: string;
  title: string;
  content: string;
  budget: number;
  durationDays: number;
  strategies: string[];
  avgRating: number;
  ratingCount: number;
  createdAt: string;
}

export default function ExploreScreen() {
  const router = useRouter();
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [clusterPosts, setClusterPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadClusters();
  }, []);

  const loadClusters = async () => {
    try {
      setLoading(true);
      const response = await clustersAPI.getAllClusters();
      setClusters(response.data);
    } catch (error) {
      console.error('Error loading clusters:', error);
      // Fallback to demo data if API fails
      setClusters([
        {
          clusterId: 'ncr_students',
          name: 'NCR Students',
          memberCount: 47,
          demographics: { avgBudget: 3200, commonSituations: ['student'] }
        },
        {
          clusterId: 'cebu_professionals',
          name: 'Cebu Professionals',
          memberCount: 34,
          demographics: { avgBudget: 15000, commonSituations: ['professional'] }
        },
        {
          clusterId: 'davao_families',
          name: 'Davao Families',
          memberCount: 23,
          demographics: { avgBudget: 8000, commonSituations: ['family'] }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadClusterPosts = async (clusterId: string) => {
    try {
      setLoading(true);
      const response = await postsAPI.getClusterPosts(clusterId);
      setClusterPosts(response.data);
      setSelectedCluster(clusterId);
    } catch (error) {
      console.error('Error loading posts:', error);
      // Fallback to demo posts if API fails
      setClusterPosts([
        {
          _id: '1',
          anonymousAuthorId: 'User #247',
          title: 'Carenderia Strategy',
          content: 'I save by eating at carenderia near my school. I spend ₱50 per meal instead of ₱100+ in restaurants.',
          budget: 3000,
          durationDays: 14,
          strategies: ['carenderia'],
          avgRating: 4.8,
          ratingCount: 12,
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          anonymousAuthorId: 'User #156',
          title: 'Walking to School',
          content: 'I walk 20 minutes to school instead of taking jeepney. Saves me ₱40 daily!',
          budget: 2800,
          durationDays: 12,
          strategies: ['walking'],
          avgRating: 4.5,
          ratingCount: 8,
          createdAt: new Date().toISOString()
        }
      ]);
      setSelectedCluster(clusterId);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (selectedCluster) {
      setSelectedCluster(null);
    } else {
      router.back();
    }
  };

  if (loading && clusters.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e40af" />
          <Text style={styles.loadingText}>Loading communities...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {selectedCluster
              ? clusters.find(c => c.clusterId === selectedCluster)?.name
              : 'Explore Clusters'
            }
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {!selectedCluster ? (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Money Saving Communities</Text>
            <Text style={styles.sectionSubtitle}>
              Join communities that match your situation and learn proven strategies
            </Text>

            {clusters.map((cluster, index) => (
              <TouchableOpacity
                key={cluster.clusterId}
                style={[
                  styles.clusterCard,
                  index === clusters.length - 1 && styles.lastClusterCard
                ]}
                onPress={() => loadClusterPosts(cluster.clusterId)}
              >
                <View style={styles.clusterHeader}>
                  <Text style={styles.clusterName}>{cluster.name}</Text>
                  <View style={styles.memberBadge}>
                    <Text style={styles.memberBadgeText}>{cluster.memberCount} members</Text>
                  </View>
                </View>

                <View style={styles.clusterDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Avg Budget:</Text>
                    <Text style={styles.detailValue}>₱{cluster.demographics.avgBudget.toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Common Situations:</Text>
                    <Text style={styles.detailValue}>
                      {cluster.demographics.commonSituations.join(', ')}
                    </Text>
                  </View>
                </View>

                <View style={styles.exploreButton}>
                  <Text style={styles.exploreButtonText}>View Community →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionSubtitle}>
              Real strategies from community members
            </Text>

            {loading ? (
              <View style={styles.postsLoading}>
                <ActivityIndicator size="large" color="#1e40af" />
                <Text style={styles.loadingText}>Loading posts...</Text>
              </View>
            ) : clusterPosts.length === 0 ? (
              <View style={styles.noPosts}>
                <Text style={styles.noPostsTitle}>No posts yet</Text>
                <Text style={styles.noPostsText}>
                  Be the first to share your money-saving strategy in this community!
                </Text>
              </View>
            ) : (
              clusterPosts.map((post, index) => (
                <View
                  key={post._id}
                  style={[
                    styles.postCard,
                    index === clusterPosts.length - 1 && styles.lastPostCard
                  ]}
                >
                  <View style={styles.postHeader}>
                    <Text style={styles.postAuthor}>{post.anonymousAuthorId}</Text>
                    <View style={styles.ratingBadge}>
                      <Text style={styles.ratingBadgeText}>⭐ {post.avgRating}</Text>
                    </View>
                  </View>

                  <Text style={styles.postTitle}>{post.title}</Text>
                  <Text style={styles.postContent}>{post.content}</Text>

                  <View style={styles.postDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Budget: </Text>
                      <Text style={styles.detailValue}>₱{post.budget.toLocaleString()}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Duration: </Text>
                      <Text style={styles.detailValue}>{post.durationDays} days</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Strategies: </Text>
                      <Text style={styles.detailValue}>
                        {post.strategies.map(strategy => strategy.replace('_', ' ')).join(', ')}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.ratingCount}>({post.ratingCount} ratings)</Text>
                </View>
              ))
            )}
          </ScrollView>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginTop: 10,
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
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    marginTop: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 25,
    lineHeight: 22,
  },
  clusterCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#1e40af',
  },
  lastClusterCard: {
    marginBottom: 30,
  },
  clusterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clusterName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  memberBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  memberBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
  },
  clusterDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginRight: 6,
  },
  detailValue: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  exploreButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
  },
  postsLoading: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noPosts: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noPostsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 8,
  },
  noPostsText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 22,
  },
  postCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  lastPostCard: {
    marginBottom: 30,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  ratingBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d97706',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  postDetails: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  ratingCount: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'right',
  },
});
