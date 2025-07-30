import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { Trophy, Target, Flame, Award } from 'lucide-react-native';
import { GetAchievementResponse } from '@/models/track/get-achievement';
import { GetProgressResponse } from '@/models/track/get-progress';
import { trackService } from '@/utils/track-service';
import LoadingScreen from '@/components/LoadingScreen';
import { GetPreferenceResponse } from '@/models/preference/get-preference';
import { preferenceService } from '@/utils/preference-service';
import { useFocusEffect } from 'expo-router';

export default function AchievementsScreen() {
  const [achievements, setAchievements] = useState<GetAchievementResponse[]>(
    []
  );
  const [progress, setProgress] = useState<GetProgressResponse | null>(null);
  const [pref, setPref] = useState<GetPreferenceResponse | null>(null);

  const fetchData = async () => {
    try {
      const [achievements, progress, preference] = await Promise.all([
        trackService.achievements(),
        trackService.progress(),
        preferenceService.get(),
      ]);
      setAchievements(achievements.data.data);
      setProgress(progress.data.data);
      setPref(preference.data.data);
    } catch (error: any) {
      console.error('Error fetching data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (!progress || !achievements.length || !pref) {
    return <LoadingScreen />;
  }

  const stats = [
    {
      icon: <Flame size={24} color="#F97316" />,
      label: 'Streak Sekarang',
      value: `${progress?.dayStreak} hari`,
      color: '#F97316',
    },
    {
      icon: <Target size={24} color="#3B82F6" />,
      label: 'Harian Tercatat',
      value: `${progress.dayTracked} hari`,
      color: '#3B82F6',
    },
    {
      icon: <Trophy size={24} color="#22C55E" />,
      label: 'Kalori Tercatat',
      value: `${progress.caloriesTracked} kcal`,
      color: '#22C55E',
    },
  ];

  return (
    <View style={styles.container}>
      <Header title="Perkembangan & Tujuan" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>Perkembangan Anda</Text>
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                {stat.icon}
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.achievementsCard}>
          <Text style={styles.cardTitle}>Pencapaian</Text>
          {achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementItem}>
              <View
                style={[
                  styles.achievementIcon,
                  {
                    backgroundColor: achievement.unlocked
                      ? achievement.color + '20'
                      : '#F3F4F6',
                  },
                ]}
              >
                <Award
                  size={24}
                  color={achievement.unlocked ? achievement.color : '#9CA3AF'}
                />
              </View>
              <View style={styles.achievementInfo}>
                <Text
                  style={[
                    styles.achievementTitle,
                    { color: achievement.unlocked ? '#1F2937' : '#9CA3AF' },
                  ]}
                >
                  {achievement.title}
                </Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
                {achievement.unlocked && (
                  <Text style={styles.unlockedDate}>
                    Dibuka pada {achievement.unlockedDate}
                  </Text>
                )}
              </View>
              {achievement.unlocked && (
                <View
                  style={[
                    styles.unlockedBadge,
                    { backgroundColor: achievement.color },
                  ]}
                >
                  <Text style={styles.unlockedText}>✓</Text>
                </View>
              )}
            </View>
          ))}
        </Card>

        <Card style={styles.insightCard}>
          <Text style={styles.cardTitle}>Wawasan Minggu Ini</Text>
          <Text style={styles.insightText}>
            🎯 Kamu berada di jalur yang benar! Kamu telah mencatat selama{' '}
            {progress.dayStreak} hari berturut-turut dan tetap dalam batas
            kalori hampir setiap hari.
          </Text>
          <Text style={styles.insightText}>
            💪 Asupan protein kamu konsisten, rata-rata{' '}
            {pref?.progress.protein.need}g per hari.
          </Text>
          <Text style={styles.insightText}>
            🥗 Coba tambahkan lebih banyak sayuran untuk meningkatkan asupan
            serat dan memenuhi target mikronutrienmu.
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsCard: {
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  achievementsCard: {
    marginTop: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  unlockedDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  unlockedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  goalsCard: {
    marginTop: 16,
  },
  goalItem: {
    marginBottom: 16,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 4,
  },
  goalProgress: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  insightCard: {
    marginTop: 16,
    marginBottom: 24,
  },
  insightText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
});
