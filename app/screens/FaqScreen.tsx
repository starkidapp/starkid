import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';

export default function FaqScreen() {
    const faqItems = [
        {
            id: 1,
            question: '🎯 How do I earn stars?',
            answer: 'Stars are earned by completing tasks and activities set by your parent. Each completed task gives you a certain number of stars based on its difficulty.',
        },
        {
            id: 2,
            question: '🏆 What can I redeem my stars for?',
            answer: 'You can redeem your stars for rewards set up by your parent. These could be screen time, treats, privileges, or other special rewards.',
        },
        {
            id: 3,
            question: '👨‍👩‍👧 How does the parent dashboard work?',
            answer: 'Parents can create tasks, set rewards, view progress, and manage their child\'s activities all in one place. The dashboard is password-protected for security.',
        },
        {
            id: 4,
            question: '📊 Can I see my progress?',
            answer: 'Yes! You can view your monthly stars, completed tasks, and leaderboard standings in the home and explore sections.',
        },
        {
            id: 5,
            question: '🔒 Is my information safe?',
            answer: 'We take privacy seriously. All your information is encrypted and secured. Please review our Privacy Policy for more details.',
        },
        {
            id: 6,
            question: '📱 What devices can I use?',
            answer: 'Star Kid is available on iOS and Android devices. You can sync your account across multiple devices.',
        },
        {
            id: 7,
            question: '🆘 I forgot my PIN. What do I do?',
            answer: 'You can reset your PIN using the "Forgot PIN" option on the login screen. A password reset will be sent to your email.',
        },
        {
            id: 8,
            question: '💔 How do I delete my account?',
            answer: 'Contact our support team to request account deletion. We\'ll guide you through the process.',
        },
    ];

    const [expandedId, setExpandedId] = useState<number | null>(null);

    return (
        <SafeAreaView style={styles.screen}>
            <ScreenHeader title="FAQ & Help" showBackButton />
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}
                <View style={styles.headerCard}>
                    <Text style={styles.headerEmoji}>❓</Text>
                    <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
                    <Text style={styles.headerSubtitle}>
                        Find quick answers to your questions
                    </Text>
                </View>

                {/* FAQ ITEMS */}
                <View style={styles.faqContainer}>
                    {faqItems.map((item) => (
                        <View key={item.id} style={styles.faqItem}>
                            <TouchableOpacity
                                style={styles.questionButton}
                                activeOpacity={0.7}
                                onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
                            >
                                <Text style={styles.question}>{item.question}</Text>
                                <Text style={styles.chevron}>
                                    {expandedId === item.id ? '▼' : '▶'}
                                </Text>
                            </TouchableOpacity>

                            {expandedId === item.id && (
                                <View style={styles.answerContainer}>
                                    <Text style={styles.answer}>{item.answer}</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                {/* HELP SECTION */}
                <View style={styles.helpCard}>
                    <Text style={styles.helpTitle}>🆘 Still Need Help?</Text>
                    <Text style={styles.helpText}>
                        If you couldn't find the answer you're looking for, don't hesitate to contact our support team. We're always happy to help!
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
        backgroundColor: '#FF9800',
        borderRadius: 24,
        padding: 24,
        marginBottom: 28,
        alignItems: 'center',
        shadowColor: '#FF9800',
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

    // FAQ CONTAINER
    faqContainer: {
        marginBottom: 20,
    },
    faqItem: {
        marginBottom: 12,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    questionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#FFF8E1',
        borderLeftWidth: 4,
        borderLeftColor: '#FF9800',
    },
    question: {
        fontSize: 15,
        fontWeight: '700',
        color: '#2D2A32',
        flex: 1,
        marginRight: 12,
    },
    chevron: {
        fontSize: 12,
        color: '#FF9800',
        fontWeight: '600',
    },

    answerContainer: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#FFFBF0',
        borderTopWidth: 1,
        borderTopColor: '#FFE0B2',
    },
    answer: {
        fontSize: 13,
        color: '#555',
        lineHeight: 20,
        fontWeight: '400',
    },

    // HELP CARD
    helpCard: {
        backgroundColor: '#E8F5E9',
        borderRadius: 18,
        padding: 18,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    helpTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D2A32',
        marginBottom: 10,
    },
    helpText: {
        fontSize: 13,
        color: '#555',
        lineHeight: 20,
    },
});
