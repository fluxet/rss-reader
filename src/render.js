// @ts-check
import axios from 'axios';
import i18next from 'i18next';
import { parse, getNewPosts } from './utils';
import getTranslation from './getTranslation';

const container = document.querySelector('.container');
const domElementFeedback = container.querySelector('.feedback');
const domElementInput = container.querySelector('input');

const state = {
  posts: [],
};

const renderInvalid = (message) => {
  domElementInput.classList.add('is-invalid');
  domElementFeedback.textContent = message;
  domElementFeedback.classList.remove('text-success');
  domElementFeedback.classList.add('text-danger');
};

const renderValid = (url) => {
  domElementInput.classList.remove('is-invalid');
  domElementFeedback.classList.remove('text-danger');
  domElementFeedback.classList.add('text-success');
  i18next.init(getTranslation).then(() => {
    domElementFeedback.textContent = i18next.t('responseSuccess');
  });

  const renderLoop = (isFirstIteration) => {
    axios.get(`https://cors-anywhere.herokuapp.com/${url}`)
      .then(({ data }) => {
        const rssContent = parse(data);
        const { headerContent, posts } = rssContent;

        const newPosts = getNewPosts(state.posts, posts);
        state.posts.push(...newPosts);

        if (isFirstIteration) {
          const header = document.createElement('h2');
          header.textContent = headerContent;
          container.append(header);
        }

        newPosts.forEach(({ text, link }) => {
          const domItem = document.createElement('div');
          const domLink = document.createElement('a');
          domLink.textContent = text;
          domLink.href = link;
          domItem.append(domLink);
          container.append(domItem);
        });

        setTimeout(() => {
          renderLoop(false);
        }, 5000);
      });
  };
  renderLoop(true);
};

export default (mainState) => {
  const currentUrl = mainState.urls[mainState.urls.length - 1];
  return (mainState.isUrlValid) ? renderValid(currentUrl) : renderInvalid(mainState.error);
};
