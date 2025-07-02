import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');
const PADDING = 16;

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    'BalooBhaijaan2-Regular': require('../../assets/fonts/BalooBhaijaan2-Regular.ttf'),
    'BalooBhaijaan2-SemiBold': require('../../assets/fonts/BalooBhaijaan2-SemiBold.ttf'),
  });
  if (!fontsLoaded) return null;

  const handleNavigate = (key: string) => {
    if (key === 'home') {
      router.push('/dashboard');
    } else if (key === 'profile') {
      router.push('/profile');
    } else if (key === 'logout') {
      router.push('/login'); // Redirect to login.tsx
    } else {
      router.push(`/${key}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + -15 }]}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('../../assets/images/logo-no-text.png')} style={styles.logo} />
          <Text style={styles.headerTitle}>الملف الشخصي</Text>
          <TouchableOpacity style={styles.menuButton} onPress={() => handleNavigate('menu')}>
            <Image source={require('../../assets/images/menu.png')} style={styles.menuIcon} />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.profileAvatarWrapper}>
          <View style={styles.avatarCircle}>
            <Image source={require('../../assets/images/profile-avatar.png')} style={styles.avatarIcon} />
          </View>
        </View>

        {/* Parent Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Image source={require('../../assets/images/back.png')} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>ولي الأمر</Text>
            <Image source={require('../../assets/images/user-black.png')} style={styles.sectionIcon} />
          </View>
          <Text style={styles.detailText}>الاسم: إبراهيم ياسر</Text>
          <Text style={styles.detailText}>رقم الهوية: 123456789</Text>
          <Text style={styles.detailText}>البريد الإلكتروني: ky123@gmail.com</Text>
          <Text style={styles.detailText}>رقم الهاتف: 12345678</Text>
        </View>
        <View style={styles.divider} />

        {/* Child Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Image source={require('../../assets/images/back.png')} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>الطفل</Text>
            <Image source={require('../../assets/images/people.png')} style={styles.sectionIcon} />
          </View>
          <Text style={styles.detailText}>الاسم: خالد إبراهيم</Text>
          <Text style={styles.detailText}>رقم الهوية: 123456789</Text>
        </View>
        <View style={styles.divider} />

        {/* Settings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Image source={require('../../assets/images/back.png')} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>الإعدادات</Text>
            <Image source={require('../../assets/images/settings.png')} style={styles.sectionIcon} />
          </View>
          <Text style={styles.detailText}>اللغة: العربية</Text>
          <Text style={styles.detailText}>الاشعارات: فعالة</Text>
        </View>
        <View style={styles.divider} />

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => handleNavigate('logout')}>
          <Image source={require('../../assets/images/back.png')} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>تسجيل خروج</Text>
          <Image source={require('../../assets/images/logout.png')} style={styles.logoutIcon} />
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleNavigate('home')}
        >
          <Image
            source={require('../../assets/images/home-unselected.png')}
            style={styles.bottomIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleNavigate('profile')}
        >
          <Image
            source={require('../../assets/images/profile-selected.png')}
            style={styles.bottomIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING,
    paddingVertical: 12,
  },
logo: {
  width: 50,
  height: 50,
  resizeMode: 'contain',
},
  headerTitle: {
  flex: 1,
  textAlign: 'center',
  fontSize: 24,
  fontFamily: 'BalooBhaijaan2-SemiBold',
  color: '#222',
  fontWeight: '600',
},
  menuButton: {
    padding: 4, // match dashboard.tsx
  },
  menuIcon: {
    width: 30, // match dashboard.tsx
    height: 30, // match dashboard.tsx
    resizeMode: 'contain',
  },
  profileAvatarWrapper: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  section: {
    paddingVertical: 16,
    paddingHorizontal: PADDING,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'flex-end',
  },
  sectionIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginLeft: 4,
    marginRight: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'BalooBhaijaan2-SemiBold',
    color: '#000',
    marginLeft: 8,
    textAlign: 'right',
  },
  detailText: {
    fontSize: 18, // changed from 20 to 18
    fontFamily: 'BalooBhaijaan2-Regular',
    color: '#222',
    writingDirection: 'rtl',
    marginBottom: 2, // reduced from 4 to 2 for tighter spacing
    textAlign: 'right',
    lineHeight: 28, // slightly reduced for less vertical space
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#CCC',
    marginVertical: -5, // reduced from 16 to 8 for less space between sections
    marginHorizontal: PADDING,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 12, // reduced from 16 to 12
    paddingHorizontal: PADDING,
    marginTop: 8,
  },
  logoutIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#D00',
    marginLeft: 4,
  },
  logoutText: {
    fontSize: 20,
    fontFamily: 'BalooBhaijaan2-SemiBold',
    color: '#D00',
    marginLeft: 8,
    textAlign: 'right',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#003366',
    height: 60,
  },
  navButton: {
    padding: 8,
  },
  bottomIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: undefined,
  },
});
