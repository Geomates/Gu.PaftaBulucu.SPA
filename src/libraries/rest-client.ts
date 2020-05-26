import { eventHub } from './event-hub';
import axios, { AxiosStatic } from 'axios';

export function createClient(token?: string): AxiosStatic {
    axios.interceptors.request.use(
        (conf) => {
            if (token) {
                conf.headers.Authorization = `Bearer ${token}`;
            }
            eventHub.$emit('before-request');
            return conf;
        },
        (error) => {
            eventHub.$emit('request-error');
            return Promise.reject(error);
        },
    );
    axios.interceptors.response.use(
        (response) => {
            eventHub.$emit('after-response');
            return response;
        },
        (error) => {
            eventHub.$emit('response-error');
            return Promise.reject(error);
        },
    );
    return axios;
}
