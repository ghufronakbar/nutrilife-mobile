import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import {
  Settings,
  CircleHelp as HelpCircle,
  LogOut,
  CreditCard as Edit,
} from 'lucide-react-native';
import { tokenContext } from '@/utils/token-context';
import LoadingScreen from '@/components/LoadingScreen';
import { GetProfileResponse } from '@/models/user/get-profile';
import { GetPreferenceResponse } from '@/models/preference/get-preference';
import { userService } from '@/utils/user-service';
import { preferenceService } from '@/utils/preference-service';
import { calculateAge } from '@/helper/calculate';
import { GetActivityLevelResponse } from '@/models/content/get-activity-level';
import { GetPrimaryGoalResponse } from '@/models/content/get-primary-goal';
import { contentService } from '@/utils/content-service';
// import { Modal, TextInput } from 'react-native';
import { PutProfileRequest } from '@/models/user/put-profile';
import { PostPreferenceRequest } from '@/models/preference/post-preference';
import Toast from 'react-native-toast-message';

export default function ProfileScreen() {
  const [user, setUser] = useState<GetProfileResponse | null>(null);
  const [pref, setPref] = useState<GetPreferenceResponse | null>(null);
  const [activitesData, setActivitesData] = useState<
    GetActivityLevelResponse[]
  >([]);
  const [goalsData, setGoalsData] = useState<GetPrimaryGoalResponse[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [pending, setPending] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState<'profile' | 'preference'>(
    'profile'
  );

  const [formProfile, setFormProfile] = useState<PutProfileRequest>({
    email: '',
    name: '',
    picture: null,
  });

  const [formPref, setFormPref] = useState<PostPreferenceRequest>({
    activityLevelId: '',
    height: 0,
    primaryGoalId: '',
    weight: 0,
  });

  const fetchData = async () => {
    try {
      console.log('HIT FETCH');
      const [profile, preference, activities, goals] = await Promise.all([
        userService.profile(),
        preferenceService.get(),
        contentService.activityLevel(),
        contentService.primaryGoals(),
      ]);
      setUser(profile.data.data);
      setFormProfile({
        email: profile.data.data.email,
        name: profile.data.data.name,
        picture: profile.data.data.picture,
      });
      setPref(preference.data.data);
      if (user?.userPreferences?.[0]) {
        console.log(user?.userPreferences?.[0]);
        setFormPref({
          activityLevelId: user?.userPreferences?.[0]?.appActivityLevelId,
          height: user?.userPreferences?.[0]?.height,
          primaryGoalId: user?.userPreferences?.[0]?.appPrimaryGoalId,
          weight: user?.userPreferences?.[0]?.weight,
        });
      }
      setActivitesData(activities.data.data);
      setGoalsData(goals.data.data);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (pending) return;
      setPending(true);
      Toast.show({
        type: 'info',
        text1: 'Loading',
        text2: 'Harap tunggu sebentar',
      });
      await userService.edit(formProfile);
      await fetchData();
      Toast.show({
        type: 'success',
        text1: 'Berhasil mengubah profile',
      });
      setModalVisible(false);
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Gagal mengubah profile',
        text2: err.response?.data?.responseMessage || 'Terjadi kesalahan',
      });
      console.error(err);
    } finally {
      setPending(false);
    }
  };

  const handleUpdatePref = async () => {
    try {
      if (pending) return;
      setPending(true);
      Toast.show({
        type: 'info',
        text1: 'Loading',
        text2: 'Harap tunggu sebentar',
      });
      console.log({ formPref });
      await preferenceService.create(formPref);
      await fetchData();
      Toast.show({
        type: 'success',
        text1: 'Berhasil mengubah preferensi',
      });
      setModalVisible(false);
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Gagal mengubah preferensi',
        text2: err.response?.data?.responseMessage || 'Terjadi kesalahan',
      });
      console.error(err);
    } finally {
      setPending(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleLogout = async () => {
    tokenContext.remove();
    router.replace('/onboarding/welcome');
  };

  const onOpenEdit = () => {
    if (user && user) {
      setFormProfile({
        email: user.email,
        name: user.name,
        picture: user.picture,
      });

      setFormPref({
        activityLevelId: user?.userPreferences?.[0]?.appActivityLevelId,
        height: user?.userPreferences?.[0]?.height,
        primaryGoalId: user?.userPreferences?.[0]?.appPrimaryGoalId,
        weight: user?.userPreferences?.[0]?.weight,
      });
    }

    setModalVisible(true);
  };

  if (!user || !pref || !activitesData.length || !goalsData.length) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Header title="Profil" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user.name[0].toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
              <Text style={styles.profileGoal}>
                Tujuan: {user.userPreferences?.[0]?.appPrimaryGoal?.name}
              </Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit size={20} color="#6B7280" onPress={onOpenEdit} />
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>Statistik Anda</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Usia</Text>
              <Text style={styles.statValue}>
                {calculateAge(user.dateOfBirth)} tahun
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Berat</Text>
              <Text style={styles.statValue}>
                {user.userPreferences?.[0]?.weight} kg
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Tinggi</Text>
              <Text style={styles.statValue}>
                {user.userPreferences?.[0]?.height} cm
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Aktivitas</Text>
              <Text style={styles.statValue}>
                {user.userPreferences?.[0]?.appActivityLevel?.name}
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.nutritionCard}>
          <Text style={styles.cardTitle}>Target Nutrisi Harian</Text>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {pref.progress.calories.need?.toFixed(1)}
              </Text>
              <Text style={styles.nutritionLabel}>Kalori</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {pref.progress.protein.need?.toFixed(1)}g
              </Text>
              <Text style={styles.nutritionLabel}>Protein</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {pref.progress.carbs.need?.toFixed(1)}g
              </Text>
              <Text style={styles.nutritionLabel}>Karbohidrat</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {pref.progress.fat.need?.toFixed(1)}g
              </Text>
              <Text style={styles.nutritionLabel}>Lemak</Text>
            </View>
          </View>
        </Card>

        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Settings size={20} color="#6B7280" />
            <Text style={styles.menuText}>Pengaturan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <HelpCircle size={20} color="#6B7280" />
            <Text style={styles.menuText}>Bantuan & Dukungan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={[styles.menuText, { color: '#EF4444' }]}>Keluar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            padding: 20,
          }}
        >
          <ScrollView>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                marginBottom: 20,
                marginTop: 24,
              }}
            >
              Edit {selectedMenu === 'profile' ? 'Profile' : 'Preferensi'}
            </Text>
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => {
                  if (pending) return;
                  setSelectedMenu('profile');
                }}
              >
                <Text style={styles.actionText}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => {
                  if (pending) return;
                  setSelectedMenu('preference');
                }}
              >
                <Text style={styles.actionText}>Preferensi</Text>
              </TouchableOpacity>
            </View>
            {selectedMenu === 'profile' ? (
              <ScrollView>
                <Card style={styles.formCard}>
                  <Text style={styles.sectionTitle}>Informasi Profil</Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nama Lengkap</Text>
                    <TextInput
                      style={styles.input}
                      value={formProfile.name}
                      onChangeText={(text) =>
                        setFormProfile({ ...formProfile, name: text })
                      }
                      placeholder="Masukkan nama"
                      autoCapitalize="words"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                      style={styles.input}
                      value={formProfile.email}
                      onChangeText={(text) =>
                        setFormProfile({ ...formProfile, email: text })
                      }
                      placeholder="Masukkan email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#22C55E',
                      padding: 16,
                      borderRadius: 10,
                      marginBottom: 20,
                      marginTop: 10,
                    }}
                    onPress={handleUpdateProfile}
                  >
                    <Text style={{ color: '#FFF', textAlign: 'center' }}>
                      {pending ? 'Loading...' : 'Simpan Profile'}
                    </Text>
                  </TouchableOpacity>
                </Card>
              </ScrollView>
            ) : (
              <ScrollView>
                <Card style={styles.formCard}>
                  <Text style={styles.sectionTitle}>Preferensi</Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Berat Badan (kg)</Text>
                    <TextInput
                      style={styles.input}
                      value={formPref.weight?.toString()}
                      onChangeText={(text) =>
                        setFormPref({
                          ...formPref,
                          weight: parseInt(text) || 0,
                        })
                      }
                      placeholder="Masukkan berat badan"
                      keyboardType="numeric"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tinggi Badan (cm)</Text>
                    <TextInput
                      style={styles.input}
                      value={formPref.height?.toString()}
                      onChangeText={(text) =>
                        setFormPref({
                          ...formPref,
                          height: parseInt(text) || 0,
                        })
                      }
                      placeholder="Masukkan tinggi badan"
                      keyboardType="numeric"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tingkat Aktivitas</Text>
                    <View style={styles.optionColumn}>
                      {activitesData.map((activity) => (
                        <TouchableOpacity
                          key={activity.id}
                          style={[
                            styles.activityOption,
                            formPref.activityLevelId === activity.id &&
                              styles.selectedOption,
                          ]}
                          onPress={() =>
                            setFormPref({
                              ...formPref,
                              activityLevelId: activity.id,
                            })
                          }
                        >
                          <Text
                            style={[
                              styles.optionText,
                              formPref.activityLevelId === activity.id &&
                                styles.selectedOptionText,
                            ]}
                          >
                            {activity.name} ({activity.description})
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tujuan Utama</Text>
                    <View style={styles.optionColumn}>
                      {goalsData.map((goal) => (
                        <TouchableOpacity
                          key={goal.id}
                          style={[
                            styles.goalOption,
                            formPref.primaryGoalId === goal.id &&
                              styles.selectedOption,
                          ]}
                          onPress={() =>
                            setFormPref({ ...formPref, primaryGoalId: goal.id })
                          }
                        >
                          <Text
                            style={[
                              styles.optionText,
                              formPref.primaryGoalId === goal.id &&
                                styles.selectedOptionText,
                            ]}
                          >
                            {goal.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#3B82F6',
                      padding: 16,
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                    onPress={handleUpdatePref}
                  >
                    <Text style={{ color: '#FFF', textAlign: 'center' }}>
                      {pending ? 'Loading...' : 'Simpan Preferensi'}
                    </Text>
                  </TouchableOpacity>
                </Card>
              </ScrollView>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: {},
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
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
    marginBottom: 24,
  },
  setupButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  setupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  profileCard: {
    marginTop: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  profileGoal: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
  },
  statsCard: {
    marginTop: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '40%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  nutritionCard: {
    marginTop: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#22C55E',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  menuSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  menuText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    fontWeight: '500',
  },
  activityOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  goalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedOption: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
  },

  selectedOptionText: {
    color: '#22C55E',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionColumn: {
    gap: 8,
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
