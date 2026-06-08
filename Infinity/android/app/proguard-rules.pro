# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# SENİN MODÜLÜN İÇİN KRİTİK KURALLAR
-keep class com.anonymous.Infinity.SunmiModule { *; }
-keep class com.anonymous.Infinity.SunmiPackage { *; }

# SunmiModule içindeki ReactMethod'ları koru
-keepclassmembers class com.anonymous.Infinity.SunmiModule {
    @com.facebook.react.bridge.ReactMethod *;
}