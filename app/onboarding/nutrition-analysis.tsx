import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { calculateNutritionGoals } from '@/helper/nutrition-calculator';
import { Target, Zap, Activity, TrendingUp } from 'lucide-react-native';

export default function NutritionAnalysisScreen() {
  const params = useLocalSearchParams();

  const userData = {
    name: params.name as string,
    email: params.email as string,
    age: parseInt(params.age as string),
    weight: parseFloat(params.weight as string),
    height: parseFloat(params.height as string),
    gender: params.gender as string,
    activityLevel: params.activityLevel as string,
    goal: params.goal as string,
  };

  const nutritionGoals = calculateNutritionGoals(userData);

  const handleComplete = () => {
    router.replace('/(tabs)');
  };

  const analysisCards = [
    {
      icon: <Zap size={32} color="#F59E0B" />,
      title: 'Kalori Harian',
      value: `${nutritionGoals.dailyCalories} kkal`,
      description: 'Berdasarkan BMR dan tingkat aktivitas Anda',
      color: '#F59E0B',
    },
    {
      icon: <Target size={32} color="#3B82F6" />,
      title: 'Target Protein',
      value: `${nutritionGoals.dailyProtein}g`,
      description: 'Penting untuk menjaga dan membentuk otot',
      color: '#3B82F6',
    },
    {
      icon: <Activity size={32} color="#10B981" />,
      title: 'Karbohidrat',
      value: `${nutritionGoals.dailyCarbs}g`,
      description: 'Sumber energi utama tubuh Anda',
      color: '#10B981',
    },
    {
      icon: <TrendingUp size={32} color="#EF4444" />,
      title: 'Lemak Sehat',
      value: `${nutritionGoals.dailyFat}g`,
      description: 'Penting untuk produksi hormon dan fungsi tubuh',
      color: '#EF4444',
    },
  ];

  return (
    <View style={styles.container}>
      <Header title="Rencana Nutrisi Anda" showBack />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Berdasarkan profil Anda, berikut adalah rencana nutrisi yang
          dipersonalisasi untuk membantu Anda mencapai tujuan{' '}
          <Text style={styles.highlight}>{userData.goal.toLowerCase()}</Text>.
        </Text>

        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Target Harian Anda</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{nutritionGoals.bmr}</Text>
              <Text style={styles.summaryLabel}>BMR (kkal)</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{nutritionGoals.tdee}</Text>
              <Text style={styles.summaryLabel}>TDEE (kkal)</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {(userData.weight / (userData.height / 100) ** 2) | 0}
              </Text>
              <Text style={styles.summaryLabel}>IMT</Text>
            </View>
          </View>
        </Card>

        {analysisCards.map((card, index) => (
          <Card key={index} style={styles.analysisCard}>
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: card.color + '20' },
                ]}
              >
                {card.icon}
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={[styles.cardValue, { color: card.color }]}>
                  {card.value}
                </Text>
              </View>
            </View>
            <Text style={styles.cardDescription}>{card.description}</Text>
          </Card>
        ))}

        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Tips untuk Sukses</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>💧</Text>
              <Text style={styles.tipText}>
                Minum minimal 8 gelas air setiap hari
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>🥗</Text>
              <Text style={styles.tipText}>
                Isi setengah piring Anda dengan sayuran
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>⏰</Text>
              <Text style={styles.tipText}>
                Makan secara teratur untuk menjaga energi
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>📱</Text>
              <Text style={styles.tipText}>
                Lacak asupan makanan Anda secara konsisten
              </Text>
            </View>
          </View>
        </Card>

        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
        >
          <Text style={styles.completeText}>Lanjut Menjelajah</Text>
        </TouchableOpacity>
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
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
    lineHeight: 24,
  },
  highlight: {
    color: '#22C55E',
    fontWeight: '600',
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#22C55E',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  analysisCard: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  tipsCard: {
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  completeButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  completeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
