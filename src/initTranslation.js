import i18next from 'i18next';

// @ts-check
export default () => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources: {
      en: {
        translation: {
          responseSuccess: 'Rss has been loaded',
        },
      },
    },
  });
};
