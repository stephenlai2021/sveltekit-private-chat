import i18n from 'sveltekit-i18n';
import lang from './lang.json'

export const config = {
  i18n: {
    en: { lang },
    zhTW: { lang },
  },
  loaders: [
    {
      locale: 'en',
      key: 'menu',
      loader: async () => (await import('./en/menu.json')).default,
    },
    {
      locale: 'zh-TW',
      key: 'menu',
      loader: async () => (await import('./zhTW/menu.json')).default,
    },
  ],
};

export const { t, loading, locales, locale, loadTranslations } = new i18n(config);