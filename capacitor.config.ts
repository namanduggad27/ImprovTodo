import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.improvtodo.app',
  appName: 'ImprovTodo',
  webDir: 'dist',
  android: {
    backgroundColor: '#F9FAFB',
    allowMixedContent: true,
    captureInput: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#F9FAFB',
      showSpinner: false
    }
  }
};

export default config;
