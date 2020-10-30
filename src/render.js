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
  const renderBlocked = () => {
    elements.submitBtn.setAttribute('disabled', '');
    elements.input.setAttribute('readonly', '');
  }

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
    elements.input.removeAttribute('readonly');
    elements.feedback.textContent = errorMessage;
  };

  const renderChannels = () => {
    elements.containerRss.textContent = '';
    elements.submitBtn.removeAttribute('disabled');
    elements.input.removeAttribute('readonly');

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

  const renderIddleStatus = () => null;
  const renderDataLoadingStatus = () => null;

  const renderingByFormStatus = {
    filling: renderInputEnabling,
    invalid: renderInvalid,
    valid: renderValid,
    blocked: renderBlocked,
  };

  const renderingByLoadingStatus = {
    iddle: renderIddleStatus,
    loading: renderDataLoadingStatus,
    success: renderChannels,
    fail: renderInvalid,
  };

  const renderForm = () => {
    if (!renderingByFormStatus[state.form.status]) {
      throw new Error(`Unknown form status: ${state.form.status}`);
    }

    renderingByFormStatus[state.form.status](state.form.error);
  };

  const renderLoading = () => {
    if (!renderingByLoadingStatus[state.loading.status]) {
      throw new Error(`Unknown loading status: ${state.loading.status}`);
    }

    renderingByLoadingStatus[state.loading.status](state.loading.error);
  };

  const renderingByPath = {
    'form.status': renderForm,
    'loading.status': renderLoading,
  };

  if (!renderingByPath[path]) { return; }

  renderingByPath[path](elements, state);
};
