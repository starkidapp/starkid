import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';

export default function TermsAndConditionsScreen() {
    const handleEmailPress = async () => {
        const email = 'starkid.app@gmail.com';
        const subject = encodeURIComponent('Legal Inquiry');
        const mailtoUrl = `mailto:${email}?subject=${subject}`;

        try {
            const supported = await Linking.canOpenURL(mailtoUrl);
            if (supported) {
                await Linking.openURL(mailtoUrl);
            } else {
                Alert.alert('Error', 'No email client found on this device.');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not open email client.');
        }
    };

    // Safe handler to open WhatsApp using the official clean number format
    const handleWhatsAppPress = async () => {
        const whatsappUrl = 'https://wa.me/971561326221';

        try {
            const supported = await Linking.canOpenURL(whatsappUrl);
            if (supported) {
                await Linking.openURL(whatsappUrl);
            } else {
                Alert.alert('Error', 'WhatsApp is not installed on this device.');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not open WhatsApp.');
        }
    };
    return (
        <SafeAreaView style={styles.screen}>
            <ScreenHeader title="Terms & Conditions" showBackButton />
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}
                <View style={styles.headerCard}>
                    <Text style={styles.headerEmoji}>📜</Text>
                    <Text style={styles.headerTitle}>Terms & Conditions</Text>
                    <Text style={styles.headerSubtitle}>
                        Last updated: June 2026
                    </Text>
                </View>

                {/* CONTENT */}
                <View style={styles.contentCard}>
                    <Text style={styles.sectionTitle}>1. User Agreement</Text>
                    <Text style={styles.contentText}>
                        By using Star Kid, you agree to these terms and conditions. If you do not agree, please do not use our application.
                    </Text>

                    <Text style={styles.sectionTitle}>2. Age Requirements</Text>
                    <Text style={styles.contentText}>
                        Star Kid is designed for children with parental supervision. Parents are responsible for ensuring their children's usage complies with these terms.
                    </Text>

                    <Text style={styles.sectionTitle}>3. User Accounts</Text>
                    <Text style={styles.contentText}>
                        You are responsible for maintaining the confidentiality of your account credentials. Parents must ensure their PIN/password is kept secure.
                    </Text>

                    <Text style={styles.sectionTitle}>4. Prohibited Activities</Text>
                    <Text style={styles.contentText}>
                        • Unauthorized access or hacking{'\n'}
                        • Sending harmful or abusive content{'\n'}
                        • Attempting to circumvent parental controls{'\n'}
                        • Reverse engineering or copying our app
                    </Text>

                    <Text style={styles.sectionTitle}>5. Intellectual Property</Text>
                    <Text style={styles.contentText}>
                        All content, features, and functionality of Star Kid are owned by us, licensed by our licensors, or otherwise used by permission.
                    </Text>

                    <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
                    <Text style={styles.contentText}>
                        Star Kid is provided "as is" without warranties. We are not liable for indirect, incidental, or consequential damages arising from your use of the app.
                    </Text>

                    <Text style={styles.sectionTitle}>7. Termination</Text>
                    <Text style={styles.contentText}>
                        We reserve the right to terminate accounts that violate these terms or engage in prohibited activities.
                    </Text>

                    <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
                    <Text style={styles.contentText}>
                        We may update these terms periodically. Continued use of Star Kid means you accept the updated terms.
                    </Text>

                    <Text style={styles.sectionTitle}>9. Governing Law</Text>
                    <Text style={styles.contentText}>
                        These terms are governed by applicable local and international laws.
                    </Text>

                    <Text style={styles.sectionTitle}>10. Contact Us</Text>
                    <Text style={styles.contentText}>
                        For questions about these terms, please contact us at:

                    </Text>
                    <View style={styles.contactContainer}>
                        <TouchableOpacity
                            style={styles.contactButton}
                            onPress={handleEmailPress}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.contactIcon}>📧</Text>
                            <Text style={styles.contactLinkText}>starkid.app@gmail.com</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.contactButton}
                            onPress={handleWhatsAppPress}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.contactIcon}>💬</Text>
                            <Text style={styles.contactLinkText}>Chat via WhatsApp</Text>
                        </TouchableOpacity>
                    </View>
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
        backgroundColor: '#4CAF50',
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#4CAF50',
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
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.85)',
        textAlign: 'center',
        fontWeight: '500',
    },

    // CONTENT CARD
    contentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 18,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D2A32',
        marginTop: 16,
        marginBottom: 10,
    },

    contentText: {
        fontSize: 13,
        color: '#555',
        lineHeight: 20,
        fontWeight: '400',
    },
    contactContainer: {
        marginTop: 14,
        gap: 10,
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50', // Soft purple background to complement header theme
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    contactIcon: {
        fontSize: 18,
        marginRight: 12,
    },
    contactLinkText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFF', // Matches the header purple base accent
    },
});
