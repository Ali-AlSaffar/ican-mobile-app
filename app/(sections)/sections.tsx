import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Layout constants
const { width: screenWidth } = Dimensions.get('window');
const PADDING = 16;
const GAP = 16;
const NUM_COLS = 3;
const ITEM_SIZE = (screenWidth - PADDING * 2 - GAP * (NUM_COLS - 1)) / NUM_COLS;

// Sections & Services items
const sections = [
  { key: 'tarbeya',        label: 'تربية خاصة',         icon: require('../../assets/images/special-ed.png') },
  { key: 'therapy',        label: 'العلاج\nالوظيفي',    icon: require('../../assets/images/occupational-therapy.png') }, // <-- two lines
  { key: 'speech',         label: 'النطق واللغة',        icon: require('../../assets/images/pronounce.png') },
  { key: 'summer',         label: 'البرنامج الصيفي',    icon: require('../../assets/images/summer-activities.png') },
  { key: 'familyGuide',    label: 'ارشاد اسري',         icon: require('../../assets/images/family-guide.png') },
];

export default function SectionsScreen() {
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
    } else {
      router.push(`/${key}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + -5 }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => handleNavigate('home')}
          >
            <Image
              source={require('../../assets/images/back.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>الأقسام والخدمات</Text>
          <TouchableOpacity style={styles.menuButton} onPress={() => handleNavigate('menu')}>
            <Image source={require('../../assets/images/menu.png')} style={styles.menuIcon} />
          </TouchableOpacity>
        </View>

        {/* Grid of sections */}
        <View style={styles.gridContainer}>
          {sections.map((item, index) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.gridItem,
                {
                  width: ITEM_SIZE,
                  height: ITEM_SIZE,
                  marginRight: (index + 1) % NUM_COLS === 0 ? 0 : GAP,
                  marginBottom: GAP,
                }
              ]}
              activeOpacity={0.7}
              onPress={() => handleNavigate(item.key)}
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
          onPress={() => handleNavigate('home')}
        >
          <Image
            source={require('../../assets/images/home-selected.png')}
            style={styles.bottomIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleNavigate('profile')}
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
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0, // Changed from PADDING to 0 to minimize right padding
    paddingVertical: 0,
    paddingBottom: 12, // Compensate for dashboard logo space
    position: 'relative',
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'BalooBhaijaan2-SemiBold',
    color: '#222',
    fontWeight: '600',
    zIndex: 1,
  },
  menuButton: {
    position: 'absolute',
    left: 322,           // Move to the left side
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 54,
    height: 54,
    zIndex: 2,
  },
  menuIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: PADDING,
    paddingTop: 18, // Increased from 8 to 32 to move the grid further down
  },
  gridItem: {
    backgroundColor: '#126DB6',
    borderRadius: 16, // match dashboard
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  navButton: {
    padding: 8,
  },
  navButtonActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },
  bottomIcon: {
    width: 28,
    height: 28,
    tintColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 54,
    height: 54,
    zIndex: 2,
  },
  backIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});
