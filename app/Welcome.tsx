import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { authHelper, userAPI } from '../services/api';

export default function WelcomeScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            // Simple validation
            if (!email || !password) {
                Alert.alert('Error', 'Please enter both email and password');
                return;
            }

            if (!email.includes('@')) {
                Alert.alert('Error', 'Please enter a valid email address');
                return;
            }

            setLoading(true);

            // Call login API
            const response = await userAPI.login({ email, password });

            // Store token and user data
            await authHelper.storeToken(response.data.token);
            await authHelper.storeUserData(response.data);

            Alert.alert('Success', 'Login successful!');

            // Navigate to main app
            router.replace('/(tabs)');
        } catch (error: any) {
            console.error('Login error:', error);

            if (error.response?.data?.error) {
                Alert.alert('Login Failed', error.response.data.error);
            } else if (error.code === 'NETWORK_ERROR') {
                Alert.alert('Network Error', 'Cannot connect to server. Make sure backend is running.');
            } else {
                Alert.alert('Login Failed', 'An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = () => {
        router.push('/register');
    };

    const handleExplore = () => {
        router.push('/(tabs)/explore');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Money Cluster</Text>
                    <Text style={styles.subtitle}>Filipino Community Money Wisdom</Text>
                </View>

                {/* Login Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Welcome Back!</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoComplete="password"
                    />

                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.disabledButton]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.loginButtonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.signUpButton}
                        onPress={handleSignUp}
                        disabled={loading}
                    >
                        <Text style={styles.signUpButtonText}>Create New Account</Text>
                    </TouchableOpacity>
                </View>

                {/* How It Works Section */}
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

                    {/* <TouchableOpacity
                        style={styles.exploreButton}
                        onPress={handleExplore}
                        disabled={loading}
                    >
                        <Text style={styles.exploreButtonText}>Explore Community First</Text>
                    </TouchableOpacity> */}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1e40af',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
    },
    formContainer: {
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
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#1e40af',
    },
    input: {
        backgroundColor: '#f8fafc',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 15,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: '#1e40af',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    disabledButton: {
        backgroundColor: '#9ca3af',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signUpButton: {
        backgroundColor: 'transparent',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#1e40af',
    },
    signUpButtonText: {
        color: '#1e40af',
        fontSize: 16,
        fontWeight: 'bold',
    },
    section: {
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 15,
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
    // exploreButton: {
    //     backgroundColor: '#10b981',
    //     padding: 16,
    //     borderRadius: 12,
    //     alignItems: 'center',
    //     marginTop: 10,
    // },
    // exploreButtonText: {
    //     color: 'white',
    //     fontSize: 16,
    //     fontWeight: 'bold',
    // },
});