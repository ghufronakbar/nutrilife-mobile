import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Card } from '@/components/Card';
import { NutrientBar } from '@/components/NutrientBar';
import { Header } from '@/components/Header';
import { CalendarDays, TrendingUp, Apple, Droplets } from 'lucide-react-native';
import { GetProfileResponse } from '@/models/user/get-profile';
import { userService } from '@/utils/user-service';
import LoadingScreen from '@/components/LoadingScreen';
import { GetPreferenceResponse } from '@/models/preference/get-preference';
import { preferenceService } from '@/utils/preference-service';

export default function HomeScreen() {
  const [user, setUser] = useState<GetProfileResponse | null>(null);
  const [pref, setPref] = useState<GetPreferenceResponse | null>(null);

  const fetchData = async () => {
    try {
      const [profile, preference] = await Promise.all([
        userService.profile(),
        preferenceService.get(),
      ]);
      setUser(profile.data.data);
      setPref(preference.data.data);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );
  if (!user || !pref) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Header title={`Halo, ${user.name}!`} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.dailyOverview}>
          <Text style={styles.cardTitle}>Ringkasan Hari Ini</Text>
          <View style={styles.caloriesContainer}>
            <Text style={styles.caloriesConsumed}>
              {pref.progress.calories.current}
            </Text>
            <Text style={styles.caloriesGoal}>
              / {pref.progress.calories.need} kkal
            </Text>
          </View>
          <View style={styles.macrosContainer}>
            <NutrientBar
              label="Protein"
              current={pref.progress.protein.current}
              target={pref.progress.protein.need}
              color="#3B82F6"
              unit="g"
            />
            <NutrientBar
              label="Karbohidrat"
              current={pref.progress.carbs.current}
              target={pref.progress.carbs.need}
              color="#F59E0B"
              unit="g"
            />
            <NutrientBar
              label="Lemak"
              current={pref.progress.fat.current}
              target={pref.progress.fat.need}
              color="#EF4444"
              unit="g"
            />
          </View>
        </Card>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/tracking')}
          >
            <Apple size={24} color="#22C55E" />
            <Text style={styles.actionText}>Catat Makanan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/meals')}
          >
            <CalendarDays size={24} color="#3B82F6" />
            <Text style={styles.actionText}>Rencana Makan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/achievements')}
          >
            <TrendingUp size={24} color="#F97316" />
            <Text style={styles.actionText}>Perkembangan</Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.insightCard}>
          <Text style={styles.cardTitle}>Wawasan Hari Ini</Text>
          <Text style={styles.insightText}>
            {pref.progress.calories.current < pref.progress.calories.need * 0.5
              ? 'Kamu sedang hebat! Jangan lupa tetap makan cukup sepanjang hari.'
              : pref.progress.calories.current >
                pref.progress.calories.need * 1.1
              ? 'Kamu sudah melebihi target kalori hari ini. Pertimbangkan makanan yang lebih ringan untuk selanjutnya.'
              : 'Kamu berada di jalur yang tepat dengan target nutrisi. Pertahankan ya!'}
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  getStartedButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dailyOverview: {
    marginTop: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  caloriesConsumed: {
    fontSize: 36,
    fontWeight: '700',
    color: '#22C55E',
  },
  caloriesGoal: {
    fontSize: 18,
    color: '#6B7280',
    marginLeft: 8,
  },
  macrosContainer: {
    gap: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
  },
  insightCard: {
    marginTop: 16,
    marginBottom: 24,
  },
  insightText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
