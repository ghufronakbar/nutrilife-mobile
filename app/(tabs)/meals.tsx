import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { Clock } from 'lucide-react-native';
import { GetSuggestedResponse, Menu } from '@/models/content/get-suggested';
import { contentService } from '@/utils/content-service';
import { useFocusEffect } from 'expo-router';
import LoadingScreen from '@/components/LoadingScreen';
import Toast from 'react-native-toast-message';
import { foodLogsService } from '@/utils/food-logs-service';

export default function MealsScreen() {
  const [selectedDay, setSelectedDay] = useState('Hari Ini');
  const [menus, setMenus] = useState<GetSuggestedResponse[]>([]);

  const selected: GetSuggestedResponse | null =
    menus.find((menu) => menu.dayName === selectedDay) || null;

  const fetchData = async () => {
    try {
      const [suggested] = await Promise.all([contentService.suggested()]);
      console.log(suggested.data.data);
      setMenus(suggested.data.data);
    } catch (error: any) {
      console.error('Error fetching data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const days = menus.map((menu) => menu.dayName);

  const handleAdd = async (menu: Menu) => {
    try {
      Toast.show({
        type: 'info',
        text1: 'Loading',
        text2: 'Harap tunggu sebentar',
      });
      await foodLogsService.create({
        id: menu.id,
        type: 'menu',
        portions: 1,
      });

      Toast.show({
        type: 'success',
        text1: 'Berhasil menambahkan makanan',
        text2: menu.name,
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Gagal menambahkan makanan',
        text2: error.response?.data.responseMessage || 'Terjadi kesalahan',
      });
    }
  };

  if (!menus.length) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Header title="Rencana Makan" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.daySelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {days.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  selectedDay === day && styles.selectedDayButton,
                ]}
                onPress={() => setSelectedDay(day)}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    selectedDay === day && styles.selectedDayButtonText,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {selected &&
          selected.types.map((sel, i) => (
            <Card key={i} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealTitle}>{transformType(sel.type)}</Text>
                <View style={styles.timeContainer}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.timeText}>{sel.time}</Text>
                </View>
              </View>

              {sel.menus.map((menu, index) => (
                <View key={index} style={styles.mealOption}>
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealName}>{menu.name}</Text>
                    <Text style={styles.mealDescription} numberOfLines={1}>
                      {menu.description}
                    </Text>
                    <View style={styles.nutritionInfo}>
                      <Text style={styles.nutritionText}>
                        {menu.calories?.toFixed(1)} kcal
                      </Text>
                      <Text style={styles.nutritionText}>
                        P: {menu.protein?.toFixed(1)}g
                      </Text>
                      <Text style={styles.nutritionText}>
                        C: {menu.carbs?.toFixed(1)}g
                      </Text>
                      <Text style={styles.nutritionText}>
                        F: {menu.fat?.toFixed(1)}g
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAdd(menu)}
                  >
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </Card>
          ))}
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
  },
  daySelector: {
    marginTop: 16,
    marginBottom: 16,
  },
  dayButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedDayButton: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  selectedDayButtonText: {
    color: '#FFFFFF',
  },
  mealCard: {
    marginBottom: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  mealOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    maxWidth: '90%',
  },
  nutritionInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  nutritionText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  addButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  summaryCard: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
});

const transformType = (text: string) => {
  switch (text) {
    case 'BREAKFAST':
      return 'Sarapan';
    case 'LUNCH':
      return 'Makan Siang';
    case 'DINNER':
      return 'Makan Malam';
    case 'SNACK':
      return 'Snack';
    default:
      return text;
  }
};
