import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { authHelper, userAPI } from '../services/api';

export default function RegisterScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    // Countdown timer for auto-redirect
    useEffect(() => {
        if (success && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (success && countdown === 0) {
            router.replace('/Welcome');
        }
    }, [success, countdown]);

    const validateForm = () => {
        if (!formData.email || !formData.password || !formData.confirmPassword) {
            Alert.alert('Error', 'Please fill in all required fields');
            return false;
        }

        if (!formData.email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return false;
        }

        if (formData.password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const userData = {
                email: formData.email,
                password: formData.password,
                // No profile data - user will add it later
            };

            console.log("Sending registration data:", userData);

            const response = await userAPI.register(userData);

            // Store token and user data
            await authHelper.storeToken(response.data.token);
            await authHelper.storeUserData(response.data);

            // Show success state and start countdown
            setSuccess(true);
            setCountdown(3);

        } catch (error: any) {
            console.error('Registration error:', error);

            if (error.response?.data?.error) {
                Alert.alert('Registration Failed', error.response.data.error);
            } else if (error.code === 'NETWORK_ERROR') {
                Alert.alert('Network Error', 'Cannot connect to server. Make sure backend is running.');
            } else {
                Alert.alert('Error', 'Failed to create account. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Show success screen with countdown
    if (success) {
        return (
            <View style={styles.successContainer}>
                <View style={styles.successContent}>
                    <View style={styles.successIcon}>
                        <Text style={styles.successIconText}>✓</Text>
                    </View>
                    <Text style={styles.successTitle}>Account Created Successfully!</Text>
                    <Text style={styles.successMessage}>
                        Welcome to Money Cluster! Redirecting you to the app...
                    </Text>

                    <View style={styles.countdownContainer}>
                        <ActivityIndicator size="large" color="#1e40af" style={styles.spinner} />
                        <Text style={styles.countdownText}>
                            Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={() => router.replace('/(tabs)')}
                    >
                        <Text style={styles.continueButtonText}>Continue Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Normal registration form
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Create Your Account</Text>

            <Text style={styles.subtitle}>
                Join our community of Filipinos sharing money-saving strategies
            </Text>

            {/* Email Field */}
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
            />

            {/* Password Field */}
            <Text style={styles.label}>Password *</Text>
            <TextInput
                style={styles.input}
                placeholder="At least 6 characters"
                secureTextEntry
                autoComplete="password"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
            />

            {/* Confirm Password Field */}
            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                secureTextEntry
                autoComplete="password"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            />

            <TouchableOpacity
                style={[styles.registerButton, loading && styles.disabledButton]}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.registerButtonText}>Create Account</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.loginLink}
                onPress={() => router.back()}
            >
                <Text style={styles.loginLinkText}>
                    Already have an account? <Text style={styles.loginLinkBold}>Login</Text>
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        marginTop: 100,  
    },
    successContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    successContent: {
        backgroundColor: 'white',
        padding: 40,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        width: '100%',
        maxWidth: 400,
    },
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    successIconText: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: '#1e40af',
    },
    successMessage: {
        fontSize: 16,
        textAlign: 'center',
        color: '#6b7280',
        lineHeight: 22,
        marginBottom: 30,
    },
    countdownContainer: {
        alignItems: 'center',
        marginBottom: 25,
    },
    spinner: {
        marginBottom: 15,
    },
    countdownText: {
        fontSize: 16,
        color: '#1e40af',
        fontWeight: '600',
    },
    continueButton: {
        backgroundColor: '#1e40af',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    continueButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
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
        lineHeight: 22,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 16,
        color: '#374151',
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#d1d5db',
        fontSize: 16,
        marginBottom: 5,
    },
    registerButton: {
        backgroundColor: '#1e40af',
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    disabledButton: {
        backgroundColor: '#9ca3af',
    },
    registerButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginLink: {
        alignItems: 'center',
        marginBottom: 30,
    },
    loginLinkText: {
        fontSize: 16,
        color: '#6b7280',
    },
    loginLinkBold: {
        fontWeight: 'bold',
        color: '#1e40af',
    },
});