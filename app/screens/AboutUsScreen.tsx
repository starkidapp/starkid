import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';

export default function AboutUsScreen() {
    return (
        <SafeAreaView style={styles.screen}>
            <ScreenHeader title="About Star Kid" showBackButton />
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}
                <View style={styles.headerCard}>
                    <Text style={styles.headerEmoji}>🚀</Text>
                    <Text style={styles.headerTitle}>Our Story</Text>
                    <Text style={styles.headerSubtitle}>
                        Making parenting and personal growth fun
                    </Text>
                </View>

                {/* MISSION */}
                <View style={styles.contentCard}>
                    <Text style={styles.cardTitle}>🎯 Our Mission</Text>
                    <Text style={styles.contentText}>
                        Star Kid was created with a simple mission: to make parenting easier and help children develop good habits in a fun, engaging way. We believe that motivation through positive reinforcement creates lasting behavioral change.
                    </Text>
                </View>

                {/* VISION */}
                <View style={styles.contentCard}>
                    <Text style={styles.cardTitle}>✨ Our Vision</Text>
                    <Text style={styles.contentText}>
                        We envision a world where families connect through shared goals and celebrate achievements together. We want to empower parents with tools to guide their children and help kids understand the value of hard work and persistence.
                    </Text>
                </View>

                {/* VALUES */}
                <View style={styles.contentCard}>
                    <Text style={styles.cardTitle}>💜 Our Values</Text>
                    <View style={styles.valueItem}>
                        <Text style={styles.valueBullet}>🛡️ Safety First</Text>
                        <Text style={styles.valueText}>Your family's privacy and safety are our top priority.</Text>
                    </View>
                    <View style={styles.valueItem}>
                        <Text style={styles.valueBullet}>👨‍👩‍👧‍👦 Family Focused</Text>
                        <Text style={styles.valueText}>We design everything with families in mind.</Text>
                    </View>
                    <View style={styles.valueItem}>
                        <Text style={styles.valueBullet}>🎨 Creative & Fun</Text>
                        <Text style={styles.valueText}>Learning should be enjoyable for everyone.</Text>
                    </View>
                    <View style={styles.valueItem}>
                        <Text style={styles.valueBullet}>🌱 Growth Mindset</Text>
                        <Text style={styles.valueText}>We believe in continuous improvement and learning.</Text>
                    </View>
                </View>

                {/* TEAM */}
                <View style={styles.contentCard}>
                    <Text style={styles.cardTitle}>👥 Our Team</Text>
                    <Text style={styles.contentText}>
                        Star Kid was built by a passionate team of developers, designers, and parents who understand the challenges of modern parenting. We're committed to continuously improving the app based on your feedback.
                    </Text>
                </View>

                {/* FEATURES */}
                <View style={styles.contentCard}>
                    <Text style={styles.cardTitle}>⭐ Why Star Kid?</Text>
                    <View style={styles.featureItem}>
                        <Text style={styles.featureBullet}>✓ Easy to Use</Text>
                        <Text style={styles.featureText}>Simple interface designed for kids and parents</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Text style={styles.featureBullet}>✓ Secure & Private</Text>
                        <Text style={styles.featureText}>Your data is encrypted and protected</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Text style={styles.featureBullet}>✓ Parent Controls</Text>
                        <Text style={styles.featureText}>Full control over tasks, rewards, and progress</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Text style={styles.featureBullet}>✓ Real-time Tracking</Text>
                        <Text style={styles.featureText}>Monitor progress instantly</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Text style={styles.featureBullet}>✓ Fun Gamification</Text>
                        <Text style={styles.featureText}>Earn stars and unlock rewards</Text>
                    </View>
                </View>

                {/* CONTACT */}
                <View style={styles.contactCard}>
                    <Text style={styles.contactTitle}>📞 Get in Touch</Text>
                    <Text style={styles.contactText}>
                        Have suggestions or feedback? We'd love to hear from you!
                    </Text>
                    <Text style={styles.contactInfo}>
                        📧 starkid.app@gmail.com{'\n'}
                        {/* 🌐 www.starkid.com{'\n'} */}
                        {/* 📞 +1 (234) 567-890 */}
                    </Text>
                </View>

                {/* FOOTER */}
                <View style={styles.footerCard}>
                    <Text style={styles.footerText}>
                        Thank you for being part of the Star Kid family! 💚
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
        backgroundColor: '#009688',
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#009688',
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

    // CONTENT CARD
    contentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 18,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D2A32',
        marginBottom: 12,
    },
    contentText: {
        fontSize: 13,
        color: '#555',
        lineHeight: 20,
        fontWeight: '400',
    },

    // VALUES & FEATURES
    valueItem: {
        marginBottom: 14,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    valueBullet: {
        fontSize: 14,
        fontWeight: '700',
        color: '#009688',
        marginBottom: 4,
    },
    valueText: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
    },

    featureItem: {
        marginBottom: 12,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    featureBullet: {
        fontSize: 14,
        fontWeight: '700',
        color: '#009688',
        marginBottom: 4,
    },
    featureText: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
    },

    // CONTACT CARD
    contactCard: {
        backgroundColor: '#E0F2F1',
        borderRadius: 18,
        padding: 18,
        marginBottom: 14,
        borderLeftWidth: 4,
        borderLeftColor: '#009688',
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D2A32',
        marginBottom: 10,
    },
    contactText: {
        fontSize: 13,
        color: '#555',
        lineHeight: 20,
        marginBottom: 12,
        fontWeight: '400',
    },
    contactInfo: {
        fontSize: 13,
        color: '#009688',
        fontWeight: '600',
        lineHeight: 22,
    },

    // FOOTER
    footerCard: {
        backgroundColor: '#F1F8E9',
        borderRadius: 18,
        padding: 18,
        borderLeftWidth: 4,
        borderLeftColor: '#8BC34A',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#8BC34A',
    },
});
