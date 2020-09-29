// @ts-check
import * as yup from 'yup';
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
    btnDisableChanger: 0,
  };

  const watched = onChange(state, (path) => render(state, path));
  const schema = yup.string().url().required();

  const getData = (url) => {
    axios.get(`https://cors-anywhere.herokuapp.com/${url}`)
      .then(({ data }) => {
        watched.error = '';
        watched.channels[url] = parse(data);
      })
      .catch((err) => {
        watched.error = err;
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
        } else {
          watched.error = '';
          watched.isUrlValid = true;
          watched.urls.push(inputValue);

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
