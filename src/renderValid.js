// @ts-check
import axios from 'axios';
import parse from './utils';

const container = document.querySelector('.container');
const domElementFeedback = container.querySelector('.feedback');
const domElementInput = container.querySelector('input');

export default (url) => {
  domElementInput.classList.remove('is-invalid');

  domElementFeedback.textContent = 'Rss has been loaded';
  domElementFeedback.classList.remove('text-danger');
  domElementFeedback.classList.add('text-success');

  axios.get(`https://cors-anywhere.herokuapp.com/${url}`)
    .then(({ data }) => {
      const { headerContent, posts } = parse(data);

      const header = document.createElement('h2');
      header.textContent = headerContent;
      container.append(header);

      posts.forEach(({ text, link }) => {
        const domItem = document.createElement('div');
        const domLink = document.createElement('a');
        domLink.textContent = text;
        domLink.href = link;
        domItem.append(domLink);
        container.append(domItem);
      });
    });
};
