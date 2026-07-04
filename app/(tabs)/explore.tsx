

import * as Application from 'expo-application';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';

export default function ExploreScreen() {
  const appVersion = Application.nativeApplicationVersion || '1.0.0';

  const handleNavigation = (path: string) => {
    router.push(path as any);
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.screen}>
        <ScreenHeader title="Explore" />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --- BEAUTIFIED HEADER CARD --- */}
          <View style={styles.headerCard}>
            {/* <View style={styles.emojiBadge}> */}
            {/* <Text style={styles.headerEmoji}>🌟</Text> */}
            <Image
              source={require('../../assets/images/star-icon.png')}
              style={styles.headerImageBrand}
              resizeMode="contain"
            />
            {/* </View> */}
            <Text style={styles.headerTitle}>Welcome to Star Kid</Text>
            <View style={styles.subtitleBadge}>
              <Text style={styles.headerSubtitle}>
                Your guide to rewards and achievements
              </Text>
            </View>
          </View>
          {/* <View style={styles.headerCard}>
            <View style={styles.imageBadge}>
              <Image
                source={require('../../assets/images/icon.png')}
                style={styles.headerImageBrand}
                resizeMode="contain"
              />
            </View>

            {/* Logo text replacement image 
            <Image
              source={require('../../assets/images/starkid-text.png')}
              style={styles.headerLogoText}
              resizeMode="contain"
            />

            <View style={styles.subtitleBadge}>
              <Text style={styles.headerSubtitle}>
                Your guide to rewards and achievements
              </Text>
            </View>
          </View> */}

          {/* SUPPORT SECTION */}
          <View style={styles.sectionContainer}>
            {/* <View style={styles.sectionHeader}>
              <Text style={styles.sectionEmoji}>💬</Text>
              <Text style={styles.sectionTitle}>Get Support</Text>
            </View> */}

            <TouchableOpacity
              style={[styles.card, styles.supportCard]}
              onPress={() => handleNavigation('/screens/ContactSupportScreen')}
              activeOpacity={0.8}
            >
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>📧</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Contact Support</Text>
                <Text style={styles.cardDescription}>
                  Need help? Get in touch with our team
                </Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, styles.faqCard]}
              onPress={() => handleNavigation('/screens/FaqScreen')}
              activeOpacity={0.8}
            >
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>❓</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>FAQ & Help</Text>
                <Text style={styles.cardDescription}>
                  Find answers to common questions
                </Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
          </View>

          {/* POLICIES SECTION */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEmoji}>📋</Text>
              <Text style={styles.sectionTitle}>Legal & Policies</Text>
            </View>

            <TouchableOpacity
              style={[styles.card, styles.privacyCard]}
              onPress={() => handleNavigation('/screens/PrivacyPolicyScreen')}
              activeOpacity={0.8}
            >
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>🔒</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Privacy Policy</Text>
                <Text style={styles.cardDescription}>
                  How we protect your information
                </Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, styles.termsCard]}
              onPress={() => handleNavigation('/screens/TermsAndConditionsScreen')}
              activeOpacity={0.8}
            >
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>📜</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Terms & Conditions</Text>
                <Text style={styles.cardDescription}>
                  Our terms of service and conditions
                </Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={[styles.card, styles.licensesCard]}
              onPress={() => handleNavigation('/screens/LicensesScreen')}
              activeOpacity={0.8}
            >
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>⚖️</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Open Source Licenses</Text>
                <Text style={styles.cardDescription}>
                  Third-party libraries we use
                </Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity> */}
          </View>

          {/* ABOUT SECTION */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEmoji}>ℹ️</Text>
              <Text style={styles.sectionTitle}>About Star Kid</Text>
            </View>

            <TouchableOpacity
              style={[styles.card, styles.aboutCard]}
              onPress={() => handleNavigation('/screens/AboutUsScreen')}
              activeOpacity={0.8}
            >
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>🚀</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Our Story</Text>
                <Text style={styles.cardDescription}>
                  Learn about our mission and vision
                </Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>

            <View style={[styles.card, styles.versionCard]}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>🎉</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Version</Text>
                <Text style={styles.cardDescription}>
                  Star Kid v{appVersion}
                </Text>
              </View>
            </View>
          </View>

          {/* FOOTER */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Made with 💚 for families everywhere
            </Text>
            <Text style={styles.footerSubtext}>
              © 2026 Star Kid. All rights reserved.
            </Text>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
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

  // --- NEW BEAUTIFIED HEADER CARD STYLES ---
  headerCard: {
    backgroundColor: '#6C63FF', // Rich, vibrant brand purple base
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 28,
    alignItems: 'center',
    // Pro drop shadows
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  emojiBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 20,
    marginBottom: 14,
  },
  headerEmoji: {
    fontSize: 44,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitleBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)', // Dark translucent tint for crisp text contrast
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 30,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#E0DEFF', // Soft pastel contrast tint
    textAlign: 'center',
    fontWeight: '600',
  },

  // SECTION
  sectionContainer: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2A32',
  },

  // CARDS
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  supportCard: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  faqCard: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  privacyCard: {
    backgroundColor: '#F3E5F5',
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  termsCard: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  licensesCard: {
    backgroundColor: '#FCE4EC',
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
  },
  aboutCard: {
    backgroundColor: '#E0F2F1',
    borderLeftWidth: 4,
    borderLeftColor: '#009688',
  },
  versionCard: {
    backgroundColor: '#F1F8E9',
    borderLeftWidth: 4,
    borderLeftColor: '#8BC34A',
  },

  cardIconContainer: {
    marginRight: 16,
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 28,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D2A32',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    fontWeight: '400',
  },
  arrowIcon: {
    fontSize: 24,
    color: '#6C63FF',
    fontWeight: '300',
    marginLeft: 8,
  },

  // FOOTER
  footerContainer: {
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C63FF',
    marginBottom: 8,
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
    fontWeight: '400',
  },
  imageBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    padding: 10,
    borderRadius: 22,
    marginBottom: 16,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImageBrand: {
    width: 120,
    height: 120,
  },
  headerLogoText: {
    width: 180,
    height: 40,
    marginBottom: 14,
  },
});