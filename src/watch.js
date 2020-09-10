// @ts-check
import { renderHeader, renderValidation, renderPosts } from './render';

const domElementSubmitBtn = document.querySelector('button[type="submit"]');

export default (state, path) => {
  switch (path) {
    case 'btnDisableChanger': return domElementSubmitBtn.removeAttribute('disabled');
    case 'error': return renderValidation(state.error);
    case 'newHeaderContent': return renderHeader(state.newHeaderContent);
    case 'newPosts': return renderPosts(state.newPosts);
    default: return null;
  }
};
