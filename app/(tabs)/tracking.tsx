import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { Plus, Search, X } from 'lucide-react-native';
import { Food, GetFoodLogsResponse } from '@/models/food-logs/get-food-logs';
import { GetPreferenceResponse } from '@/models/preference/get-preference';
import { preferenceService } from '@/utils/preference-service';
import { foodLogsService } from '@/utils/food-logs-service';
import { useFocusEffect } from 'expo-router';
import { PostFoodLogsRequest } from '@/models/food-logs/post-food-logs';
import { AppFood, GetFoodResponse } from '@/models/content/get-food';
import { contentService } from '@/utils/content-service';
import LoadingScreen from '@/components/LoadingScreen';
import Toast from 'react-native-toast-message';

export default function TrackingScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<'food' | 'menu'>(
    'menu'
  );

  const [pending, setPending] = useState(false);

  const [foodsData, setFoodsData] = useState<GetFoodResponse | null>(null);
  const [logs, setLogs] = useState<GetFoodLogsResponse[]>([]);
  const [pref, setPref] = useState<GetPreferenceResponse | null>(null);
  const [formData, setFormData] = useState<PostFoodLogsRequest>({
    id: '',
    type: 'food',
    portions: 1,
  });

  const fetchData = async () => {
    try {
      const [logs, preference, foods] = await Promise.all([
        foodLogsService.get(),
        preferenceService.get(),
        contentService.foods(),
      ]);
      setLogs(logs.data.data);
      setPref(preference.data.data);
      setFoodsData(foods.data.data);
    } catch (error: any) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClickFood = (food: AppFood) => {
    if (food.id === formData.id) {
      setFormData({
        id: '',
        type: 'food',
        portions: 1,
      });
    } else {
      setFormData({
        id: food.id,
        type: food.type,
        portions: 1,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (!foodsData || !pref) {
    return <LoadingScreen />;
  }

  const filteredFoods: GetFoodResponse = {
    foods: foodsData.foods.filter((food) =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    menus: foodsData.menus.filter((food) =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  };

  const handleAddFood = async () => {
    try {
      if (pending) return;
      if (formData.id.trim() === '' || formData.portions <= 0) {
        Toast.show({
          type: 'error',
          text1: 'Gagal menambahkan makanan',
          text2: 'Harap isi form dengan benar',
        });
        return;
      }
      setPending(true);
      const res = await foodLogsService.create(formData);
      await fetchData();

      Toast.show({
        type: 'success',
        text1: 'Berhasil menambahkan makanan',
        text2: res.data.data.name,
      });

      setFormData({
        id: '',
        type: 'food',
        portions: 1,
      });

      setIsModalVisible(false);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Gagal menambahkan makanan',
        text2: error.response?.data.responseMessage || 'Terjadi kesalahan',
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Track Makanan" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Asupan Hari Ini</Text>
          <View style={styles.macroRow}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>
                {pref.progress.calories.current?.toFixed(1)}
              </Text>
              <Text style={styles.macroLabel}>Kalori</Text>
              <Text style={styles.macroGoal}>
                / {pref.progress.calories.need?.toFixed(1)}
              </Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>
                {pref.progress.protein.current?.toFixed(1)}g
              </Text>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroGoal}>
                / {pref.progress.protein.need?.toFixed(1)}g
              </Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>
                {pref.progress.carbs.current?.toFixed(1)}g
              </Text>
              <Text style={styles.macroLabel}>Karbo</Text>
              <Text style={styles.macroGoal}>
                / {pref.progress.carbs.need?.toFixed(1)}g
              </Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>
                {pref.progress.fat.current?.toFixed(1)}g
              </Text>
              <Text style={styles.macroLabel}>Lemak</Text>
              <Text style={styles.macroGoal}>
                / {pref.progress.fat.need?.toFixed(1)}g
              </Text>
            </View>
          </View>
        </Card>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Tambah Makanan</Text>
        </TouchableOpacity>

        <Card style={styles.logCard}>
          <Text style={styles.cardTitle}>Catatan Makanan</Text>
          {logs.length === 0 ? (
            <Text style={styles.emptyText}>
              Belum ada makanan yang dicatat hari ini. Mulai catat makananmu!
            </Text>
          ) : (
            logs.map((entry) => (
              <View key={entry.date}>
                <Text>{entry.date}</Text>
                {entry.foods.map((food, i) => (
                  <View key={i} style={styles.logEntry}>
                    <View style={styles.logInfo}>
                      <Text style={styles.logName}>{food.name}</Text>
                      <Text style={styles.logPortion}>{food.portions}</Text>
                      <Text style={styles.logTime}>
                        {new Date(food.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                    <View style={styles.logNutrition}>
                      <Text style={styles.logCalories}>
                        {food.calories} kcal
                      </Text>
                      <Text style={styles.logMacros}>
                        P: {food.protein}g • K: {food.carbs}g • L: {food.fat}g
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ))
          )}
        </Card>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tambah Makanan</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari makanan..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => setSelectedSection('menu')}
            >
              <Text style={styles.actionText}>Menu Jadi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => setSelectedSection('food')}
            >
              <Text style={styles.actionText}>Makanan</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.foodList}>
            {filteredFoods[selectedSection === 'food' ? 'foods' : 'menus'].map(
              (food, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.foodItem,
                    formData?.id === food.id && styles.selectedFoodItem,
                  ]}
                  onPress={() => handleClickFood(food)}
                >
                  <View>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.foodInfo}>
                      {food.calories} kcal per 100 gram
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            )}
          </ScrollView>

          {formData.id && (
            <View style={styles.portionContainer}>
              <Text style={styles.portionLabel}>Porsi (/100 gram)</Text>
              <TextInput
                style={styles.portionInput}
                value={formData.portions?.toString()}
                onChangeText={(text) =>
                  setFormData({ ...formData, portions: parseInt(text) })
                }
                keyboardType="numeric"
                placeholder="1"
              />
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleAddFood}
              >
                <Text style={styles.confirmButtonText}>
                  {pending ? 'Loading...' : 'Tambahkan Makanan'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
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
  summaryCard: {
    marginTop: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#22C55E',
  },
  macroLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  macroGoal: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22C55E',
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logCard: {
    marginTop: 16,
    marginBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    fontStyle: 'italic',
  },
  logEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  logInfo: {
    flex: 1,
  },
  logName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  logPortion: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  logTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  logNutrition: {
    alignItems: 'flex-end',
  },
  logCalories: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22C55E',
  },
  logMacros: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    margin: 16,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  foodList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  foodItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedFoodItem: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  foodInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  portionContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  portionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  portionInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  actionCard: {
    flex: 1,
    minWidth: '42%',
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
});
