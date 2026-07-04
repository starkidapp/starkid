import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';

export default function LicensesScreen() {
    const libraries = [
        {
            name: 'React Native',
            license: 'MIT',
            description: 'A JavaScript library for building user interfaces with native components.',
        },
        {
            name: 'Expo',
            license: 'MIT',
            description: 'An open-source platform for making universal native apps with JavaScript and React.',
        },
        {
            name: 'Firebase',
            license: 'Apache 2.0',
            description: 'A comprehensive platform for building web and mobile apps.',
        },
        {
            name: 'Expo Router',
            license: 'MIT',
            description: 'File-based routing for Expo applications.',
        },
        {
            name: 'React Navigation',
            license: 'MIT',
            description: 'Routing and navigation for React Native apps.',
        },
        {
            name: 'Expo Splash Screen',
            license: 'MIT',
            description: 'A library for controlling the native splash screen.',
        },
    ];

    return (
        <SafeAreaView style={styles.screen}>
            <ScreenHeader title="Open Source Licenses" showBackButton />
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}
                <View style={styles.headerCard}>
                    <Text style={styles.headerEmoji}>⚖️</Text>
                    <Text style={styles.headerTitle}>Open Source Licenses</Text>
                    <Text style={styles.headerSubtitle}>
                        Third-party libraries we use
                    </Text>
                </View>

                {/* INTRO */}
                <View style={styles.introCard}>
                    <Text style={styles.introText}>
                        Star Kid is built using amazing open-source libraries. We're grateful for the developers who maintain these projects and make them available to the community.
                    </Text>
                </View>

                {/* LIBRARIES */}
                <View style={styles.librariesContainer}>
                    {libraries.map((lib, index) => (
                        <View key={index} style={styles.libraryCard}>
                            <View style={styles.libraryHeader}>
                                <Text style={styles.libraryName}>{lib.name}</Text>
                                <View style={styles.licenseBadge}>
                                    <Text style={styles.licenseBadgeText}>{lib.license}</Text>
                                </View>
                            </View>
                            <Text style={styles.libraryDescription}>{lib.description}</Text>
                        </View>
                    ))}
                </View>

                {/* FOOTER NOTE */}
                <View style={styles.footerCard}>
                    <Text style={styles.footerTitle}>📝 License Information</Text>
                    <Text style={styles.footerText}>
                        Each library is licensed under its respective open-source license. For detailed license information, visit the respective project repositories.
                    </Text>
                </View>

                <View style={{ height: 20 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F7FBFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#F7FBFF',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 20,
    },

    // HEADER
    headerCard: {
        backgroundColor: '#E91E63',
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#E91E63',
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 5,
    },
    headerEmoji: {
        fontSize: 56,
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.85)',
        textAlign: 'center',
        fontWeight: '500',
    },

    // INTRO
    introCard: {
        backgroundColor: '#FCE4EC',
        borderRadius: 18,
        padding: 16,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#E91E63',
    },
    introText: {
        fontSize: 13,
        color: '#555',
        lineHeight: 20,
        fontWeight: '400',
    },

    // LIBRARIES
    librariesContainer: {
        marginBottom: 20,
    },
    libraryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    libraryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    libraryName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#2D2A32',
        flex: 1,
    },
    licenseBadge: {
        backgroundColor: '#E91E63',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    licenseBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    libraryDescription: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
        fontWeight: '400',
    },

    // FOOTER
    footerCard: {
        backgroundColor: '#F3E5F5',
        borderRadius: 18,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#E91E63',
    },
    footerTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2D2A32',
        marginBottom: 10,
    },
    footerText: {
        fontSize: 12,
        color: '#555',
        lineHeight: 18,
        fontWeight: '400',
    },
});
