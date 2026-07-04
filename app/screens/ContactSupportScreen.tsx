import { router } from 'expo-router';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';

export default function ContactSupportScreen() {
    const handleEmail = () => {
        Linking.openURL('mailto:starkid.app@gmail.com').catch(() => {
            Alert.alert('Error', 'Could not open email client');
        });
    };

    const handlePhone = () => {
        Linking.openURL('tel:+1234567890').catch(() => {
            Alert.alert('Error', 'Could not open phone');
        });
    };

    const handleWhatsApp = () => {
        Linking.openURL('https://wa.me/971561326221').catch(() => {
            Alert.alert('Error', 'Could not open WhatsApp');
        });
    };

    return (
        <SafeAreaView style={styles.screen}>
            <ScreenHeader title="Contact Support" showBackButton />
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}
                <View style={styles.headerCard}>
                    <Text style={styles.headerEmoji}>📞</Text>
                    <Text style={styles.headerTitle}>Get in Touch</Text>
                    <Text style={styles.headerSubtitle}>
                        We're here to help! Choose your preferred way to reach us.
                    </Text>
                </View>

                {/* CONTACT OPTIONS */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Quick Contact</Text>

                    <TouchableOpacity
                        style={[styles.contactCard, styles.emailCard]}
                        onPress={handleEmail}
                        activeOpacity={0.8}
                    >
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>📧</Text>
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactTitle}>Email Us</Text>
                            <Text style={styles.contactSubtitle}>starkid.app@gmail.com</Text>
                            <Text style={styles.contactHint}>Tap to send an email</Text>
                        </View>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                        style={[styles.contactCard, styles.phoneCard]}
                        onPress={handlePhone}
                        activeOpacity={0.8}
                    >
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>☎️</Text>
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactTitle}>Call Us</Text>
                            <Text style={styles.contactSubtitle}>+1 (234) 567-890</Text>
                            <Text style={styles.contactHint}>Tap to call</Text>
                        </View>
                    </TouchableOpacity> */}

                    <TouchableOpacity
                        style={[styles.contactCard, styles.whatsappCard]}
                        onPress={handleWhatsApp}
                        activeOpacity={0.8}
                    >
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>💬</Text>
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactTitle}>WhatsApp</Text>
                            <Text style={styles.contactSubtitle}>Chat with us instantly</Text>
                            <Text style={styles.contactHint}>Tap to open WhatsApp</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* SUPPORT HOURS */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>⏰ Support Hours</Text>
                    <View style={styles.hoursGrid}>
                        <View style={styles.hourRow}>
                            <Text style={styles.dayText}>Monday - Friday</Text>
                            <Text style={styles.timeText}>9:00 AM - 6:00 PM</Text>
                        </View>
                        <View style={styles.hourRow}>
                            <Text style={styles.dayText}>Saturday</Text>
                            <Text style={styles.timeText}>10:00 AM - 4:00 PM</Text>
                        </View>
                        <View style={styles.hourRow}>
                            <Text style={styles.dayText}>Sunday</Text>
                            <Text style={styles.timeText}>Closed</Text>
                        </View>
                    </View>
                </View>

                {/* FAQ PREVIEW */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>❓ Frequently Asked Questions</Text>
                    <Text style={styles.infoText}>
                        Before reaching out, check our FAQ section to find quick answers to common questions.
                    </Text>
                    <TouchableOpacity
                        style={styles.faqButton}
                        onPress={() => router.push('/screens/FaqScreen')}
                    >
                        <Text style={styles.faqButtonText}>View FAQ</Text>
                    </TouchableOpacity>
                </View>

                {/* RESPONSE TIME */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>⚡ Response Time</Text>
                    <Text style={styles.infoText}>
                        We aim to respond to all inquiries within 24 hours during business days. Thank you for your patience!
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
        backgroundColor: '#FF6B6B',
        borderRadius: 24,
        padding: 24,
        marginBottom: 28,
        alignItems: 'center',
        shadowColor: '#FF6B6B',
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

    // SECTION
    sectionContainer: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D2A32',
        marginBottom: 12,
    },

    // CONTACT CARD
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 18,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    emailCard: {
        backgroundColor: '#E3F2FD',
        borderLeftWidth: 4,
        borderLeftColor: '#2196F3',
    },
    phoneCard: {
        backgroundColor: '#F3E5F5',
        borderLeftWidth: 4,
        borderLeftColor: '#9C27B0',
    },
    whatsappCard: {
        backgroundColor: '#E8F5E9',
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },

    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    icon: {
        fontSize: 32,
    },

    contactInfo: {
        flex: 1,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D2A32',
        marginBottom: 4,
    },
    contactSubtitle: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
        marginBottom: 4,
    },
    contactHint: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    },

    // INFO CARD
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: '#6C63FF',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D2A32',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },

    // HOURS GRID
    hoursGrid: {
        gap: 10,
    },
    hourRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    dayText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    timeText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6C63FF',
    },

    // FAQ BUTTON
    faqButton: {
        backgroundColor: '#6C63FF',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    faqButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
});
