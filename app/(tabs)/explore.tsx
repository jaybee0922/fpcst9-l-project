import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  if (loading && clusters.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
        <Text>Loading communities...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Clusters</Text>

      {!selectedCluster ? (
        <ScrollView>
          <Text style={styles.sectionTitle}>Money Saving Communities</Text>
          {clusters.map(cluster => (
            <TouchableOpacity
              key={cluster.clusterId}
              style={styles.clusterCard}
              onPress={() => loadClusterPosts(cluster.clusterId)}
            >
              <Text style={styles.clusterName}>{cluster.name}</Text>
              <Text>{cluster.memberCount} members</Text>
              <Text>Avg budget: ₱{cluster.demographics.avgBudget}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <ScrollView>
          <TouchableOpacity onPress={() => setSelectedCluster(null)}>
            <Text style={styles.backButton}>← Back to Clusters</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>
            Posts from {clusters.find(c => c.clusterId === selectedCluster)?.name}
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#1e40af" style={styles.loader} />
          ) : clusterPosts.length === 0 ? (
            <Text style={styles.noPosts}>No posts yet in this cluster. Be the first to share!</Text>
          ) : (
            clusterPosts.map(post => (
              <View key={post._id} style={styles.postCard}>
                <Text style={styles.postAuthor}>{post.anonymousAuthorId}</Text>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postContent}>{post.content}</Text>
                <Text style={styles.postDetails}>
                  Budget: ₱{post.budget} | Lasted: {post.durationDays} days
                </Text>
                <Text style={styles.postDetails}>
                  Strategies: {post.strategies.join(', ')}
                </Text>
                <Text style={styles.rating}>
                  ⭐ {post.avgRating} ({post.ratingCount} ratings)
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loader: {
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e40af',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
  },
  clusterCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clusterName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  backButton: {
    fontSize: 16,
    color: '#1e40af',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  postCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postAuthor: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#666',
    fontSize: 14,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e40af',
  },
  postContent: {
    marginBottom: 10,
    lineHeight: 20,
    color: '#4b5563',
  },
  postDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
    marginTop: 5,
  },
  noPosts: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
    marginTop: 20,
    fontStyle: 'italic',
  },
});