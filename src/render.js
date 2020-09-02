// @ts-check
import axios from 'axios';
import i18next from 'i18next';
import { parse, getNewPosts } from './utils';
import getTranslation from './getTranslation';

const container = document.querySelector('.container');
const domElementFeedback = container.querySelector('.feedback');
const domElementInput = container.querySelector('input');
const domElementSubmitBtn = container.querySelector('button[type="submit"]');
const requestDelay = 5000;

const renderInvalid = (message) => {
  domElementInput.classList.add('is-invalid');
  domElementFeedback.classList.add('text-danger');
  domElementFeedback.classList.remove('text-success');
  domElementSubmitBtn.setAttribute('disabled', '');
  domElementFeedback.textContent = message;
};

const renderValid = (url) => {
  const state = {
    posts: [],
  };

  domElementInput.value = '';

  domElementInput.classList.remove('is-invalid');
  domElementFeedback.classList.remove('text-danger');
  domElementFeedback.classList.add('text-success');
  i18next.init(getTranslation).then(() => {
    domElementFeedback.textContent = i18next.t('responseSuccess');
  });

  const renderLoop = (isFirstIteration = true) => {
    axios.get(`https://cors-anywhere.herokuapp.com/${url}`)
      .then(({ data }) => {
        const rssContent = parse(data);
        const { headerContent, posts } = rssContent;

        if (isFirstIteration) {
          const header = document.createElement('h2');
          header.textContent = headerContent;
          container.append(header);
        }

        const newPosts = getNewPosts(state.posts, posts);
        state.posts.push(...newPosts);

        newPosts.forEach(({ title, link }) => {
          const domItem = document.createElement('div');
          const domLink = document.createElement('a');
          domLink.textContent = title;
          domLink.href = link;
          domItem.append(domLink);
          container.append(domItem);
        });
      })
      .catch((err) => {
        console.log('connection error: ', err);
      })
      .then(() => setTimeout(() => renderLoop(false), requestDelay));
  };
  renderLoop();
};

export default (mainState) => {
  const currentUrl = mainState.urls[mainState.urls.length - 1];
  return (mainState.isUrlValid) ? renderValid(currentUrl) : renderInvalid(mainState.error);
};
