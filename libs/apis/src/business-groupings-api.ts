import { HttpClient } from './http-common';
import {
    IGetBusinessGroupingRequest,
    IDeleteBusinessGroupingRequest,
    IDeleteBusinessGroupingsRequest,
    IPostBusinessGroupingRequest,
    IPutBusinessGroupingRequest,
    IGetBusinessGroupingTypesRequest,
    IListBusinessGroupingsRequest,
} from '@vegaplatformui/models';
import { GeminiResponse } from '@vegaplatformui/utils';

export class BusinessGroupingsApi extends HttpClient {
    protected static classInstance?: BusinessGroupingsApi;
    public token!: string;
    public baseURL!: string;

    constructor() {
        super(`https://${process.env.NX_API_URL!}`);
        this._initializeRequestInterceptor();
    }

    public static getInstance() {
        if (!this.classInstance) {
            this.classInstance = new BusinessGroupingsApi();
        }

        return this.classInstance;
    }

    public loadBusinessGroupings = (request: IListBusinessGroupingsRequest): GeminiResponse<any[]> => this.instance.get(`/vegaapi/business-units`);

    public getBusinessGrouping = (request: IGetBusinessGroupingRequest): GeminiResponse<any> =>
        this.instance.get(`/vegaapi/business-units/${request.id}`);
    public deleteBusinessGrouping = (request: IDeleteBusinessGroupingRequest): GeminiResponse<any> =>
        this.instance.delete(`/vegaapi/business-units/${request.id}`);

    public deleteBusinessGroupings = (request: IDeleteBusinessGroupingsRequest): GeminiResponse<any> =>
        this.instance.delete(`/vegaapi/business-units`, { data: { ids: request.ids } });

    public createBusinessGrouping = (request: IPostBusinessGroupingRequest): GeminiResponse<any> =>
        this.instance.post(`/vegaapi/business-units`, request);

    public updateBusinessGrouping = (request: IPutBusinessGroupingRequest, businessUnitID: string): GeminiResponse<any> =>
        this.instance.put(`/vegaapi/business-units/${businessUnitID}`, request);

    public getBusinessGroupingTypes = (request?: IGetBusinessGroupingTypesRequest): GeminiResponse<any[]> =>
        this.instance.get(`/vegaapi/business-unit/types`);
}
