import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AxiosRequestConfig } from 'axios';

export class HttpClient {
    protected readonly instance: AxiosInstance;
    public token!: string;

    public constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL,
        });
        this._initializeRequestInterceptor();
        this._initializeResponseInterceptor();
    }

    private _initializeResponseInterceptor = () => {
        this.instance.interceptors.response.use(this._handleResponse, this._handleError);
    };

    protected _initializeRequestInterceptor = () => {
        this.instance.interceptors.request.use(this._handleRequest, this._handleError);
    };

    protected _handleRequest = (config: InternalAxiosRequestConfig<AxiosRequestConfig>) => {
        config.headers['Authorization'] = 'Bearer ' + this.token;
        // config.headers['Content-Type'] = 'application/json';
        config.headers['Accept'] = 'application/json';
        config.headers['Access-Control-Allow-Origin'] = 'https://local.vegacloud.io:3001';
        config.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
        config.headers['Access-Control-Allow-Headers'] = '*';

        return config;
    };

    //private _handleResponse = (response: AxiosResponse) => response;
    private _handleResponse = (response: AxiosResponse) => {
        return response;
    };

    protected _handleError = (error: AxiosError) => Promise.reject(error);
}
