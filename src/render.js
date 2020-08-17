// @ts-check
import renderInvalid from './renderInvalid';
import renderValid from './renderValid';

export default (state) => {
  console.log('state from watched: ', state);
  const currentUrl = state.urls[state.urls.length - 1];
  return (state.isUrlValid) ? renderValid(currentUrl) : renderInvalid(state.error);
};
