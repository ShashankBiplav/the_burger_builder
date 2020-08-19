import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.DB_URI
});

export default instance;