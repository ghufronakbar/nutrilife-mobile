import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import {
  Lifestyle,
  PersonalInformation,
  PhysicalStats,
  PostRegisterRequest,
} from '@/models/user/post-register';
import { GetActivityLevelResponse } from '@/models/content/get-activity-level';
import { GetPrimaryGoalResponse } from '@/models/content/get-primary-goal';
import LoadingScreen from '@/components/LoadingScreen';
import { contentService } from '@/utils/content-service';
import { userService } from '@/utils/user-service';
import { tokenContext } from '@/utils/token-context';
import { calculateAge } from '@/helper/calculate';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ProfileSetupScreen() {
  const [activitiesData, setActivitiesData] = useState<
    GetActivityLevelResponse[]
  >([]);
  const [goalsData, setGoalsData] = useState<GetPrimaryGoalResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchData = async () => {
    try {
      const [activities, goals] = await Promise.all([
        contentService.activityLevel(),
        contentService.primaryGoals(),
      ]);
      setActivitiesData(activities.data.data);
      setGoalsData(goals.data.data);
    } catch (error: any) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [formData, setFormData] = useState<PostRegisterRequest>({
    personalInformation: {
      email: '',
      password: '',
      name: '',
      dateOfBirth: '',
      gender: '',
    },
    physicalStats: {
      weight: 0,
      height: 0,
    },
    lifestyle: {
      activityLevelId: '',
      primaryGoalId: '',
    },
  });

  const handlePersonalInfoChange = (
    field: keyof PersonalInformation,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      personalInformation: { ...prev.personalInformation, [field]: value },
    }));
  };

  const handlePhysicalStatsChange = (
    field: keyof PhysicalStats,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      physicalStats: { ...prev.physicalStats, [field]: Number(value) },
    }));
  };

  const handleLifestyleChange = (field: keyof Lifestyle, value: string) => {
    setFormData((prev) => ({
      ...prev,
      lifestyle: { ...prev.lifestyle, [field]: value },
    }));
  };

  const isFormValid =
    formData.personalInformation.name.trim() !== '' &&
    formData.personalInformation.email.trim() !== '' &&
    formData.personalInformation.dateOfBirth.trim() !== '' &&
    formData.personalInformation.gender.trim() !== '' &&
    formData.physicalStats.weight > 0 &&
    formData.physicalStats.height > 0 &&
    formData.lifestyle.activityLevelId.trim() !== '' &&
    formData.lifestyle.primaryGoalId.trim() !== '' &&
    formData.personalInformation.password.trim() !== '' &&
    /^\S+@\S+\.\S+$/.test(formData.personalInformation.email);

  const handleContinue = async () => {
    try {
      if (isFormValid) {
        setPending(true);
        const res = await userService.register(formData);
        await tokenContext.save(res.data.data.accessToken);

        const forwardParams = {
          name: res.data.data.name,
          email: res.data.data.email,
          age: calculateAge(res.data.data.dateOfBirth),
          weight: res.data.data.userPreferences?.[0]?.weight,
          height: res.data.data.userPreferences?.[0]?.height,
          gender: res.data.data.gender,
          activityLevel: activitiesData.find(
            (activity) => activity.id === formData.lifestyle.activityLevelId
          )?.name,
          goal: goalsData.find(
            (goal) => goal.id === formData.lifestyle.primaryGoalId
          )?.name,
        };
        router.replace({
          pathname: '/onboarding/nutrition-analysis',
          params: forwardParams,
        });
      }
    } catch (error: any) {
      console.log('ERROR::::::', error?.response?.data?.responseMessage);
      Toast.show({
        type: 'error',
        text1: 'Registrasi Gagal',
        text2: error?.response?.data?.responseMessage || 'Terjadi kesalahan',
      });
    } finally {
      setPending(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Header title="Registrasi" showBack />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Ceritakan tentang diri Anda untuk mendapatkan rekomendasi nutrisi yang
          disesuaikan dengan kebutuhan Anda.
        </Text>

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput
              style={styles.input}
              value={formData.personalInformation.name}
              onChangeText={(value) => handlePersonalInfoChange('name', value)}
              placeholder="Masukkan nama lengkap"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.personalInformation.email}
              onChangeText={(value) => handlePersonalInfoChange('email', value)}
              placeholder="Masukkan email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={formData.personalInformation.password}
              onChangeText={(value) =>
                handlePersonalInfoChange('password', value)
              }
              placeholder="Masukkan password"
              keyboardType="default"
              autoCapitalize="none"
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tanggal Lahir</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.input}
            >
              <Text
                style={{
                  color: formData.personalInformation.dateOfBirth
                    ? '#111827'
                    : '#9CA3AF',
                }}
              >
                {formData.personalInformation.dateOfBirth
                  ? formData.personalInformation.dateOfBirth
                  : 'Pilih tanggal lahir'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={
                  formData.personalInformation.dateOfBirth
                    ? new Date(formData.personalInformation.dateOfBirth)
                    : new Date()
                }
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    const iso = selectedDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
                    handlePersonalInfoChange('dateOfBirth', iso);
                  }
                }}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Jenis Kelamin</Text>
            <View style={styles.optionRow}>
              {['M', 'F'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    formData.personalInformation.gender === option &&
                      styles.selectedOption,
                  ]}
                  onPress={() => handlePersonalInfoChange('gender', option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.personalInformation.gender === option &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Status Fisik</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Berat Badan (kg)</Text>
            <TextInput
              style={styles.input}
              value={formData.physicalStats.weight.toString()}
              onChangeText={(value) =>
                handlePhysicalStatsChange('weight', value)
              }
              placeholder="Masukkan berat badan"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tinggi Badan (cm)</Text>
            <TextInput
              style={styles.input}
              value={formData.physicalStats.height.toString()}
              onChangeText={(value) =>
                handlePhysicalStatsChange('height', value)
              }
              placeholder="Masukkan tinggi badan"
              keyboardType="numeric"
            />
          </View>
        </Card>

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Gaya Hidup</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tingkat Aktivitas</Text>
            <View style={styles.optionColumn}>
              {activitiesData.map((activity) => (
                <TouchableOpacity
                  key={activity.id}
                  style={[
                    styles.activityOption,
                    formData.lifestyle.activityLevelId === activity.id &&
                      styles.selectedOption,
                  ]}
                  onPress={() =>
                    handleLifestyleChange('activityLevelId', activity.id)
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.lifestyle.activityLevelId === activity.id &&
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
                    formData.lifestyle.primaryGoalId === goal.id &&
                      styles.selectedOption,
                  ]}
                  onPress={() =>
                    handleLifestyleChange('primaryGoalId', goal.id)
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.lifestyle.primaryGoalId === goal.id &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {goal.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        <TouchableOpacity
          style={[styles.continueButton, !isFormValid && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!isFormValid}
        >
          <Text
            style={[styles.continueText, !isFormValid && styles.disabledText]}
          >
            {pending ? 'Loading...' : 'Lanjut'}
          </Text>
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
  },
  formCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
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
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
  continueButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 24,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: '#9CA3AF',
  },
});
