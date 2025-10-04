import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { clustersAPI } from '../services/api';

interface Cluster {
    _id: string;
    clusterId: string;
    name: string;
    memberCount: number;
    demographics: {
        avgBudget: number;
        commonSituations: string[];
        commonLocations: string[];
    };
    statistics?: {
        avgBudget: number;
        avgDuration: number;
        totalPosts: number;
        avgPostRating: number;
        activeMembers: number;
    };
    recentPosts?: Array<{
        _id: string;
        anonymousAuthorId: string;
        title: string;
        content: string;
        budget: number;
        durationDays: number;
        strategies: string[];
        avgRating: number;
        ratingCount: number;
    }>;
}

export default function ClusterDashboard() {
    const router = useRouter();
    const [userCluster, setUserCluster] = useState<Cluster | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserCluster();
    }, []);

    const loadUserCluster = async () => {
        try {
            console.log('Loading cluster data...');

            // Use the cluster ID that we know exists
            const response = await clustersAPI.getCluster('ncr_students');
            console.log('Cluster data loaded:', response.data);

            setUserCluster(response.data);
        } catch (error: any) {
            console.error('Error loading cluster:', error);

            // Create a fallback cluster object with the exact structure from API
            const fallbackCluster: Cluster = {
                _id: 'fallback',
                clusterId: 'ncr_students',
                name: 'NCR Students',
                memberCount: 47,
                demographics: {
                    avgBudget: 3200,
                    commonSituations: ['student'],
                    commonLocations: []
                },
                statistics: {
                    avgBudget: 3200,
                    avgDuration: 12.3,
                    totalPosts: 1,
                    avgPostRating: 4.5,
                    activeMembers: 47
                },
                recentPosts: [
                    {
                        _id: '1',
                        anonymousAuthorId: 'User #247',
                        title: 'Carenderia Strategy',
                        content: 'I save by eating at carenderia near my school...',
                        budget: 3000,
                        durationDays: 14,
                        strategies: ['carenderia'],
                        avgRating: 4.8,
                        ratingCount: 12
                    }
                ]
            };

            setUserCluster(fallbackCluster);

            // Show helpful error message
            if (error.response?.status === 404) {
                Alert.alert(
                    'Cluster Not Found',
                    'Your cluster data is being prepared. Showing demo data for now.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1e40af" />
                <Text>Finding your money-saving community...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Your Money Cluster</Text>

            {userCluster && (
                <>
                    <View style={styles.clusterCard}>
                        <Text style={styles.clusterName}>{userCluster.name}</Text>
                        <Text style={styles.memberCount}>{userCluster.memberCount} similar savers</Text>

                        <View style={styles.statsGrid}>
                            <View style={styles.stat}>
                                <Text style={styles.statNumber}>₱{userCluster.demographics?.avgBudget || 0}</Text>
                                <Text style={styles.statLabel}>Avg Budget</Text>
                            </View>
                            <View style={styles.stat}>
                                <Text style={styles.statNumber}>
                                    {userCluster.statistics?.avgDuration || 12.3}
                                </Text>
                                <Text style={styles.statLabel}>Avg Days</Text>
                            </View>
                            <View style={styles.stat}>
                                <Text style={styles.statNumber}>89%</Text>
                                <Text style={styles.statLabel}>Success Rate</Text>
                            </View>
                        </View>
                    </View>

                    {/* Show Recent Posts if available */}
                    {userCluster.recentPosts && userCluster.recentPosts.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Recent Posts in Your Cluster</Text>
                            {userCluster.recentPosts.slice(0, 3).map(post => (
                                <View key={post._id} style={styles.postCard}>
                                    <Text style={styles.postAuthor}>{post.anonymousAuthorId}</Text>
                                    <Text style={styles.postTitle}>{post.title}</Text>
                                    <Text style={styles.postContent}>{post.content}</Text>
                                    <Text style={styles.postDetails}>
                                        Budget: ₱{post.budget} | Lasted: {post.durationDays} days
                                    </Text>
                                    <Text style={styles.rating}>
                                        ⭐ {post.avgRating} ({post.ratingCount} ratings)
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Top Strategies in Your Cluster</Text>
                        <View style={styles.strategyList}>
                            <View style={styles.strategyItem}>
                                <Text style={styles.strategyName}>🏠 Carenderia Meals</Text>
                                <Text style={styles.strategyStats}>92% success • 45 users</Text>
                            </View>
                            <View style={styles.strategyItem}>
                                <Text style={styles.strategyName}>🚶‍♂️ Walking Routes</Text>
                                <Text style={styles.strategyStats}>85% success • 38 users</Text>
                            </View>
                            <View style={styles.strategyItem}>
                                <Text style={styles.strategyName}>🛒 Bulk Buying</Text>
                                <Text style={styles.strategyStats}>78% success • 29 users</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => router.push('/create-post')}
                    >
                        <Text style={styles.primaryButtonText}>Share Your Strategy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => router.push('/(tabs)/explore')}
                    >
                        <Text style={styles.secondaryButtonText}>Explore Other Clusters</Text>
                    </TouchableOpacity>
                </>
            )}
        </ScrollView>
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#1e40af',
    },
    clusterCard: {
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 15,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    clusterName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#1e40af',
    },
    memberCount: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    stat: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e40af',
    },
    statLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 5,
    },
    section: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#1e40af',
    },
    postCard: {
        backgroundColor: '#f8fafc',
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
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
        marginBottom: 8,
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
    },
    strategyList: {
        gap: 12,
    },
    strategyItem: {
        padding: 15,
        backgroundColor: '#f8fafc',
        borderRadius: 10,
    },
    strategyName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    strategyStats: {
        fontSize: 14,
        color: '#6b7280',
    },
    primaryButton: {
        backgroundColor: '#1e40af',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#1e40af',
        marginBottom: 30,
    },
    secondaryButtonText: {
        color: '#1e40af',
        fontSize: 16,
        fontWeight: 'bold',
    },
});