// @ts-check
import onChange from 'on-change';
import axios from 'axios';
import watch from './watch';
import { parse, getNewPosts } from './utils';

const requestDelay = 5000;

export default (url) => {
  const state = {
    error: 'startValue',
    posts: [],
    newPosts: [],
    headerContents: [],
    newHeaderContent: '',
  };

  const watched = onChange(state, (path) => watch(state, path));

  const getData = () => {
    axios.get(`https://cors-anywhere.herokuapp.com/${url}`)
      .then(({ data }) => {
        watched.error = '';

        const rssContent = parse(data);
        const { headerContent, posts } = rssContent;

        if (!state.headerContents.includes(headerContent)) {
          watched.newHeaderContent = headerContent;
          watched.headerContents.push(headerContent);
        }

        const newPosts = getNewPosts(state.posts, posts);
        state.posts.push(...newPosts);
        watched.newPosts = newPosts;
      })
      .catch((err) => {
        watched.error = err;
      })
      .finally(setTimeout.bind(null, getData, requestDelay));
  };

  getData();
};
