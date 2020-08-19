import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://the-burger-builder-640ec.firebaseio.com/'
});

export default instance;