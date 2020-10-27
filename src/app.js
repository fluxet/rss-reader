import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import axios from 'axios';
import initTranslation from './initTranslation';
import render from './render';
import parse from './utils';

const requestDelay = 5000;

export default () => {
  initTranslation();

  const form = document.querySelector('.form-inline');

  const state = {
    modeInput: 'filling',
    modeValidation: '',
    urls: [],
    error: 'startValue',
    channels: [],
    urlValue: '',
  };

  const watched = onChange(state, (path) => render(state, path));

  const getData = (url) => {
    axios.get(`https://cors-anywhere.herokuapp.com/${url}`)
      .then(({ data }) => {
        const channelIndex = watched.channels.findIndex((channel) => channel.url === url);
        const currentIndex = (channelIndex >= 0) ? channelIndex : watched.channels.length;

        const { headerContent, posts } = parse(data);
        const oldPosts = watched.channels[currentIndex]?.posts;
        const newPosts = _.unionWith(posts, oldPosts, _.isEqual);

        const updatedChannel = { url, headerContent, posts: newPosts };
        watched.channels[currentIndex] = updatedChannel;
      })
      .catch((err) => {
        watched.error = err;
        watched.modeValidation = 'invalid';
      })
      .finally(() => {
        setTimeout(() => getData(url), requestDelay);
      });
  };

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    watched.modeInput = 'blocked';
    watched.modeValidation = 'valid';
    const { urlValue } = watched;

    const schema = yup.string().url().required().notOneOf(watched.urls);
    schema.validate(urlValue)
      .then(() => {
        watched.error = '';
        watched.urls.push(urlValue);
        getData(urlValue);
        watched.modeValidation = 'valid';
      })
      .catch(({ errors: [err] }) => {
        watched.error = err;
        watched.modeValidation = 'invalid';
      });
  });

  form.url.addEventListener('input', () => {
    watched.urlValue = form.url.value;
    watched.modeInput = 'filling';
  });
};
