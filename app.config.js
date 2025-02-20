// app.config.js
// when using keys from supabase, use EXPO_PUBLIC_ prefix
export default {
    expo: {
     extra: {
        SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
        SUPABASE_KEY: process.env.EXPO_PUBLIC_SUPABASE_KEY,
      },
      name: "FoodCourt",
      slug: "FoodCourt",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/Logo.png",
      scheme: "myapp",
      userInterfaceStyle: "automatic",
      newArchEnabled: true,
      ios: {
        supportsTablet: true,
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/images/Logo.png",
          backgroundColor: "#ff6f61",
        },
      },
      web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/images/Logo.png",
      },
      plugins: [
        "expo-router",
        [
          "expo-splash-screen",
          {
            image: "./assets/images/Logo.png",
            imageWidth: 200,
            resizeMode: "contain",
            backgroundColor: "#ff6f61",
          },
        ],
      ],
      experiments: {
        typedRoutes: true,
      },
    },
  };
  