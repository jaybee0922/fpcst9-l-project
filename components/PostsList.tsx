import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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

interface PostsListProps {
  posts: Post[];
  loading: boolean;
}



export default function PostsList({ posts, loading }: PostsListProps) {



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading posts...</Text>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.noPosts}>
        <Text style={styles.noPostsTitle}>No posts yet</Text>
        <Text style={styles.noPostsText}>
          Be the first to share your money-saving strategy in this community!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {posts.map((post, index) => (
        <View
          key={post._id}
          style={[
            styles.postCard,
            index === posts.length - 1 && styles.lastPostCard
          ]}
        >
          <View style={styles.postHeader}>
            <Text style={styles.postAuthor}>{post.anonymousAuthorId}</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingBadgeText}>⭐ {post.avgRating || 0}</Text>
            </View>
          </View>

          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postContent}>{post.content}</Text>

          <View style={styles.postDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Budget: </Text>
              <Text style={styles.detailValue}>₱{post.budget?.toLocaleString()}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Duration: </Text>
              <Text style={styles.detailValue}>{post.durationDays} days</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Strategies: </Text>
              <Text style={styles.detailValue}>
                {post.strategies?.map(strategy => strategy.replace('_', ' ')).join(', ') || 'None'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Region: </Text>
              <Text style={styles.detailValue}>{post.region || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Type: </Text>
              <Text style={styles.detailValue}>{post.userType || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Household: </Text>
              <Text style={styles.detailValue}>{post.householdSize || 1} people</Text>
            </View>
          </View>

          <Text style={styles.ratingCount}>({post.ratingCount || 0} ratings)</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
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
  ratingCount: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'right',
  },
});