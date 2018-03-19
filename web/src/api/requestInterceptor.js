import axios from 'axios';
import { getAuthTokens } from '../storage'

export const registerApiInterceptor = store => {
    axios.interceptors.request.use(config => {
        const tokens = getAuthTokens();
        if (tokens != null) {
            config.headers.Authorization = `Bearer ${tokens.token}`;
        }

        return config;
    });

    axios.interceptors.response.use(response => {
        return response;
    }, err => {
        // implement logic to handle bad response
        return Promise.reject(err);
    });
};
