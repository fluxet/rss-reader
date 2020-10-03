import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import axios from 'axios';
import i18next from 'i18next';
import getTranslation from './getTranslation';
import render from './render';
import parse from './utils';

const requestDelay = 5000;

export default () => {
  const domElementForm = document.querySelector('.form-inline');
  const domElementInput = domElementForm.querySelector('input');

  getTranslation();

  const state = {
    isUrlValid: false,
    urls: [],
    error: 'startValue',
    channels: {},
    isFormDisabled: false,
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
        watched.isFormDisabled = true;
      })
      .finally(() => {
        setTimeout(() => getData(url), requestDelay);
      });
  };

  domElementForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const inputValue = domElementInput.value;

    schema.validate(inputValue)
      .then(() => {
        if (state.urls.includes(inputValue)) {
          watched.isUrlValid = false;
          watched.error = i18next.t('errExistUrl');
          watched.isFormDisabled = true;
        } else {
          watched.error = '';
          watched.isFormDisabled = false;
          watched.isUrlValid = true;
          watched.urls.push(inputValue);

          const currentUrl = state.urls[state.urls.length - 1];
          getData(currentUrl);
        }
      })
      .catch(({ errors: [err] }) => {
        watched.isUrlValid = false;
        watched.error = err;
        watched.isFormDisabled = true;
      });
  });

  domElementInput.addEventListener('input', () => {
    watched.isFormDisabled = false;
  });
};
