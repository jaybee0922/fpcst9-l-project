import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { authHelper, postsAPI } from '../services/api';

export default function CreatePostScreen() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        budget: '',
        durationDays: '',
        region: '',
        userType: '',
        householdSize: '',
        strategies: [] as string[]
    });
    const [loading, setLoading] = useState(false);
    const [userFullName, setUserFullName] = useState('');

    const strategies = ['carenderia', 'jeepney', 'palengke', 'walking', 'cooking', 'bulk_buying', 'other'];
    const userTypes = ['student', 'father', 'family', 'worker', 'other'];

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userData = await authHelper.getUserData();
            if (userData && userData.fullName) {
                const capitalizedName = userData.fullName
                    .split(' ')
                    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');
                setUserFullName(capitalizedName);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await authHelper.removeToken();
            await authHelper.removeUserData();
            router.replace('/Welcome');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleCreatePost = async () => {
        try {
            setLoading(true);

            const userData = await authHelper.getUserData();

            if (!userData) {
                Alert.alert('Error', 'Please login first');
                router.back();
                return;
            }

            const postData = {
                anonymousAuthorId: userData.anonymousId || 'User #1',
                clusterId: userData.clusterId || 'ncr_students',
                title: formData.title,
                content: formData.content,
                budget: parseInt(formData.budget) || 0,
                durationDays: parseInt(formData.durationDays) || 0,
                region: formData.region,
                userType: formData.userType,
                householdSize: parseInt(formData.householdSize) || 0,
                strategies: formData.strategies,
                location: userData.location || { region: 'NCR', city: 'Manila' }
            };

            console.log("Creating post with data:", postData);

            const response = await postsAPI.createPost(postData);

            Alert.alert('Success', 'Strategy shared successfully!', [
                {
                    text: 'View Posts',
                    onPress: () => {
                        router.push({
                            pathname: '/(tabs)/explore',
                            params: { refresh: Date.now() }
                        });
                    }
                },
                {
                    text: 'Share Another',
                    onPress: () => {
                        // Reset form for another post
                        setFormData({
                            title: '',
                            content: '',
                            budget: '',
                            durationDays: '',
                            region: '',
                            userType: '',
                            householdSize: '',
                            strategies: []
                        });
                    }
                }
            ]);

        } catch (error: any) {
            console.error('Create post error:', error);

            if (error.response?.data?.error) {
                Alert.alert('Error', error.response.data.error);
            } else {
                Alert.alert('Error', 'Failed to share strategy. Please try again.');
            }
        } finally {
            setLoading(false);
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

    const selectUserType = (type: string) => {
        setFormData(prev => ({
            ...prev,
            userType: prev.userType === type ? '' : type
        }));
    };

    return (
        <View style={styles.fullScreen}>
            {/* Header with User Fullname and Exit Icon */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Share Strategy</Text>
                <View style={styles.headerRight}>
                    {userFullName ? (
                        <Text style={styles.userName}>{userFullName}</Text>
                    ) : null}
                    <TouchableOpacity style={styles.logoutIconContainer} onPress={handleLogout}>
                        <Image
                            source={require('../assets/images/exit.png')}
                            style={styles.logoutIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.container}>
                <Text style={styles.title}>Share Your Strategy</Text>

                <Text style={styles.label}>Title *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., My Carenderia Meal Plan"
                    value={formData.title}
                    onChangeText={(text) => setFormData({ ...formData, title: text })}
                />

                <Text style={styles.label}>Your Story & Tips *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Share how you save money, specific tips, locations, and how long your budget lasts..."
                    value={formData.content}
                    onChangeText={(text) => setFormData({ ...formData, content: text })}
                    multiline
                    numberOfLines={6}
                />

                <Text style={styles.label}>Budget (₱) *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="3000"
                    keyboardType="numeric"
                    value={formData.budget}
                    onChangeText={(text) => setFormData({ ...formData, budget: text })}
                />

                <Text style={styles.label}>How many days did it last? *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="14"
                    keyboardType="numeric"
                    value={formData.durationDays}
                    onChangeText={(text) => setFormData({ ...formData, durationDays: text })}
                />

                <Text style={styles.label}>What region are you from? *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., NCR, Province"
                    value={formData.region}
                    onChangeText={(text) => setFormData({ ...formData, region: text })}
                />

                <Text style={styles.label}>What kind of person are you? *</Text>
                <View style={styles.userTypesContainer}>
                    {userTypes.map(type => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.userTypeOption,
                                formData.userType === type && styles.selectedUserType
                            ]}
                            onPress={() => selectUserType(type)}
                        >
                            <Text style={formData.userType === type ? styles.selectedUserTypeText : styles.userTypeText}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>How many of you? (Household size) *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., 4"
                    keyboardType="numeric"
                    value={formData.householdSize}
                    onChangeText={(text) => setFormData({ ...formData, householdSize: text })}
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
                                {strategy.replace('_', ' ')}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.createButton, loading && styles.disabledButton]}
                    onPress={handleCreatePost}
                    disabled={loading}
                >
                    <Text style={styles.createButtonText}>
                        {loading ? 'Sharing...' : 'Share with Community'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        textTransform: 'capitalize',
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
    },
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
        marginTop: 20
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
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    userTypesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
    },
    userTypeOption: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    selectedUserType: {
        backgroundColor: '#1e40af',
        borderColor: '#1e40af',
    },
    userTypeText: {
        color: '#374151',
        fontSize: 14,
    },
    selectedUserTypeText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
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
    disabledButton: {
        backgroundColor: '#9ca3af',
    },
    createButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});