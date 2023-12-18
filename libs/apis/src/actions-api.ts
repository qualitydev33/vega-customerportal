import { GeminiResponse } from '@vegaplatformui/utils';
import {
    IActionResponse,
    IDataGridRequest,
    IGetParkingPolicySummariesResponse,
    IParkingSchedule,
    IParkingScheduleSummary,
    IPostTakeActionRequest,
    IPostTakeImmediateActionRequest,
    IPutPoliciesRequest,
    IResource,
} from '@vegaplatformui/models';
import { HttpClient } from './http-common';

export class ActionsApi extends HttpClient {
    protected static classInstance?: ActionsApi;
    public token!: string;
    public baseURL!: string;

    constructor() {
        super(`https://${process.env.NX_API_URL!}`);
        this._initializeRequestInterceptor();
    }

    public static getInstance() {
        if (!this.classInstance) {
            this.classInstance = new ActionsApi();
        }

        return this.classInstance;
    }

    public postTakeAction = (request: IPostTakeActionRequest): GeminiResponse<IActionResponse> =>
        this.instance.post(`vegaapi/scheduled-events/take-action?rec_id=${request.recommendationId}`, {
            resources: request.resources,
            schedule: request.schedule,
            timezone: request.timezone,
        });

    public postParking = (request: IParkingSchedule): GeminiResponse<any> => this.instance.post(`vegaapi/vega-policies/`, request);

    public putPolicies = (request: IPutPoliciesRequest): GeminiResponse<IActionResponse> =>
        this.instance.put(`vegaapi/policies?policy_id=${request.policyId}`, request.data);

    public getParkingPolicySummaries = (request: IDataGridRequest): GeminiResponse<IGetParkingPolicySummariesResponse> =>
        this.instance.get(
            `vegaapi/vega-policies/?filters=${encodeURIComponent(JSON.stringify(request.filterModel))}&sortedBy=${encodeURIComponent(
                JSON.stringify(request.sortModel)
            )}&gridPaginationModel=${encodeURIComponent(JSON.stringify(request.paginationModel))}`
        );

    public getParkingPolicy = (policyId: string): GeminiResponse<IParkingSchedule> => this.instance.get(`vegaapi/vega-policies/${policyId}`);

    public deleteParkingSchedule = (policyId: string): GeminiResponse<any> => this.instance.delete(`vegaapi/vega-policies/${policyId}`);

    public deleteParkingSchedules = (policyIds: string[]): GeminiResponse<any> =>
        this.instance.delete(`vegaapi/vega-policies/batch/`, { data: policyIds });

    public putParking = (parkingScheduleId: string, request: IParkingSchedule): GeminiResponse<any> =>
        this.instance.put(`vegaapi/vega-policies/${parkingScheduleId}`, request);

    public deleteScheduledActions = (resources: IResource[]): GeminiResponse<any> =>
        this.instance.delete(`vegaapi/scheduled-events/take-action`, {
            data: resources,
        });

    public putTakeAction = (request: IPostTakeActionRequest): GeminiResponse<IActionResponse> =>
        this.instance.put(`vegaapi/scheduled-events/take-action?rec_id=${request.recommendationId}`, {
            resources: request.resources,
            schedule: request.schedule,
            timezone: request.timezone,
        });

    public postTakeImmediateAction = (request: IPostTakeImmediateActionRequest): GeminiResponse<IActionResponse> =>
        this.instance.post(`vegaapi//scheduled-events/action_request`, {
            resource_id: request.resourceId,
            action: request.action,
        });
}
