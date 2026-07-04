import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "./components/ScreenHeader";

export default function PrivacyPolicyScreen() {
    return (
        <SafeAreaView style={styles.screen}>
            <ScreenHeader
                title="Privacy Policy"

            />
            <ScrollView contentContainerStyle={styles.container}>
                {/* <Text style={styles.title}>Privacy Policy</Text> */}
                <Text style={styles.updated}>Last Updated: June 2026</Text>

                <Section title="Welcome to StarKid">
                    Your privacy is important to us. This Privacy Policy explains how
                    StarKid collects, uses, stores, and protects your information when you
                    use our application.
                </Section>

                <Section title="Information We Collect">
                    We may collect parent account information such as name, email address,
                    and authentication details. We may also store child profile
                    information such as nickname, avatar, tasks, star balances, bonuses,
                    penalties, and completion history.
                </Section>

                <Section title="How We Use Your Information">
                    We use your information to create and manage accounts, store tasks and
                    rewards, maintain star balances, sync data across devices, improve app
                    performance, provide support, and keep the app secure.
                </Section>

                <Section title="Children’s Privacy">
                    StarKid is intended to be used by children under the supervision of a
                    parent or legal guardian. We do not knowingly collect personal
                    information directly from children without parental involvement.
                    Parents are responsible for creating and managing child profiles.
                </Section>

                <Section title="Data Storage and Security">
                    Your information may be securely stored using trusted cloud service
                    providers, including Firebase services provided by Google. We use
                    reasonable security measures to protect your information, but no method
                    of electronic storage or transmission is completely secure.
                </Section>

                <Section title="Data Sharing">
                    We do not sell, rent, or trade your personal information. We may share
                    information only when required by law, to protect app security, or with
                    trusted service providers necessary for app operation.
                </Section>

                <Section title="Third-Party Services">
                    StarKid may use services such as Firebase Authentication, Firebase
                    Firestore, Firebase Storage, Firebase Analytics if enabled, Google Play
                    Services, and Apple App Store Services. These services may collect
                    information according to their own privacy policies.
                </Section>

                <Section title="Data Retention">
                    We retain your information for as long as your account is active or as
                    needed to provide our services. You may request deletion of your
                    account and associated data at any time.
                </Section>

                <Section title="Your Rights">
                    Depending on your location, you may have the right to access, correct,
                    or request deletion of your personal information.
                </Section>

                <Section title="Changes to This Policy">
                    We may update this Privacy Policy from time to time. Updated versions
                    will be posted inside the application and become effective when
                    published.
                </Section>

                <Section title="Contact Us">
                    If you have questions about this Privacy Policy, please contact us at:
                    starkid.app@gmail.com
                </Section>

                <Text style={styles.footer}>
                    By using StarKid, you acknowledge that you have read and understood
                    this Privacy Policy.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.sectionText}>{children}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#FFF8E7",
    },
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: "900",
        color: "#2D2A32",
        marginBottom: 6,
    },
    updated: {
        fontSize: 13,
        color: "#777",
        marginBottom: 20,
    },
    section: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 14,
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: "800",
        color: "#6C63FF",
        marginBottom: 8,
    },
    sectionText: {
        fontSize: 14,
        lineHeight: 22,
        color: "#444",
    },
    footer: {
        fontSize: 13,
        lineHeight: 20,
        color: "#666",
        textAlign: "center",
        marginTop: 10,
    },
});