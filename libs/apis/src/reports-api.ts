import { GeminiResponse } from '@vegaplatformui/utils';
import { IDashboard, ListDashboardsRequest } from '@vegaplatformui/models';
import { HttpClient } from './http-common';

export class ReportsApi extends HttpClient {
    protected static classInstance?: ReportsApi;
    public token!: string;
    public baseURL!: string;

    constructor() {
        super(`https://${process.env.NX_API_URL!}`);
        this._initializeRequestInterceptor();
    }

    public static getInstance() {
        if (!this.classInstance) {
            this.classInstance = new ReportsApi();
        }

        return this.classInstance;
    }

    public postEmbeddedURL = (dashboardId: string): GeminiResponse<string> =>
        this.instance.post(`reporting/GetEmbeddedDashboardUrl?dashboardId=${dashboardId}`);
    public listDashboards = (listDashboardsRequest: ListDashboardsRequest): GeminiResponse<IDashboard[]> =>
        this.instance.post('reporting/ListDashboards', { folderNames: listDashboardsRequest.folderNames, tags: listDashboardsRequest.tags });
}
