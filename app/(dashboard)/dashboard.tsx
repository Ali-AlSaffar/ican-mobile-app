import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');
const PADDING = 16;
const GAP = 16;
const NUM_COLS = 3;
const ITEM_SIZE = (screenWidth - PADDING * 2 - GAP * (NUM_COLS - 1)) / NUM_COLS;

// Group items for two-line labels
const items = [
  { key: 'sections',     label: 'الأقسام و الخدمات',  icon: require('../../assets/images/section.png') },
  { key: 'profile',      label: 'ملف الطالب',         icon: require('../../assets/images/file.png') },
  { key: 'attendance',   label: 'الحضور\nوالتأخير',    icon: require('../../assets/images/attendance.png') },
  { key: 'jobs',         label: 'الوظائف',            icon: require('../../assets/images/briefcase.png') },
  { key: 'payments',     label: 'المعاملات\nالمالية',   icon: require('../../assets/images/payment.png') },
  { key: 'notebook',     label: 'الدفتر',              icon: require('../../assets/images/book.png') },
  { key: 'announcements',label: 'اعلانات',            icon: require('../../assets/images/news.png') },
  { key: 'suggestions',  label: 'مقترحات',            icon: require('../../assets/images/suggestions.png') },
  { key: 'transport',    label: 'مواصلات',           icon: require('../../assets/images/bus.png') },
  { key: 'leave',        label: 'تقديم على\nاجازة',    icon: require('../../assets/images/vacation.png') },
];
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Load the BalooBhaijaan2 font
  const [fontsLoaded] = useFonts({
    'BalooBhaijaan2-Regular': require('../../assets/fonts/BalooBhaijaan2-Regular.ttf'),
    'BalooBhaijaan2-SemiBold': require('../../assets/fonts/BalooBhaijaan2-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Or a loading spinner
  }

  const handlePress = (key: string): void => {
    console.log('Pressed', key);
    router.push(`/${key}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + -15 }]}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('../../assets/images/logo-no-text.png')} style={styles.logo} />
          <Text style={styles.headerTitle}>الصفحة الرئيسية</Text>
          <TouchableOpacity style={styles.menuButton} onPress={() => handlePress('menu')}>
            <Image
              source={require('../../assets/images/menu.png')}
              style={styles.menuIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Grid */}
        <View style={styles.gridContainer}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.gridItem,
                {
                  width: ITEM_SIZE,
                  height: ITEM_SIZE,
                  marginRight: (index + 1) % NUM_COLS === 0 ? 0 : GAP,
                  marginBottom: GAP,
                },
              ]}
              onPress={() => handlePress(item.key)}
              activeOpacity={0.7}
            >
              <View style={styles.gridContent}>
                <View style={styles.iconWrapper}>
                  <Image source={item.icon} style={styles.icon} />
                </View>
                <Text style={styles.itemLabel}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handlePress('home')}
        >
          <Image
            source={require('../../assets/images/home-selected.png')}
            style={styles.bottomIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handlePress('profile')}
        >
          <Image
            source={require('../../assets/images/profile-unselected.png')}
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
    width: 50,      // Increased from 40 to 64
    height: 50,     // Increased from 40 to 64
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
    padding: 4,
  },
  menuIcon: {
    width: 30,    // Decreased size
    height: 30,   // Decreased size
    resizeMode: 'contain',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: PADDING,
    paddingTop: 8,
  },
  gridItem: {
    backgroundColor: '#126DB6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    marginBottom: GAP,
  },
  gridContent: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 0,
    marginTop: 15,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  itemLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 18,
    writingDirection: 'rtl',
    fontFamily: 'BalooBhaijaan2-Regular',
    maxWidth: 90,
    includeFontPadding: false,
    textAlignVertical: 'center',
    minHeight: 36,
    marginBottom: 8,
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
    tintColor: undefined, // Remove tint if your PNGs are colored
  },
});
