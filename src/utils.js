// @ts-check
export default (data) => {
  const parser = new DOMParser();
  const dataDom = parser.parseFromString(data, 'application/xml');

  const headerContent = dataDom.querySelector('channel > title').textContent;

  const posts = [...dataDom.querySelectorAll('item')].map((item) => {
    const link = item.querySelector('link').textContent;
    const title = item.querySelector('title').textContent;
    return ({ title, link });
  });

  return { posts, headerContent };
};
