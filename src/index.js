// @ts-check
import './scss/app.scss';
import 'bootstrap';

import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import getTranslation from './getTranslation';
import render from './render';

const form = document.querySelector('.form-inline');
const input = form.querySelector('input');

const state = {
  value: '',
  isUrlValid: true,
  urls: [],
  error: '',
};

const watched = onChange(state, (path) => {
  if ((path !== 'urls') && (path !== 'error')) { return; }

  render(state);
});

const schema = yup.string().url().required();

form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  state.value = input.value;

  schema.validate(state.value)
    .then(() => {
      if (state.urls.includes(state.value)) {
        watched.isUrlValid = false;
        i18next.init(getTranslation).then(() => {
          watched.error = i18next.t('errExistUrl');
        });
      } else {
        watched.isUrlValid = true;
        watched.urls.push(state.value);
        input.value = '';
      }
    })
    .catch(({ errors: [err] }) => {
      watched.isUrlValid = false;
      watched.error = err;
    });

  state.error = '';
});
