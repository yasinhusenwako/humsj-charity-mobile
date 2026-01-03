import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { App } from "@capacitor/app";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Network } from "@capacitor/network";
import { PushNotifications } from "@capacitor/push-notifications";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";

export class MobileService {
  static isNative() {
    return Capacitor.isNativePlatform();
  }

  static isPlatform(platform) {
    return Capacitor.getPlatform() === platform;
  }

  // App Lifecycle
  static async initializeApp() {
    if (this.isNative()) {
      await SplashScreen.hide();
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: "#1687022" });

      // Add app state listeners
      App.addListener("appStateChange", ({ isActive }) => {
        console.log("App state changed. Is active?", isActive);
      });

      App.addListener("backButton", () => {
        // Handle Android back button
        if (window.history.length > 1) {
          window.history.back();
        } else {
          App.exitApp();
        }
      });
    }
  }

  // Haptic Feedback
  static async hapticImpact(style = ImpactStyle.Medium) {
    if (this.isNative()) {
      await Haptics.impact({ style });
    }
  }

  static async hapticNotification() {
    if (this.isNative()) {
      await Haptics.notification();
    }
  }

  // Network Status
  static async getNetworkStatus() {
    if (this.isNative()) {
      const status = await Network.getStatus();
      return {
        connected: status.connected,
        connectionType: status.connectionType,
      };
    }
    return { connected: navigator.onLine, connectionType: "unknown" };
  }

  static async addNetworkListener(callback) {
    if (this.isNative()) {
      Network.addListener("networkStatusChange", callback);
    } else {
      window.addEventListener("online", () =>
        callback({ connected: true, connectionType: "online" })
      );
      window.addEventListener("offline", () =>
        callback({ connected: false, connectionType: "offline" })
      );
    }
  }

  // Push Notifications
  static async requestPushNotifications() {
    if (!this.isNative()) return false;

    try {
      const permission = await PushNotifications.requestPermissions();
      if (permission.receive === "granted") {
        await PushNotifications.register();
        return true;
      }
    } catch (error) {
      console.error("Push notification error:", error);
    }
    return false;
  }

  static async addPushNotificationListeners() {
    if (!this.isNative()) return;

    PushNotifications.addListener("registration", (token) => {
      console.log("Push registration success, token: " + token.value);
      // Send this token to your server
    });

    PushNotifications.addListener("registrationError", (error) => {
      console.error("Error on registration: " + JSON.stringify(error.error));
    });

    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        console.log(
          "Push notification received: " + JSON.stringify(notification)
        );
      }
    );

    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        console.log("Push notification action performed", notification);
      }
    );
  }

  // Camera
  static async takePhoto() {
    if (!this.isNative()) return null;

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });
      return image.webPath || null;
    } catch (error) {
      console.error("Camera error:", error);
      return null;
    }
  }

  static async pickImage() {
    if (!this.isNative()) return null;

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });
      return image.webPath || null;
    } catch (error) {
      console.error("Gallery error:", error);
      return null;
    }
  }

  // File System
  static async saveFile(data, filename) {
    if (!this.isNative()) return null;

    try {
      const result = await Filesystem.writeFile({
        path: filename,
        data: data,
        directory: Directory.Documents,
      });
      return result.uri;
    } catch (error) {
      console.error("File save error:", error);
      return null;
    }
  }

  static async readFile(filename) {
    if (!this.isNative()) return null;

    try {
      const result = await Filesystem.readFile({
        path: filename,
        directory: Directory.Documents,
      });
      return result.data;
    } catch (error) {
      console.error("File read error:", error);
      return null;
    }
  }

  // App Info
  static async getAppInfo() {
    if (this.isNative()) {
      const info = await App.getInfo();
      return {
        version: info.version,
        build: info.build,
      };
    }
    return { version: "1.0.0", build: "web" };
  }
}

export default MobileService;
