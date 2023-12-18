import { HttpClient } from './http-common';
import { ICloudAccountsRequest, ICloudProviderAccount, IDataGridRequest, IGetParkableResourcesResponse, IResource } from '@vegaplatformui/models';
import { GeminiResponse } from '@vegaplatformui/utils';

export class ResourcesApi extends HttpClient {
    protected static classInstance?: ResourcesApi;
    public token!: string;
    public baseURL!: string;

    constructor() {
        super(`https://${process.env.NX_API_URL!}`);
        this._initializeRequestInterceptor();
    }

    public static getInstance() {
        if (!this.classInstance) {
            this.classInstance = new ResourcesApi();
        }

        return this.classInstance;
    }

    public loadResources = (request: IDataGridRequest): GeminiResponse<IResource[]> =>
        this.instance.get(
            `vegaapi/resources/?filters=${encodeURIComponent(JSON.stringify(request.filterModel))}&sortedBy=${encodeURIComponent(
                JSON.stringify(request.sortModel)
            )}&gridPaginationModel=${encodeURIComponent(JSON.stringify(request.paginationModel))}`
        );

    public loadParkableResources = (scheduleToEditId: string, request: IDataGridRequest): GeminiResponse<IGetParkableResourcesResponse> =>
        this.instance.get(
            `vegaapi/resources/get_parkable_resources/${scheduleToEditId}?filters=${encodeURIComponent(
                JSON.stringify(request.filterModel)
            )}&sortedBy=${encodeURIComponent(JSON.stringify(request.sortModel))}&gridPaginationModel=${encodeURIComponent(
                JSON.stringify(request.paginationModel)
            )}`
        );
}
