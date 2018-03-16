import axios from 'axios';
import { getAuthTokens } from '../storage'

export const registerApiInterceptor = store => {
    axios.interceptors.request.use(config => {
        const tokens = getAuthTokens();
        if (tokens != null) {
            config.headers.Authorization = `Bearer ${tokens.token}`;
        }

        return config;
    }, err => {
        return Promise.reject(err);
    });

    axios.interceptors.response.use(response => {
        return response;
    }, err => {
        return Promise.reject(err);
    });
};
