import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vibe.chat',
  appName: 'VibeChat',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
