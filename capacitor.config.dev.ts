import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cucumutugi.app',
  appName: 'cucumutugi',
  webDir: 'public',
  server: {
    url: 'https://cucu-mutugi-r0422oav3-brandon-allan-s-projects.vercel.app',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
