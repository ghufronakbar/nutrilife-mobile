import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Heart, Target, TrendingUp } from 'lucide-react-native';
export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Heart size={64} color="#22C55E" />
          <Text style={styles.title}>NutriLife</Text>
          <Text style={styles.subtitle}>
            Pendamping Kesehatan & Nutrisi Anda
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Target size={32} color="#3B82F6" />
            <Text style={styles.featureTitle}>Tujuan yang Dipersonalisasi</Text>
            <Text style={styles.featureDescription}>
              Dapatkan target nutrisi yang disesuaikan dengan tubuh dan tujuan
              kebugaran Anda
            </Text>
          </View>

          <View style={styles.feature}>
            <TrendingUp size={32} color="#F97316" />
            <Text style={styles.featureTitle}>Lacak Perkembangan</Text>
            <Text style={styles.featureDescription}>
              Pantau asupan harian Anda dan lihat perjalanan kesehatan Anda
              berkembang
            </Text>
          </View>

          <View style={styles.feature}>
            <Heart size={32} color="#EF4444" />
            <Text style={styles.featureTitle}>Bangun Kebiasaan Sehat</Text>
            <Text style={styles.featureDescription}>
              Kembangkan pola makan yang berkelanjutan dengan alat perencanaan
              makanan kami
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => router.push('/onboarding/profile-setup')}
        >
          <Text style={styles.getStartedText}>Mulai Sekarang</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/onboarding/login')}>
          <Text style={styles.skipText}>Sudah memiliki akun? Masuk</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 64,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  featuresContainer: {
    gap: 32,
  },
  feature: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    gap: 16,
  },
  getStartedButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
});
