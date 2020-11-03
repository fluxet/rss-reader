// @ts-check
import i18next from 'i18next';

export default (state, path) => {
  const elements = {
    containerFeeds: document.querySelector('.feeds'),
    containerPosts: document.querySelector('.posts'),
    feedback: document.querySelector('.feedback'),
    input: document.querySelector('input'),
    submitBtn: document.querySelector('button[type="submit"]'),
  };

  const renderInputEnabling = () => elements.submitBtn.removeAttribute('disabled');
  const renderBlocked = () => {
    elements.submitBtn.setAttribute('disabled', '');
    elements.input.setAttribute('readonly', '');
  };

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

  const renderContainer = (containerDom, containerName, listClasses) => {
    const feedsHeader = document.createElement('h2');
    const feedsList = document.createElement('ul');
    feedsHeader.textContent = containerName;
    feedsList.classList.add(...listClasses);
    containerDom.append(feedsHeader);
    containerDom.append(feedsList);
  };

  const renderChannels = () => {
    elements.submitBtn.removeAttribute('disabled');
    elements.input.removeAttribute('readonly');

    elements.containerFeeds.textContent = '';
    elements.containerPosts.textContent = '';
    renderContainer(elements.containerFeeds, 'Feeds', ['list-group', 'mb-5']);
    renderContainer(elements.containerPosts, 'Posts', ['list-group']);

    const feedsList = elements.containerFeeds.querySelector('ul');
    const postsList = elements.containerPosts.querySelector('ul');

    state.channels.forEach(({ feeds: { headerContent, descriptionContent }, posts }) => {
      const feedsItem = document.createElement('li');
      feedsItem.classList.add('list-group-item');

      const channelHeader = document.createElement('h3');
      const channelDescription = document.createElement('p');
      channelHeader.textContent = headerContent;
      channelDescription.textContent = descriptionContent;
      feedsItem.append(channelHeader);
      feedsItem.append(channelDescription);
      feedsList.append(feedsItem);

      posts.forEach(({ title, link }) => {
        const postsItem = document.createElement('li');
        postsItem.classList.add('list-group-item');

        const domLink = document.createElement('a');
        domLink.textContent = title;
        domLink.href = link;
        postsItem.append(domLink);
        postsList.append(postsItem);
      });
    });
  };

  const renderIdleStatus = () => null;
  const renderDataLoadingStatus = () => null;

  const renderingByFormStatus = {
    filling: renderInputEnabling,
    invalid: renderInvalid,
    valid: renderValid,
    blocked: renderBlocked,
  };

  const renderingByLoadingStatus = {
    idle: renderIdleStatus,
    loading: renderDataLoadingStatus,
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

  const channelPath = (path.includes('channels')) ? path : null;

  const renderingByPath = {
    'form.status': renderForm,
    'loading.status': renderLoading,
    [channelPath]: renderChannels,
  };

  if (!renderingByPath[path]) { return; }

  renderingByPath[path]();
};
