// @ts-check

const domElementFeedback = document.querySelector('.feedback');
const domElementInput = document.querySelector('input');

export default (message) => {
  domElementInput.classList.add('is-invalid');

  domElementFeedback.textContent = message;
  domElementFeedback.classList.remove('text-success');
  domElementFeedback.classList.add('text-danger');
};
