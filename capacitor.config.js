import { CapacitorConfig } from "@capacitor/cli";

const config = {
  appId: "com.humsj.charity",
  appName: "HUMSJ Charity",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#1687022",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerStyle: "large",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#1687022",
    },
    App: {
      appendUserAgent: "HUMSJCharity/1.0",
    },
  },
};

export default config;
