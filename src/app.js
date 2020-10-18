import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import axios from 'axios';
import i18next from 'i18next';
import render from './render';
import parse from './utils';

const requestDelay = 5000;

export default () => {
  const domElementForm = document.querySelector('.form-inline');
  const domElementInput = domElementForm.querySelector('input');

  const state = {
    mode: 'waiting', // [waiting, blocked, valid, invalid]
    urls: [],
    error: 'startValue',
    channels: {},
  };

  const watched = onChange(state, (path) => render(state, path));
  const schema = yup.string().url().required();

  const getData = (url) => {
    axios.get(`https://cors-anywhere.herokuapp.com/${url}`)
      .then(({ data }) => {
        watched.error = '';
        const { headerContent, posts } = parse(data);
        const oldPosts = state.channels[url]?.posts;
        const newPosts = _.unionWith(posts, oldPosts, _.isEqual);

        watched.channels[url] = { headerContent, posts: newPosts };
      })
      .catch((err) => {
        watched.error = err;
        watched.mode = 'invalid';
      })
      .finally(() => {
        setTimeout(() => getData(url), requestDelay);
      });
  };

  domElementForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    watched.mode = 'blocked';
    const inputValue = domElementInput.value;

    schema.validate(inputValue)
      .then(() => {
        if (state.urls.includes(inputValue)) {
          watched.isUrlValid = false;
          watched.error = i18next.t('errExistUrl');

          watched.mode = 'invalid';
        } else {
          watched.error = '';
          watched.isUrlValid = true;
          watched.urls.push(inputValue);

          const currentUrl = state.urls[state.urls.length - 1];
          getData(currentUrl);

          watched.mode = 'valid';
        }
      })
      .catch(({ errors: [err] }) => {
        watched.error = err;
        watched.mode = 'invalid';
      });
  });

  domElementInput.addEventListener('input', () => {
    watched.mode = 'waiting';
  });
};
