// @ts-check

const parse = (data) => {
  const parser = new DOMParser();
  const dataDom = parser.parseFromString(data, 'application/xml');
  console.log('dataDom: ', dataDom);

  const headerContent = dataDom.querySelector('channel > title').textContent;

  const titles = [...dataDom.querySelectorAll('item title')].map((el) => el.textContent);
  const links = [...dataDom.querySelectorAll('item link')].map((el) => el.textContent);
  const posts = titles.map((el, i) => ({ text: el, link: links[i] }));
  console.log(posts);

  return { posts, headerContent };
};

export default parse;
