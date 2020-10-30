// @ts-check
import i18next from 'i18next';

export default (data) => {
  const parser = new DOMParser();
  const dataDom = parser.parseFromString(data, 'application/xml');

  const headerContent = dataDom.querySelector('channel > title')?.textContent;

  if (!headerContent) {
    throw new Error(i18next.t('errInvalidRss'));
  }

  const posts = [...dataDom.querySelectorAll('item')].map((item) => {
    const link = item.querySelector('link').textContent;
    const title = item.querySelector('title').textContent;
    return ({ title, link });
  });

  return { posts, headerContent };
};
