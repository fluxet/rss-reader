// @ts-check
import i18next from 'i18next';
import getTranslation from './getTranslation';

const container = document.querySelector('.container');
const domElementFeedback = container.querySelector('.feedback');
const domElementInput = container.querySelector('input');
const domElementSubmitBtn = container.querySelector('button[type="submit"]');

export const renderValidation = (message) => {
  if (message === '') {
    domElementInput.value = '';

    domElementInput.classList.remove('is-invalid');
    domElementFeedback.classList.remove('text-danger');
    domElementFeedback.classList.add('text-success');
    i18next.init(getTranslation).then(() => {
      domElementFeedback.textContent = i18next.t('responseSuccess');
    });
    return;
  }
  domElementInput.classList.add('is-invalid');
  domElementFeedback.classList.add('text-danger');
  domElementFeedback.classList.remove('text-success');
  domElementSubmitBtn.setAttribute('disabled', '');
  domElementFeedback.textContent = message;
};

export const renderPosts = (newPosts) => {
  newPosts.forEach(({ title, link }) => {
    const domItem = document.createElement('div');
    const domLink = document.createElement('a');
    domLink.textContent = title;
    domLink.href = link;
    domItem.append(domLink);
    container.append(domItem);
  });
};

export const renderHeader = (headerContent) => {
  const header = document.createElement('h2');
  header.textContent = headerContent;
  container.append(header);
};
