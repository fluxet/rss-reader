// @ts-check
import _ from 'lodash';

export const parse = (data) => {
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

export const getNewPosts = (oldPosts, currentPosts) => currentPosts
  .filter((currentPost) => oldPosts
    .filter((oldPost) => _.isEqual(currentPost, oldPost)).length === 0);
