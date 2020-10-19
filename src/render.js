// @ts-check
import i18next from 'i18next';

export default (state, path) => {
  const elements = {
    container: document.querySelector('.container'),
    containerRss: document.querySelector('.rss-container'),
    feedback: document.querySelector('.feedback'),
    input: document.querySelector('input'),
    submitBtn: document.querySelector('button[type="submit"]'),
  };

  const renderInputEnabling = () => elements.submitBtn.removeAttribute('disabled');
  const renderBlocked = () => elements.submitBtn.setAttribute('disabled', '');

  const renderValid = () => {
    elements.input.value = '';

    elements.input.classList.remove('is-invalid');
    elements.feedback.classList.remove('text-danger');
    elements.feedback.classList.add('text-success');
    elements.feedback.textContent = i18next.t('responseSuccess');
  };

  const renderInvalid = (errorMessage) => {
    elements.input.classList.add('is-invalid');
    elements.feedback.classList.add('text-danger');
    elements.feedback.classList.remove('text-success');
    elements.submitBtn.setAttribute('disabled', '');
    elements.feedback.textContent = errorMessage;
  };

  const renderChannels = () => {
    elements.containerRss.textContent = '';

    const channelContents = Object.values(state.channels);
    channelContents.forEach(({ headerContent, posts }) => {
      const header = document.createElement('h2');
      header.textContent = headerContent;
      elements.containerRss.append(header);

      posts.forEach(({ title, link }) => {
        const domItem = document.createElement('div');
        const domLink = document.createElement('a');
        domLink.textContent = title;
        domLink.href = link;
        domItem.append(domLink);
        elements.containerRss.append(domItem);
      });
    });
  };

  const renderingByMode = {
    waiting: renderInputEnabling,
    blocked: renderBlocked,
    invalid: renderInvalid,
    valid: renderValid,
  };

  const renderValidation = () => {
    if (!renderingByMode[state.mode]) {
      throw new Error(`Unknown state mode: ${state.mode}`);
    }

    renderingByMode[state.mode](state.error);
  };

  const renderingByStatekey = {
    mode: renderValidation,
    channels: renderChannels,
  };

  const stateKey = path.split('.')[0];
  if (!renderingByStatekey[stateKey]) { return; }

  renderingByStatekey[stateKey](elements, state);
};
