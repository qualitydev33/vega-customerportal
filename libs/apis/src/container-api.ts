import { HttpClient } from './http-common';
import {
    ISpacesRequest,
    IResourcesGetRequest,
    ICreateSpaceRequest,
    ICreateWorkloadRequest,
    IUpdateWorkloadRequest,
    ICreateResourcePoolRequest,
    IUpdateResourcePoolRequest,
    IVegaContainer,
    IDataGridRequest,
    IGetResourcesResponse,
} from '@vegaplatformui/models';
import { GeminiResponse } from '@vegaplatformui/utils';

export class ContainerApi extends HttpClient {
    protected static classInstance?: ContainerApi;
    public token!: string;
    public baseURL!: string;

    constructor() {
        super(`https://${process.env.NX_API_URL!}`);
        this._initializeRequestInterceptor();
    }

    public static getInstance() {
        if (!this.classInstance) {
            this.classInstance = new ContainerApi();
        }

        return this.classInstance;
    }

    // Spaces
    public loadSpaces = (request: ISpacesRequest): GeminiResponse<IVegaContainer[]> => this.instance.get(`/vegaapi/spaces/summary`);
    public createSpace = (request: ICreateSpaceRequest): GeminiResponse<any> => this.instance.post(`/vegaapi/spaces`, request);
    public deleteSpace = (spaceId: string): GeminiResponse<any> => this.instance.delete(`/vegaapi/spaces/${spaceId}`);
    public updateSpace = (request: ICreateSpaceRequest, spaceId: string): GeminiResponse<any> =>
        this.instance.put(`/vegaapi/spaces/${spaceId}`, request);

    // Resources
    public loadResources = (request: IDataGridRequest): GeminiResponse<IGetResourcesResponse> =>
        this.instance.get(
            `/vegaapi/resources?filters=${encodeURIComponent(JSON.stringify(request.filterModel))}&sortedBy=${encodeURIComponent(
                JSON.stringify(request.sortModel)
            )}&gridPaginationModel=${encodeURIComponent(JSON.stringify(request.paginationModel))}`
        );
    // {
    //     let url = `/vegaapi/resources?fields=${encodeURIComponent(request.fields)}`;
    //     url = request.page ? `${url}&page=${request.page}` : `${url}&page=0`;
    //     url = request.size ? `${url}&page=${request.size}` : `${url}&size=10`;
    //     url = request.ordering ? `${url}&page=${request.ordering}` : `${url}&ordering=id`;
    //     url = request.filter ? `${url}&page=${request.filter}` : url;
    //     return this.instance.get(url);
    // };
    public getResourceById = (resourceId: string): GeminiResponse<any> => this.instance.get(`/vegaapi/resources/${resourceId}`);
    public getResourcesSummary = (): GeminiResponse<any> => this.instance.get(`/vegaapi/resources/summary/`);

    // Workloads
    public loadWorkloads = (): GeminiResponse<any> => this.instance.get(`/vegaapi/workloads`);
    public createWorkload = (request: ICreateWorkloadRequest): GeminiResponse<any> => this.instance.post(`/vegaapi/workloads`, request);
    public deleteWorkload = (workloadId: string): GeminiResponse<any> => this.instance.delete(`/vegaapi/workloads/${workloadId}`);
    public updateWorkload = (request: IUpdateWorkloadRequest, workloadId: string): GeminiResponse<any> =>
        this.instance.put(`/vegaapi/workloads/${workloadId}`, request);

    // Resource Pool
    public createResourcePool = (request: ICreateResourcePoolRequest): GeminiResponse<any> => this.instance.post(`/vegaapi/resource-pools`, request);
    public deleteResourcePool = (resourcePoolId: string): GeminiResponse<any> => this.instance.delete(`/vegaapi/resource-pools/${resourcePoolId}`);
    public updateResourcePool = (request: IUpdateResourcePoolRequest, resourcePoolId: string): GeminiResponse<any> =>
        this.instance.put(`/vegaapi/resource-pools/${resourcePoolId}`, request);
    public getResourcesByResourcePoolId = (request: string): GeminiResponse<any> => this.instance.get(`/vegaapi/resource-pools/resources/${request}`);
    public getFamilyByResourcePoolId = (resourcePoolId: string): GeminiResponse<any> =>
        this.instance.get(`/vegaapi/resource-pools/family/${resourcePoolId}`);
}
