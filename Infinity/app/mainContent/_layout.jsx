import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import 'react-native-reanimated';
import '@/i18next/i18.js';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme, ThemeProvider } from '@/context/themeContext';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar as RNStatusBar, View } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

function ThemedLayout() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const theme = useTheme();
  const isDark = theme?.isDark ?? false;
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "#242424" , paddingTop: hp("3%"),}}>
      <Tabs
        screenOptions={{
          headerShown: false,
          animation: "shift",
          tabBarStyle: {
            backgroundColor: isDark ? "#0676b9" : "#0398D5",
            borderTopColor: "#333",
            height: hp("9%") + insets.bottom,
            display: isVisible ? "flex" : "none",
            paddingBottom: insets.bottom + hp("0.5%"),
            paddingTop: hp("1%"),
          },
          tabBarLabelStyle: { fontSize: hp("1.2%") },
          tabBarIconStyle: { marginBottom: 0 },
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "#333",
        }}
      >
        <Tabs.Screen
          name="createLabel"
          options={{
            title: t("Tabs.createLabel"),
            tabBarIcon: ({ color }) => (
              <Ionicons name="print-outline" color={color} size={hp("3%")} />
            ),
          }}
        />
        <Tabs.Screen
          name="modifyPrice"
          options={{
            title: t("Tabs.modifyPrice"),
            tabBarIcon: ({ color }) => (
              <Ionicons name="pricetag-outline" color={color} size={hp("3%")} />
            ),
          }}
        />
      </Tabs>
      <StatusBar style="light" />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider >
        <ThemedLayout />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}