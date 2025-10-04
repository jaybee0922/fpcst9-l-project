import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Add this interface for TypeScript
interface User {
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

  // Load user data when component mounts
  useEffect(() => {
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    try {
      // For demo purposes, we'll always show registration
      // In a real app, you'd check AsyncStorage or backend for existing user
      console.log('Checking for existing user...');
      // Always show registration for now
    } catch (error) {
      console.log('No existing user found, showing registration');
    }
  };

  const navigateToRegister = () => {
    router.push('/register');
  };

  const navigateToExplore = () => {
    router.push('/(tabs)/explore');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Money Cluster</Text>
      <Text style={styles.subtitle}>Filipino Community Money Wisdom</Text>

      {/* Show this if user is NOT registered */}
      {!user && (
        <View style={styles.registrationSection}>
          <Text style={styles.welcomeText}>Welcome to Money Cluster! 🇵🇭</Text>
          <Text style={styles.description}>
            Join our community of Filipinos sharing proven money-saving strategies specific to your location and situation.
          </Text>

          <TouchableOpacity style={styles.primaryButton} onPress={navigateToRegister}>
            <Text style={styles.primaryButtonText}>Create Your Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={navigateToExplore}>
            <Text style={styles.secondaryButtonText}>Explore Community First</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Show this if user IS registered */}
      {user && (
        <View style={styles.userCard}>
          <Text style={styles.cardTitle}>Welcome back!</Text>
          <Text>Budget: ₱{user.budget}</Text>
          <Text>Location: {user.location.city}, {user.location.region}</Text>
          <Text>Situation: {user.demographics.situation}</Text>

          <TouchableOpacity style={styles.actionButton}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
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
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e40af',
  },
  actionButton: {
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
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