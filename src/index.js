// @ts-check
import './scss/app.scss';
import 'bootstrap';

import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import getTranslation from './getTranslation';
import render from './render';

const domElementForm = document.querySelector('.form-inline');
const domElementInput = domElementForm.querySelector('input');
const domElementSubmitBtn = domElementForm.querySelector('button[type="submit"]');

const state = {
  value: '',
  isUrlValid: true,
  urls: [],
  error: '',
  btnDisableChanger: 0,
};

const watched = onChange(state, (path) => {
  if (path === 'btnDisableChanger') {
    domElementSubmitBtn.removeAttribute('disabled');
    return;
  }
  if ((path !== 'urls') && (path !== 'error')) {
    return;
  }
  render(state);
});

const schema = yup.string().url().required();

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
        watched.isUrlValid = true;
        watched.urls.push(state.value);
      }
    })
    .catch(({ errors: [err] }) => {
      watched.isUrlValid = false;
      watched.error = err;
    });

  state.error = '';
});

domElementInput.addEventListener('change', () => {
  watched.btnDisableChanger += 1;
});
