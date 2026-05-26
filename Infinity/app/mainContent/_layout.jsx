import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import 'react-native-reanimated';
import '@/i18next/i18.js';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ThemeProvider, useTheme } from '@/context/themeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function ThemedLayout() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const { isDark } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#242424" }}>
      <Tabs screenOptions={{
        animation: "shift",
        tabBarStyle: {
          backgroundColor : isDark ? "#0676b9" : "#0398D5", 
          borderTopColor: "#333",
          height: hp("9%"),
          display: isVisible ? "flex" : "none",
          paddingBottom: hp("1.5%"),
          paddingTop: hp("1%"),
        },
        tabBarLabelStyle: {
          fontSize: hp("1.2%"),
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#333",
      }}>
        <Tabs.Screen name="createLabel" options={{ headerShown: false, title: t("Tabs.createLabel"), tabBarIcon: ({ color }) => (
          <Ionicons name="print-outline" color={color} size={hp("3%")} />
        )}} />
        <Tabs.Screen name="modifyPrice" options={{ headerShown: false, title: t("Tabs.modifyPrice"), tabBarIcon: ({ color }) => (
          <Ionicons name="pricetag-outline" color={color} size={hp("3%")} />
        )}} />
      </Tabs>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedLayout />
    </ThemeProvider>
  );
} 