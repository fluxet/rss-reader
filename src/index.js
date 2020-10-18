// @ts-check
import './scss/app.scss';
import 'bootstrap';
import app from './app';
import initTranslation from './getTranslation';

initTranslation();

app();
