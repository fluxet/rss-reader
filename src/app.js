import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import axios from 'axios';
import i18next from 'i18next';
import initTranslation from './initTranslation';
import render from './render';
import parse from './utils';

const requestDelay = 5000;

export default () => {
  initTranslation();

  const form = document.querySelector('.form-inline');

  const state = {
    mode: 'waiting',
    urls: [],
    error: 'startValue',
    channels: {},
    urlValue: '',
  };

  const watched = onChange(state, (path) => render(state, path));
  const schema = yup.string().url().required();

  const getData = (url) => {
    axios.get(`https://cors-anywhere.herokuapp.com/${url}`)
      .then(({ data }) => {
        watched.error = '';
        const { headerContent, posts } = parse(data);
        const oldPosts = watched.channels[url]?.posts;
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

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    watched.mode = 'blocked';
    const { urlValue } = watched;

    schema.validate(urlValue)
      .then(() => {
        if (watched.urls.includes(urlValue)) {
          watched.isUrlValid = false;
          watched.error = i18next.t('errExistUrl');

          watched.mode = 'invalid';
        } else {
          watched.error = '';
          watched.isUrlValid = true;
          watched.urls.push(urlValue);

          const currentUrl = watched.urls[watched.urls.length - 1];
          getData(currentUrl);

          watched.mode = 'valid';
        }
      })
      .catch(({ errors: [err] }) => {
        watched.error = err;
        watched.mode = 'invalid';
      });
  });

  form.url.addEventListener('input', () => {
    watched.urlValue = form.url.value;
    watched.mode = 'waiting';
  });
};
