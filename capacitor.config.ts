import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e4f8bfd39a9c4bc4b855628f3f0c0b8f',
  appName: 'wearable-bite-tracker-31',
  webDir: 'dist',
  server: {
    url: 'https://e4f8bfd3-9a9c-4bc4-b855-628f3f0c0b8f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;