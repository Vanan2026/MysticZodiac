export default {
  expo: {
    name: "Mystic Fate",
    slug: "mystic-fate",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "mystic-fate",
    userInterfaceStyle: "dark",
    newArchEnabled: true,
    splash: {
      backgroundColor: "#0A0A0F",
      resizeMode: "contain",
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.mysticfate.app",
      infoPlist: {
        NSCameraUsageDescription: "Used to capture profile photos",
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#0A0A0F",
      },
      package: "com.mysticfate.app",
      versionCode: 1,
    },
    plugins: [
      "expo-router",
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 34,
            targetSdkVersion: 34,
          },
          ios: {
            deploymentTarget: "16.4",
          },
        },
      ],
      "expo-status-bar",
      "expo-splash-screen",
      "expo-web-browser",
      "./plugins/with-gradle-version",
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
