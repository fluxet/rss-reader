// @ts-check
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import getTranslation from './getTranslation';
import watch from './watch';

const domElementForm = document.querySelector('.form-inline');
const domElementInput = domElementForm.querySelector('input');

export default () => {
  const state = {
    value: '',
    isUrlValid: true,
    urls: [],
    error: '',
    btnDisableChanger: 0,
  };

  const watched = onChange(state, (path) => watch(state, path));
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
};
