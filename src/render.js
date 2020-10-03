// @ts-check
import i18next from 'i18next';

const renderValidation = (message) => {
  const container = document.querySelector('.container');
  const domElementFeedback = container.querySelector('.feedback');
  const domElementInput = container.querySelector('input');

  if (message === '') {
    domElementInput.value = '';

    domElementInput.classList.remove('is-invalid');
    domElementFeedback.classList.remove('text-danger');
    domElementFeedback.classList.add('text-success');
    domElementFeedback.textContent = i18next.t('responseSuccess');
    return;
  }
  domElementInput.classList.add('is-invalid');
  domElementFeedback.classList.add('text-danger');
  domElementFeedback.classList.remove('text-success');
  domElementFeedback.textContent = message;
};

const renderChannels = (channels) => {
  const container = document.querySelector('.rss-container');
  container.textContent = '';

  const channelContents = Object.values(channels);
  channelContents.forEach(({ headerContent, posts }) => {
    const header = document.createElement('h2');
    header.textContent = headerContent;
    container.append(header);

    posts.forEach(({ title, link }) => {
      const domItem = document.createElement('div');
      const domLink = document.createElement('a');
      domLink.textContent = title;
      domLink.href = link;
      domItem.append(domLink);
      container.append(domItem);
    });
  });
};

const renderInputEnabling = (isFormDisabled) => {
  const domElementSubmitBtn = document.querySelector('button[type="submit"]');

  if (isFormDisabled) {
    domElementSubmitBtn.setAttribute('disabled', '');
    return;
  }
  domElementSubmitBtn.removeAttribute('disabled');
};

export default (state, path) => {
  const stateKey = path.split('.')[0];
  switch (stateKey) {
    case 'isFormDisabled': return renderInputEnabling(state.isFormDisabled);
    case 'error': return renderValidation(state.error);
    case 'channels': return renderChannels(state.channels);
    default: return null;
  }
};
