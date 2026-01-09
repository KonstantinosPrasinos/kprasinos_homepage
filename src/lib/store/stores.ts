import { persistedStore } from './persistedStore';

interface AppSettings {
  isLightMode: boolean;
  isNormal: boolean;
}

export const settings = persistedStore<AppSettings>('user-settings', {
  isLightMode: false,
  isNormal: true
});