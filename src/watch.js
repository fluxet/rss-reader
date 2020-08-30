// @ts-check
import render from './render';

const domElementSubmitBtn = document.querySelector('button[type="submit"]');

export default (state, path) => {
  if (path === 'btnDisableChanger') {
    domElementSubmitBtn.removeAttribute('disabled');
    return;
  }
  if ((path !== 'urls') && (path !== 'error')) {
    return;
  }
  render(state);
};
