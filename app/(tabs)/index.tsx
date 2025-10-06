import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { authHelper } from '../../services/api';

interface User {
  fullName: string;
  budget: number;
  location: {
    city: string;
    region: string;
  };
  demographics: {
    situation: string;
    familySize: number;
  };
  spendingPriorities: string[];
  strategies: string[];
}

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userCluster, setUserCluster] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    try {
      setLoading(true);
      const token = await authHelper.getToken();
      if (!token) {
        console.log('No token found, showing unregistered UI');
        setUser(null);
      } else {
        const userData = await authHelper.getUserData();
        if (userData) {
          setUser(userData as User);
          console.log('User found:', userData);
        } else {
          console.log('Token exists but no user data, logging out');
          await authHelper.removeToken();
          await authHelper.removeUserData();
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authHelper.removeToken();
      await authHelper.removeUserData();
      setUser(null);
      router.replace('/Welcome');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigateToRegister = () => {
    router.push('/register');
  };

  const navigateToExplore = () => {
    router.push('/(tabs)/explore');
  };
  // NEW: Navigate to create post
  const navigateToCreatePost = () => {
    router.push('/create-post');




  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.fullScreen}>
      {/* Header with Logout Icon (only for logged-in users) */}
      {user && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Money Cluster</Text>
          <TouchableOpacity style={styles.logoutIconContainer} onPress={handleLogout}>
            <Image source={require('../../assets/images/exit.png')} style={styles.logoutIcon} />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {!user && (
          <Text style={styles.subtitle}>Filipino Community Money Wisdom</Text>
        )}

        {/* Show this if user is NOT registered */}
        {!user && (
          <View style={styles.registrationSection}>
            <Text style={styles.welcomeText}>Welcome to Money Cluster! 🇵🇭</Text>
            <Text style={styles.description}>
              Join our community of Filipinos sharing proven money-saving strategies specific to your location and situation.
            </Text>

            <TouchableOpacity style={styles.primaryButton} onPress={navigateToCreatePost}>
              <Text style={styles.primaryButtonText}>Share your tips</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={navigateToExplore}>
              <Text style={styles.secondaryButtonText}>Explore Community First</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Show this if user IS registered */}
        {user && (
          <View style={styles.userCard}>
            <Text style={styles.cardTitle}>Welcome, {user.fullName}!</Text>
            {/* <Text>Budget: ₱{user.budget}</Text>
            <Text>Location: {user.location.city}, {user.location.region}</Text>
            <Text>Situation: {user.demographics.situation}</Text> */}

            <TouchableOpacity style={styles.actionButton} onPress={navigateToCreatePost}>
              <Text style={styles.actionButtonText}>Share Your Strategy</Text>
            </TouchableOpacity>

          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>Share your money-saving strategies</Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>Get matched with similar Filipinos</Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>Discover proven tips from your cluster</Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepText}>Rate and help others save money</Text>
          </View>
        </View>

        {/* Quick Stats Preview */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Community Impact</Text>
          <View style={styles.statsGrid}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>47+</Text>
              <Text style={styles.statLabel}>Users</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Cities</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>89%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    // marginTop: 50
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 50
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
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
    // tintColor: '#ef4444',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  container: {
    padding: 20,
    marginTop: 0, // Adjusted since header handles top
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    color: '#1e40af',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#6b7280',
  },
  registrationSection: {
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
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1e40af',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
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
  },
  secondaryButtonText: {
    color: '#1e40af',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userCard: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 20
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e40af',
    textTransform: 'capitalize',
  },
  actionButton: {
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e40af',
    textAlign: 'center',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
  },
  stepNumber: {
    backgroundColor: '#1e40af',
    color: 'white',
    width: 30,
    height: 30,
    borderRadius: 15,
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: 'bold',
    marginRight: 15,
  },
  stepText: {
    fontSize: 16,
    flex: 1,
    color: '#4b5563',
  },
  statsSection: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    marginBottom: 25,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
});