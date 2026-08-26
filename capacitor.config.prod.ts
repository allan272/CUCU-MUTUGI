import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cucumutugi.app',
  appName: 'cucumutugi',
  webDir: 'public',
  server: {
    url: 'https://www.cucumutugi.com',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
