import { GeminiResponse } from '@vegaplatformui/utils';
import {
    IDeleteFileRequest,
    IFile,
    IGetFileDownloadUrlsRequest,
    IGetFileDownloadUrlsResponse,
    IGetFilesResponse,
    IPutFileUploadUrl,
} from '@vegaplatformui/models';
import { HttpClient } from './http-common';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export class FileApi extends HttpClient {
    protected static classInstance?: FileApi;
    public token!: string;
    public baseURL!: string;

    constructor() {
        super(`https://${process.env.NX_API_URL!}`);
        this._initializeRequestInterceptor();
    }

    public static getInstance() {
        if (!this.classInstance) {
            this.classInstance = new FileApi();
        }

        return this.classInstance;
    }

    public getFiles = (isUpload: string): GeminiResponse<IGetFilesResponse> => this.instance.get(`/files/list/?is_upload=${isUpload}`);
    public getFileDownloadUrls = (data: IGetFileDownloadUrlsRequest): GeminiResponse<IGetFileDownloadUrlsResponse> => {
        return this.instance.post('/files/download/', data);
    };

    public getFileUploadUrl = (request: any): GeminiResponse<any> => this.instance.get(`/files/upload/?filename=${request.filename}`);

    public putFileUpload = (request: any): GeminiResponse<any> => this.instance.put(`/files/upload/`, { fileName: `uploads/${request.fileName}` });

    public deleteUploadedFile = (request: IDeleteFileRequest): GeminiResponse<any> => this.instance.delete('/files/delete/', { data: request });
}

//This had to be done to upload the file to s3 we couldn't have our headers on the one endpoint
export class FileUploadApi {
    protected readonly instance: AxiosInstance;
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
        return config;
    };

    private _handleResponse = (response: AxiosResponse) => {
        return response;
    };

    protected _handleError = (error: AxiosError) => Promise.reject(error);

    public putFileUploadUrl = (request: IPutFileUploadUrl): GeminiResponse<any> => this.instance.put(request.fileDownloadUrl, request.filePath);
}
