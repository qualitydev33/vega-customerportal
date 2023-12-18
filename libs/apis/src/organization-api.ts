import { AxiosRequestConfig } from 'axios';
import { GeminiResponse } from '@vegaplatformui/utils';
import { IOrganizationPostRequest, IOrganizationResponse, IOrganizationStatusUpdateResponse } from '@vegaplatformui/models';
import { HttpClient } from './http-common';

export class OrganizationApi extends HttpClient {
    protected static classInstance?: OrganizationApi;
    public token!: string;
    public baseURL!: string;

    constructor() {
        super(process.env.NX_ORGANIZATION_URL!);
        this._initializeRequestInterceptor();
    }

    public static getInstance() {
        if (!this.classInstance) {
            this.classInstance = new OrganizationApi();
        }

        return this.classInstance;
    }

    public getOrganizations = (): GeminiResponse<any> => this.instance.get('api/organizations');
    public getOrganization = (id: string): GeminiResponse<any> => this.instance.get(`api/organizations/${id}`);
    public getOrganizationUsers = (id: string): GeminiResponse<any> => this.instance.get(`api/organizations/${id}/users`);
    public createOrganizationUser = (id: string, data: any): GeminiResponse<any> => this.instance.post(`api/organizations/${id}/users`, data);
    public createOrganization = (data: IOrganizationPostRequest): GeminiResponse<any> =>
        this.instance.post<IOrganizationPostRequest>('api/organizations', data);

    public enableOrganization = (id: string): GeminiResponse<IOrganizationStatusUpdateResponse> =>
        this.instance.patch(`api/organizations/${id}/enable`);
    public disableOrganization = (id: string): GeminiResponse<IOrganizationStatusUpdateResponse> =>
        this.instance.patch(`api/organizations/${id}/disable`);
}
