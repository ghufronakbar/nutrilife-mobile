import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import Toast from 'react-native-toast-message';
import { tokenContext } from '@/utils/token-context';
import { router } from 'expo-router';
import { userService } from '@/utils/user-service';
import { PostLoginRequest } from '@/models/user/post-login';

export default function ScreenLogin() {
  const [formData, setFormData] = useState<PostLoginRequest>({
    email: '',
    password: '',
  });
  const [pending, setPending] = useState(false);

  const isFormValid =
    formData.email.trim() !== '' &&
    formData.password.trim() !== '' &&
    /^\S+@\S+\.\S+$/.test(formData.email);

  const handleLogin = async () => {
    try {
      if (isFormValid) {
        setPending(true);
        const res = await userService.login(formData);
        await tokenContext.save(res.data.data.accessToken);
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.log('LOGIN ERROR:', error?.response?.data);
      Toast.show({
        type: 'error',
        text1: 'Login Gagal',
        text2: error?.response?.data?.responseMessage || 'Terjadi kesalahan',
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Masuk Akun" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Masukkan email dan password Anda untuk masuk ke akun.
        </Text>

        <Card style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, email: value }))
              }
              placeholder="Masukkan email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, password: value }))
              }
              placeholder="Masukkan password"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.continueButton,
              !isFormValid && styles.disabledButton,
            ]}
            onPress={handleLogin}
            disabled={!isFormValid}
          >
            <Text
              style={[styles.continueText, !isFormValid && styles.disabledText]}
            >
              {pending ? 'Memuat...' : 'Masuk'}
            </Text>
          </TouchableOpacity>
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
  continueButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
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
