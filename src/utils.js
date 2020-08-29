// @ts-check
import _ from 'lodash';

export const parse = (data) => {
  const parser = new DOMParser();
  const dataDom = parser.parseFromString(data, 'application/xml');

  const headerContent = dataDom.querySelector('channel > title').textContent;

  const titles = [...dataDom.querySelectorAll('item title')].map((el) => el.textContent);
  const links = [...dataDom.querySelectorAll('item link')].map((el) => el.textContent);
  const posts = titles.map((el, i) => ({ text: el, link: links[i] }));

  return { posts, headerContent };
};

export const getNewPosts = (oldPosts, currentPosts) => currentPosts
  .filter((currentPost) => oldPosts
    .filter((oldPost) => _.isEqual(currentPost, oldPost)).length === 0);
