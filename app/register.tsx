import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { userAPI } from '../services/api';

export default function RegisterScreen() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        budget: '',
        location: { region: 'NCR', city: '' },
        demographics: { situation: 'student', familySize: '1' },
        spendingPriorities: [],
        strategies: []
    });

    const regions = ['NCR', 'Region I', 'Region II', 'Region III', 'Region IV-A', 'Region IV-B', 'Region V',
        'Region VI', 'Region VII', 'Region VIII', 'Region IX', 'Region X', 'Region XI', 'Region XII',
        'CAR', 'ARMM'];

    const situations = ['student', 'professional', 'family', 'senior', 'other'];
    const priorities = ['food', 'transport', 'school', 'savings', 'leisure'];
    const strategies = ['carenderia', 'jeepney', 'palengke', 'walking', 'cooking', 'bulk_buying'];

    const handleRegister = async () => {
        try {
            const userData = {
                ...formData,
                budget: parseInt(formData.budget),
                demographics: {
                    ...formData.demographics,
                    familySize: parseInt(formData.demographics.familySize)
                }
            };

            const response = await userAPI.register(userData);

            Alert.alert('Success', 'Profile created successfully!', [
                {
                    text: 'View Your Cluster',
                    onPress: () => router.push('/cluster-dashboard')
                }
            ]);

        } catch (error: any) {
            console.error('Registration error:', error);

            if (error.code === 'NETWORK_ERROR') {
                Alert.alert('Network Error', 'Cannot connect to server. Make sure backend is running.');
            } else {
                Alert.alert('Error', 'Failed to create profile. Please try again.');
            }
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Create Your Profile</Text>

            <Text style={styles.label}>Monthly Budget (₱)</Text>
            <TextInput
                style={styles.input}
                placeholder="3000"
                keyboardType="numeric"
                value={formData.budget}
                onChangeText={(text) => setFormData({ ...formData, budget: text })}
            />

            <Text style={styles.label}>Region</Text>
            <View style={styles.optionContainer}>
                {regions.map(region => (
                    <TouchableOpacity
                        key={region}
                        style={[
                            styles.option,
                            formData.location.region === region && styles.selectedOption
                        ]}
                        onPress={() => setFormData({
                            ...formData,
                            location: { ...formData.location, region }
                        })}
                    >
                        <Text style={formData.location.region === region ? styles.selectedOptionText : styles.optionText}>
                            {region}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>City</Text>
            <TextInput
                style={styles.input}
                placeholder="Manila, Cebu, Davao, etc."
                value={formData.location.city}
                onChangeText={(text) => setFormData({
                    ...formData,
                    location: { ...formData.location, city: text }
                })}
            />

            <Text style={styles.label}>Your Situation</Text>
            <View style={styles.optionContainer}>
                {situations.map(situation => (
                    <TouchableOpacity
                        key={situation}
                        style={[
                            styles.option,
                            formData.demographics.situation === situation && styles.selectedOption
                        ]}
                        onPress={() => setFormData({
                            ...formData,
                            demographics: { ...formData.demographics, situation }
                        })}
                    >
                        <Text style={formData.demographics.situation === situation ? styles.selectedOptionText : styles.optionText}>
                            {situation}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Family Size</Text>
            <TextInput
                style={styles.input}
                placeholder="1"
                keyboardType="numeric"
                value={formData.demographics.familySize}
                onChangeText={(text) => setFormData({
                    ...formData,
                    demographics: { ...formData.demographics, familySize: text }
                })}
            />

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Create Profile</Text>
            </TouchableOpacity>
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
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#1e40af',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#d1d5db',
        fontSize: 16,
    },
    optionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    option: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    selectedOption: {
        backgroundColor: '#1e40af',
        borderColor: '#1e40af',
    },
    optionText: {
        color: '#374151',
        fontSize: 14,
    },
    selectedOptionText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    registerButton: {
        backgroundColor: '#1e40af',
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 50,
    },
    registerButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});