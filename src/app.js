// @ts-check
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import getTranslation from './getTranslation';
import watch from './watch';
import { parse, getNewPosts } from './utils';

const domElementForm = document.querySelector('.form-inline');
const domElementInput = domElementForm.querySelector('input');
const requestDelay = 5000;

export default () => {
  const state = {
    value: '',
    isUrlValid: false,
    urls: [],
    error: 'startValue',
    posts: [],
    newPosts: [],
    headerContents: [],
    newHeaderContent: '',
    btnDisableChanger: 0,
  };

  const watched = onChange(state, (path) => watch(state, path));
  const schema = yup.string().url().required();

  const getData = (url) => {
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
      .finally(setTimeout
        .bind(null, getData.bind(null, url), requestDelay));
  };

  domElementForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    state.value = domElementInput.value;

    schema.validate(state.value)
      .then(() => {
        if (state.urls.includes(state.value)) {
          watched.isUrlValid = false;
          i18next.init(getTranslation).then(() => {
            watched.error = i18next.t('errExistUrl');
          });
        } else {
          watched.error = '';
          watched.isUrlValid = true;
          watched.urls.push(state.value);

          const currentUrl = state.urls[state.urls.length - 1];
          getData(currentUrl);
        }
      })
      .catch(({ errors: [err] }) => {
        watched.isUrlValid = false;
        watched.error = err;
      });
  });

  domElementInput.addEventListener('input', () => {
    watched.btnDisableChanger += 1;
  });
};
