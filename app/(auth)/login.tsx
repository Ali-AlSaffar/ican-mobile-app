import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [cpr, setCpr] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    router.replace('/dashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Image source={require('../../assets/images/logo-main.png')} style={styles.logo} />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>تسجيل دخول</Text>
        <Text style={styles.subtitle}>ادخل رقم الهوية و كلمة السر</Text>
        <View style={styles.formWrapper}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>رقم الهوية</Text>
            <Input
              placeholder="ادخل رقم الهوية"
              value={cpr}
              onChangeText={setCpr}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>كلمة السر</Text>
            <Input
              placeholder="ادخل كلمة السر"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <TouchableOpacity>
            <Text style={styles.forgot}>نسيت كلمة السر؟</Text>
          </TouchableOpacity>
          <Button title="تسجيل دخول" onPress={handleLogin} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoWrapper: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#003366',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formWrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
    color: '#FCFCFC',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#FCFCFC',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#0F0F0F',
    marginBottom: 4,
    textAlign: 'right',
    fontWeight: '500',
  },
  forgot: {
    color: '#126DB6',
    textAlign: 'center',
    marginBottom: 16,
  },
});
