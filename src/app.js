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
    form: {
      status: 'filling', // ['filling, 'valid', 'invalid', 'blocked']
      error: null,
      urlValue: '',
    },
    loading: {
      status: 'loading', // ['loading', 'success', 'fail']
      error: null,
    },
    channels: [],
    urls: [],
  };

  const watched = onChange(state, (path) => render(state, path));

  const getData = (url) => {
    watched.loading.error = '';
    watched.loading.status = 'loading';

    axios.get(`https://cors-anywhere.herokuapp.com/${url}`)
      .then(({ data }) => {
        const channelIndex = watched.channels.findIndex((channel) => channel.url === url);
        const currentIndex = (channelIndex >= 0) ? channelIndex : watched.channels.length;

        const { headerContent, posts } = parse(data);
        const oldPosts = watched.channels[currentIndex]?.posts;
        const newPosts = _.unionWith(posts, oldPosts, _.isEqual);
        const updatedChannel = { url, headerContent, posts: newPosts };

        if (headerContent) {
          watched.loading.status = 'success';
          watched.channels[currentIndex] = updatedChannel;
        } else {
          watched.loading.error = i18next.t('errInvalidUrl');
          watched.loading.status = 'fail';
          watched.urls = watched.urls.filter((itemUrl) => itemUrl !== url);
        }
      })
      .catch((err) => {
        watched.loading.error = err;
        watched.loading.status = 'fail';
      })
      .finally(() => {
        if (watched.urls.includes(url)) {
          setTimeout(() => getData(url), requestDelay);
        }
      });
  };

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const { urlValue } = watched.form;

    const schema = yup.string().url().required().notOneOf(watched.urls);
    schema.validate(urlValue)
      .then(() => {
        watched.form.error = '';
        watched.form.status = 'valid';
        watched.urls.push(urlValue);
        getData(urlValue);
        watched.form.status = 'blocked';
      })
      .catch(({ errors: [err] }) => {
        watched.form.error = err;
        watched.form.status = 'invalid';
      });
  });

  form.url.addEventListener('input', () => {
    watched.form.urlValue = form.url.value;
    watched.form.status = 'filling';
  });
};
