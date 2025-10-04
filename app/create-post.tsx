import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { postsAPI } from '../services/api';

export default function CreatePostScreen() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        budget: '',
        durationDays: '',
        strategies: [] as string[]
    });

    const strategies = ['carenderia', 'jeepney', 'palengke', 'walking', 'cooking', 'bulk_buying'];

    const handleCreatePost = async () => {
        try {
            const postData = {
                anonymousAuthorId: 'User #1', // You'll get this from user context
                clusterId: 'ncr_students', // You'll get this from user data
                title: formData.title,
                content: formData.content,
                budget: parseInt(formData.budget),
                durationDays: parseInt(formData.durationDays),
                strategies: formData.strategies,
                location: { region: 'NCR', city: 'Manila' } // You'll get this from user data
            };

            const response = await postsAPI.createPost(postData);
            Alert.alert('Success', 'Strategy shared successfully!');
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to share strategy');
            console.error('Create post error:', error);
        }
    };

    const toggleStrategy = (strategy: string) => {
        setFormData(prev => ({
            ...prev,
            strategies: prev.strategies.includes(strategy)
                ? prev.strategies.filter(s => s !== strategy)
                : [...prev.strategies, strategy]
        }));
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Share Your Strategy</Text>

            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g., My Carenderia Meal Plan"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
            />

            <Text style={styles.label}>Your Story & Tips</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Share how you save money, specific tips, locations, and how long your budget lasts..."
                value={formData.content}
                onChangeText={(text) => setFormData({ ...formData, content: text })}
                multiline
                numberOfLines={6}
            />

            <Text style={styles.label}>Budget (₱)</Text>
            <TextInput
                style={styles.input}
                placeholder="3000"
                keyboardType="numeric"
                value={formData.budget}
                onChangeText={(text) => setFormData({ ...formData, budget: text })}
            />

            <Text style={styles.label}>How many days did it last?</Text>
            <TextInput
                style={styles.input}
                placeholder="14"
                keyboardType="numeric"
                value={formData.durationDays}
                onChangeText={(text) => setFormData({ ...formData, durationDays: text })}
            />

            <Text style={styles.label}>Strategies Used</Text>
            <View style={styles.strategiesContainer}>
                {strategies.map(strategy => (
                    <TouchableOpacity
                        key={strategy}
                        style={[
                            styles.strategyOption,
                            formData.strategies.includes(strategy) && styles.selectedStrategy
                        ]}
                        onPress={() => toggleStrategy(strategy)}
                    >
                        <Text style={formData.strategies.includes(strategy) ? styles.selectedStrategyText : styles.strategyText}>
                            {strategy}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.createButton} onPress={handleCreatePost}>
                <Text style={styles.createButtonText}>Share with Community</Text>
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
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    strategiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
    },
    strategyOption: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    selectedStrategy: {
        backgroundColor: '#1e40af',
        borderColor: '#1e40af',
    },
    strategyText: {
        color: '#374151',
        fontSize: 14,
    },
    selectedStrategyText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    createButton: {
        backgroundColor: '#1e40af',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 50,
    },
    createButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});