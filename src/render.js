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

    state.channels.forEach(({ headerContent, posts }) => {
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

  const renderingByValidation = {
    invalid: renderInvalid,
    valid: renderValid,
  };

  const renderingByModeInput = {
    filling: renderInputEnabling,
    blocked: renderBlocked,
  };

  const renderValidation = () => {
    if (!renderingByValidation[state.modeValidation]) {
      throw new Error(`Unknown validation mode: ${state.modeValidation}`);
    }

    renderingByValidation[state.modeValidation](state.error);
  };

  const rendermodeInput = () => {
    if (!renderingByModeInput[state.modeInput]) {
      throw new Error(`Unknown loading mode: ${state.modeInput}`);
    }

    renderingByModeInput[state.modeInput]();
  };

  const renderingByPath = {
    modeValidation: renderValidation,
    modeInput: rendermodeInput,
    channels: renderChannels,
  };

  const stateKey = path.split('.')[0];
  if (!renderingByPath[stateKey]) { return; }

  renderingByPath[stateKey](elements, state);
  console.log('path: ', path);
  console.log('state: ', state);
};
