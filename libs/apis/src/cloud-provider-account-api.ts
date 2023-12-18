import { HttpClient } from './http-common';
import {
    ICloudAccountsRequest,
    IDeleteCloudAccountsBatchRequest,
    IDeleteCloudAccountsRequest,
    IGetCloudAccountRequest,
    IPostCloudAccountsBatchRequest,
    IPostCloudAccountsRequest,
    IPutCloudAccountsRequest,
} from '@vegaplatformui/models';
import { GeminiResponse } from '@vegaplatformui/utils';
import { ICloudProviderAccount } from '@vegaplatformui/models';

export class CloudProviderAccountApi extends HttpClient {
    protected static classInstance?: CloudProviderAccountApi;
    public token!: string;
    public baseURL!: string;

    constructor() {
        super(`https://${process.env.NX_API_URL!}`);
        this._initializeRequestInterceptor();
    }

    public static getInstance() {
        if (!this.classInstance) {
            this.classInstance = new CloudProviderAccountApi();
        }

        return this.classInstance;
    }
    public loadCloudAccounts = (request: ICloudAccountsRequest): GeminiResponse<ICloudProviderAccount[]> =>
        this.instance.get(`/vegaapi/provider-accounts?size=${request.size}&page=${request.page}`);

    public getCloudAccount = (request: IGetCloudAccountRequest): GeminiResponse<ICloudProviderAccount> =>
        this.instance.get(`/vegaapi/provider-accounts/${request.id}`);

    public deleteCloudAccount = (request: IDeleteCloudAccountsRequest): GeminiResponse<any> =>
        this.instance.delete(`vegaapi/provider-accounts/${request.id}`);
    public deleteCloudAccountBatch = (request: IDeleteCloudAccountsBatchRequest): GeminiResponse<any> =>
        this.instance.delete(`vegaapi/provider-accounts/batch/`, { data: request.ids });
    public createCloudAccount = (request: IPostCloudAccountsRequest): GeminiResponse<any> =>
        this.instance.post('/vegaapi/provider-accounts', {
            provider_str: request.provider_str,
            account_id: request.account_id,
            account_name: request.account_name,
            parent_account_id: request.parent_account_id,
            enabled: request.enabled,
            secret_json: request.secret_json ?? null,
            external_id: request.external_id ?? null,
        });

    public createCloudAccounts = (request: IPostCloudAccountsBatchRequest): GeminiResponse<any> =>
        this.instance.post(
            `/vegaapi/provider-accounts/csv`,
            { file: request.file },
            { headers: { ...this._handleRequest, 'Content-Type': 'multipart/form-data' } }
        );

    public updateCloudAccount = (request: IPutCloudAccountsRequest): GeminiResponse<any> =>
        this.instance.put(`/vegaapi/provider-accounts/${request.id}`, {
            provider_str: request.provider_str,
            account_id: request.account_id,
            account_name: request.account_name,
            parent_id: request.parent_account_id,
            enabled: request.enabled,
            secret_json: request.secret_json,
        });
}
