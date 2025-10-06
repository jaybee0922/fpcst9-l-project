// import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import PostsList from '../../components/PostsList';
// import { authHelper, clustersAPI, postsAPI } from '../../services/api';

// interface Cluster {
//   clusterId: string;
//   name: string;
//   memberCount: number;
//   demographics: { avgBudget: number; commonSituations: string[] };
// }

// interface Post {
//   _id: string;
//   anonymousAuthorId: string;
//   title: string;
//   content: string;
//   budget: number;
//   durationDays: number;
//   strategies: string[];
//   region: string;
//   userType: string;
//   householdSize: number;
//   avgRating: number;
//   ratingCount: number;
//   createdAt: string;
// }

// export default function ExploreScreen() {
//   const router = useRouter();
//   const { clusterId: paramClusterId } = useLocalSearchParams<{ clusterId?: string }>();
//   const [clusters, setClusters] = useState<Cluster[]>([]);
//   const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
//   const [clusterPosts, setClusterPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [userFullName, setUserFullName] = useState('');

//   useEffect(() => {
//     loadClusters();
//     loadUserData();
//   }, []);

//   const loadUserData = async () => {
//     try {
//       const userData = await authHelper.getUserData();
//       if (userData && userData.fullName) {
//         // Capitalize the full name
//         const capitalizedName = userData.fullName
//           .split(' ')
//           .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//           .join(' ');
//         setUserFullName(capitalizedName);
//       }
//     } catch (error) {
//       console.error('Error loading user data:', error);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await authHelper.removeToken();
//       await authHelper.removeUserData();
//       router.replace('/Welcome');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   // Debug params
//   useEffect(() => {
//     console.log("🔍 Current paramClusterId:", paramClusterId);
//   }, [paramClusterId]);

//   useFocusEffect(
//     React.useCallback(() => {
//       // Auto-load posts if coming from create-post with clusterId param
//       if (paramClusterId && !selectedCluster) {
//         console.log("🎯 Auto-loading cluster from params:", paramClusterId);
//         loadClusterPosts(paramClusterId as string);
//       } else if (selectedCluster) {
//         loadClusterPosts(selectedCluster);
//       }
//     }, [selectedCluster, paramClusterId])
//   );

//   const loadClusters = async () => {
//     try {
//       setLoading(true);
//       const response = await clustersAPI.getAllClusters();
//       console.log("Clusters loaded:", response.data);
//       let loadedClusters = response.data;
//       if (loadedClusters.length === 0) {
//         console.log("No clusters from API, using fallback");
//         loadedClusters = [
//           {
//             clusterId: 'ncr_students',
//             name: 'NCR Students',
//             memberCount: 47,
//             demographics: { avgBudget: 3200, commonSituations: ['student'] }
//           }
//         ];
//       }
//       setClusters(loadedClusters);
//     } catch (error) {
//       console.error('Error loading clusters:', error);
//       setClusters([
//         {
//           clusterId: 'ncr_students',
//           name: 'NCR Students',
//           memberCount: 47,
//           demographics: { avgBudget: 3200, commonSituations: ['student'] }
//         }
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadClusterPosts = async (clusterId: string) => {
//     console.log("🔄 loadClusterPosts called with:", clusterId);
//     try {
//       setLoading(true);
//       const response = await postsAPI.getClusterPosts(clusterId);
//       console.log("✅ Posts loaded:", response.data);

//       // Sort posts by createdAt ascending (oldest first, newest last)
//       const sortedPosts = response.data.sort((a: Post, b: Post) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

//       // Use functional update to ensure state is set correctly
//       setClusterPosts(prev => {
//         console.log("🔄 Setting clusterPosts to:", sortedPosts);
//         return sortedPosts;
//       });

//       setSelectedCluster(prev => {
//         console.log("🔄 Setting selectedCluster to:", clusterId);
//         return clusterId;
//       });

//     } catch (error) {
//       console.error('Error loading posts:', error);
//       setClusterPosts([
//         {
//           _id: '1',
//           anonymousAuthorId: 'User #247',
//           title: 'Carenderia Strategy',
//           content: 'I save by eating at carenderia near my school.',
//           budget: 3000,
//           durationDays: 14,
//           strategies: ['carenderia'],
//           region: 'N/A',
//           userType: 'N/A',
//           householdSize: 1,
//           avgRating: 4.8,
//           ratingCount: 12,
//           createdAt: new Date().toISOString()
//         }
//       ]);
//       setSelectedCluster(clusterId);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBack = () => {
//     if (selectedCluster) {
//       setSelectedCluster(null);
//       setClusterPosts([]);
//     } else {
//       router.back();
//     }
//   };

//   if (loading && clusters.length === 0) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#1e40af" />
//           <Text style={styles.loadingText}>Loading communities...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         {/* Header with User Fullname and Exit Icon */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//             <Text style={styles.backButtonText}>←</Text>
//           </TouchableOpacity>
//           <Text style={styles.title}>
//             {selectedCluster
//               ? clusters.find(c => c.clusterId === selectedCluster)?.name
//               : 'Explore Clusters'
//             }
//           </Text>
//           <View style={styles.headerRight}>
//             {userFullName ? (
//               <Text style={styles.userName}>{userFullName}</Text>
//             ) : null}
//             <TouchableOpacity style={styles.logoutIconContainer} onPress={handleLogout}>
//               <Image
//                 source={require('../../assets/images/exit.png')}
//                 style={styles.logoutIcon}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {!selectedCluster ? (
//           <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//             <Text style={styles.sectionTitle}>Money Saving Communities</Text>
//             <Text style={styles.sectionSubtitle}>
//               Join communities that match your situation and learn proven strategies
//             </Text>

//             {clusters.map((cluster, index) => (
//               <TouchableOpacity
//                 key={cluster.clusterId}
//                 style={styles.clusterCard}
//                 onPress={() => {
//                   console.log("🎯 Cluster clicked:", cluster.clusterId);
//                   loadClusterPosts(cluster.clusterId);
//                 }}
//               >
//                 <View style={styles.clusterHeader}>
//                   <Text style={styles.clusterName}>{cluster.name}</Text>
//                   <View style={styles.memberBadge}>
//                     <Text style={styles.memberBadgeText}>{cluster.memberCount} members</Text>
//                   </View>
//                 </View>
//                 <View style={styles.clusterDetails}>
//                   <View style={styles.detailItem}>
//                     <Text style={styles.detailLabel}>Avg Budget:</Text>
//                     <Text style={styles.detailValue}>₱{cluster.demographics.avgBudget.toLocaleString()}</Text>
//                   </View>
//                 </View>
//                 <View style={styles.exploreButton}>
//                   <Text style={styles.exploreButtonText}>View Community →</Text>
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         ) : (
//           <View style={styles.postsContainer}>
//             <Text style={styles.sectionSubtitle}>
//               Real strategies from community members
//             </Text>

//             {/* Debug Info */}
//             <View style={styles.debugContainer}>
//               <Text style={styles.debugText}>
//                 Debug: {clusterPosts.length} posts | Cluster: {selectedCluster} | Loading: {loading.toString()}
//               </Text>
//             </View>

//             <PostsList posts={clusterPosts} loading={loading} />
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#f8fafc',
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   postsContainer: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8fafc',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#6b7280',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 16,
//     marginTop: 70,
//   },
//   backButton: {
//     padding: 8,
//     marginLeft: -8,
//   },
//   backButtonText: {
//     fontSize: 24,
//     color: '#1e40af',
//     fontWeight: 'bold',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1e40af',
//     textAlign: 'center',
//     flex: 1,
//   },
//   headerRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 15,
//   },
//   userName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#374151',
//     textTransform: 'capitalize',
//   },
//   logoutIconContainer: {
//     padding: 8,
//   },
//   logoutIcon: {
//     width: 30,
//     height: 30,
//     borderColor: '#000000',
//     borderWidth: 1,
//     borderRadius: 50
//   },
//   headerSpacer: {
//     width: 40,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginBottom: 8,
//     marginTop: 10,
//   },
//   sectionSubtitle: {
//     fontSize: 16,
//     color: '#6b7280',
//     marginBottom: 25,
//     lineHeight: 22,
//   },
//   clusterCard: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 5,
//     borderLeftWidth: 4,
//     borderLeftColor: '#1e40af',
//   },
//   clusterHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   clusterName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1f2937',
//   },
//   memberBadge: {
//     backgroundColor: '#dbeafe',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   memberBadgeText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1e40af',
//   },
//   clusterDetails: {
//     marginBottom: 16,
//   },
//   detailItem: {
//     flexDirection: 'row',
//     marginBottom: 6,
//   },
//   detailLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#4b5563',
//     marginRight: 6,
//   },
//   detailValue: {
//     fontSize: 14,
//     color: '#6b7280',
//   },
//   exploreButton: {
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#f3f4f6',
//   },
//   exploreButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1e40af',
//   },
//   debugContainer: {
//     backgroundColor: '#fef3c7',
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   debugText: {
//     fontSize: 12,
//     color: '#92400e',
//     textAlign: 'center',
//   },
// });