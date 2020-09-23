// @ts-check
import axios from 'axios';

export default (url) => axios.get(`https://cors-anywhere.herokuapp.com/${url}`);
