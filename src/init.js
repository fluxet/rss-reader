// @ts-check
import * as yup from 'yup';
import onChange from 'on-change';
import render from './render';

export default () => console.log('hello from module2 version5');

const form = document.querySelector('.form-inline');
const input = form.querySelector('input');

const state = {
  value: '',
  isUrlValid: true,
  urls: [],
  error: '',
};

const watched = onChange(state, render.bind(null, state));

const schema = yup.string().url().required();

form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  state.value = input.value;

  schema.validate(state.value)
    .then(() => {
      if (state.urls.includes(state.value)) {
        watched.isUrlValid = false;
        watched.error = 'url was already added';
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
