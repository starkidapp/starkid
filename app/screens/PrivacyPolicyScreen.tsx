// import { ScrollView, StyleSheet, Text, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import ScreenHeader from '../components/ScreenHeader';

// export default function PrivacyPolicyScreen() {
//     return (
//         <SafeAreaView style={styles.screen}>
//             <ScreenHeader title="Privacy Policy" showBackButton />
//             <ScrollView
//                 style={styles.container}
//                 contentContainerStyle={styles.scrollContent}
//                 showsVerticalScrollIndicator={false}
//             >
//                 {/* HEADER */}
//                 <View style={styles.headerCard}>
//                     <Text style={styles.headerEmoji}>🔒</Text>
//                     <Text style={styles.headerTitle}>Privacy Policy</Text>
//                     <Text style={styles.headerSubtitle}>
//                         Last updated: June 2026
//                     </Text>
//                 </View>

//                 {/* CONTENT */}
//                 <View style={styles.contentCard}>
//                     <Text style={styles.sectionTitle}>1. Information We Collect</Text>
//                     <Text style={styles.contentText}>
//                         We collect information you provide directly to us, such as:
//                         {'\n'}• Account information (email, password, name)
//                         {'\n'}• Child information (name, age, PIN)
//                         {'\n'}• Task and reward data
//                         {'\n'}• Usage analytics
//                     </Text>

//                     <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
//                     <Text style={styles.contentText}>
//                         We use your information to:
//                         {'\n'}• Provide and improve our services
//                         {'\n'}• Enable parent-child communication
//                         {'\n'}• Send important notifications
//                         {'\n'}• Maintain security
//                         {'\n'}• Comply with legal obligations
//                     </Text>

//                     <Text style={styles.sectionTitle}>3. Data Security</Text>
//                     <Text style={styles.contentText}>
//                         We implement industry-standard security measures to protect your data. All sensitive information is encrypted both in transit and at rest.
//                     </Text>

//                     <Text style={styles.sectionTitle}>4. Parental Consent</Text>
//                     <Text style={styles.contentText}>
//                         Parents are responsible for obtaining appropriate consent for children under 13. By using Star Kid with a child, you represent that you have the authority to provide such consent.
//                     </Text>

//                     <Text style={styles.sectionTitle}>5. Children's Privacy</Text>
//                     <Text style={styles.contentText}>
//                         We do not knowingly collect personal information from children under 13 without verifiable parental consent. Parents can request deletion of their child's information at any time.
//                     </Text>

//                     <Text style={styles.sectionTitle}>6. Third-Party Services</Text>
//                     <Text style={styles.contentText}>
//                         We use Firebase for authentication and data storage. Firebase may collect certain information as described in their privacy policy.
//                     </Text>

//                     <Text style={styles.sectionTitle}>7. Data Retention</Text>
//                     <Text style={styles.contentText}>
//                         We retain your data for as long as your account is active. You can request deletion of your data at any time.
//                     </Text>

//                     <Text style={styles.sectionTitle}>8. Your Rights</Text>
//                     <Text style={styles.contentText}>
//                         You have the right to:
//                         {'\n'}• Access your personal data
//                         {'\n'}• Correct inaccurate data
//                         {'\n'}• Request deletion of data
//                         {'\n'}• Export your data
//                     </Text>

//                     <Text style={styles.sectionTitle}>9. Privacy Settings</Text>
//                     <Text style={styles.contentText}>
//                         Parents can manage privacy settings and control what information is shared. Check your account settings for available options.
//                     </Text>

//                     <Text style={styles.sectionTitle}>10. Contact Us</Text>
//                     <Text style={styles.contentText}>
//                         For privacy concerns, please contact us at:
//                         {'\n\n'}
//                         📧 privacy@starkid.com
//                         {'\n'}
//                         📞 +1 (234) 567-890
//                     </Text>
//                 </View>

//                 <View style={{ height: 20 }} />
//             </ScrollView>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     screen: {
//         flex: 1,
//         backgroundColor: '#F7FBFF',
//     },
//     container: {
//         flex: 1,
//         backgroundColor: '#F7FBFF',
//     },
//     scrollContent: {
//         paddingHorizontal: 16,
//         paddingTop: 12,
//         paddingBottom: 20,
//     },

//     // HEADER
//     headerCard: {
//         backgroundColor: '#9C27B0',
//         borderRadius: 24,
//         padding: 24,
//         marginBottom: 20,
//         alignItems: 'center',
//         shadowColor: '#9C27B0',
//         shadowOpacity: 0.2,
//         shadowRadius: 12,
//         elevation: 5,
//     },
//     headerEmoji: {
//         fontSize: 56,
//         marginBottom: 12,
//     },
//     headerTitle: {
//         fontSize: 28,
//         fontWeight: '600',
//         color: '#FFFFFF',
//         marginBottom: 8,
//         textAlign: 'center',
//     },
//     headerSubtitle: {
//         fontSize: 12,
//         color: 'rgba(255, 255, 255, 0.85)',
//         textAlign: 'center',
//         fontWeight: '500',
//     },

//     // CONTENT CARD
//     contentCard: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: 18,
//         padding: 18,
//         shadowColor: '#000',
//         shadowOpacity: 0.08,
//         shadowRadius: 8,
//         elevation: 2,
//     },

//     sectionTitle: {
//         fontSize: 16,
//         fontWeight: '700',
//         color: '#2D2A32',
//         marginTop: 16,
//         marginBottom: 10,
//     },

//     contentText: {
//         fontSize: 13,
//         color: '#555',
//         lineHeight: 20,
//         fontWeight: '400',
//     },
// });
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';

export default function PrivacyPolicyScreen() {

    // Safe handler to open Mail app with pre-filled subject
    const handleEmailPress = async () => {
        const email = 'starkid.app@gmail.com';
        const subject = encodeURIComponent('Privacy Policy Inquiry');
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
            <ScreenHeader title="Privacy Policy" showBackButton />
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}
                <View style={styles.headerCard}>
                    <Text style={styles.headerEmoji}>🔒</Text>
                    <Text style={styles.headerTitle}>Privacy Policy</Text>
                    <Text style={styles.headerSubtitle}>
                        Last updated: June 2026
                    </Text>
                </View>

                {/* CONTENT */}
                <View style={styles.contentCard}>
                    <Text style={styles.sectionTitle}>1. Information We Collect</Text>
                    <Text style={styles.contentText}>
                        We collect information you provide directly to us, such as:
                        {'\n'}• Account information (email, password, name)
                        {'\n'}• Child information (name, age, PIN)
                        {'\n'}• Task and reward data
                        {'\n'}• Usage analytics
                    </Text>

                    <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
                    <Text style={styles.contentText}>
                        We use your information to:
                        {'\n'}• Provide and improve our services
                        {'\n'}• Enable parent-child communication
                        {'\n'}• Send important notifications
                        {'\n'}• Maintain security
                        {'\n'}• Comply with legal obligations
                    </Text>

                    <Text style={styles.sectionTitle}>3. Data Security</Text>
                    <Text style={styles.contentText}>
                        We implement industry-standard security measures to protect your data. All sensitive information is encrypted both in transit and at rest.
                    </Text>

                    <Text style={styles.sectionTitle}>4. Parental Consent</Text>
                    <Text style={styles.contentText}>
                        Parents are responsible for obtaining appropriate consent for children under 13. By using Star Kid with a child, you represent that you have the authority to provide such consent.
                    </Text>

                    <Text style={styles.sectionTitle}>5. Children's Privacy</Text>
                    <Text style={styles.contentText}>
                        We do not knowingly collect personal information from children under 13 without verifiable parental consent. Parents can request deletion of their child's information at any time.
                    </Text>

                    <Text style={styles.sectionTitle}>6. Third-Party Services</Text>
                    <Text style={styles.contentText}>
                        We use Firebase for authentication and data storage. Firebase may collect certain information as described in their privacy policy.
                    </Text>

                    <Text style={styles.sectionTitle}>7. Data Retention</Text>
                    <Text style={styles.contentText}>
                        We retain your data for as long as your account is active. You can request deletion of your data at any time.
                    </Text>

                    <Text style={styles.sectionTitle}>8. Your Rights</Text>
                    <Text style={styles.contentText}>
                        You have the right to:
                        {'\n'}• Access your personal data
                        {'\n'}• Correct inaccurate data
                        {'\n'}• Request deletion of data
                        {'\n'}• Export your data
                    </Text>

                    <Text style={styles.sectionTitle}>9. Privacy Settings</Text>
                    <Text style={styles.contentText}>
                        Parents can manage privacy settings and control what information is shared. Check your account settings for available options.
                    </Text>

                    {/* INTERACTIVE CONTACT SECTION */}
                    <Text style={styles.sectionTitle}>10. Contact Us</Text>
                    <Text style={styles.contentText}>
                        For privacy concerns, please reach out to us directly through our active channels:
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
        backgroundColor: '#9C27B0',
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#9C27B0',
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

    // CONTACT INTERACTION STYLES
    contactContainer: {
        marginTop: 14,
        gap: 10,
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3E5F5', // Soft purple background to complement header theme
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
        color: '#9C27B0', // Matches the header purple base accent
    },
});