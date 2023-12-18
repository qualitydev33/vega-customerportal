import { GeminiResponse } from '@vegaplatformui/utils';
import {
    IDataGridRequest,
    IGetParkingPolicySummariesByRecIdRequest,
    IGetParkingPolicySummariesResponse,
    IGetRecommendationResponse,
    IGetRecommendationsOverviewResponse,
    IGetRecommendationSummaryResponse,
} from '@vegaplatformui/models';
import { ActionsApi } from './actions-api';

export class RecommendationsApi extends ActionsApi {
    protected static classInstance?: RecommendationsApi;
    public token!: string;
    public baseURL!: string;

    public static getInstance() {
        if (!this.classInstance) {
            this.classInstance = new RecommendationsApi();
        }

        return this.classInstance;
    }

    public getRecommendations = (request: IDataGridRequest): GeminiResponse<IGetRecommendationSummaryResponse> =>
        this.instance.get(
            `/vegaapi/recommendations/summary?filters=${encodeURIComponent(JSON.stringify(request.filterModel))}&sortedBy=${encodeURIComponent(
                JSON.stringify(request.sortModel)
            )}&gridPaginationModel=${encodeURIComponent(JSON.stringify(request.paginationModel))}`
        );

    public getRecommendation = (recommendationId: string): GeminiResponse<IGetRecommendationResponse> =>
        this.instance.get(`/vegaapi/recommendations/${recommendationId}`);

    public getRecommendationsOverview = (): GeminiResponse<IGetRecommendationsOverviewResponse> =>
        this.instance.get(`/vegaapi/recommendations/overview`);

    public getRecommendationsByResourceID = (resourceID: string): GeminiResponse<any> =>
        this.instance.get(`/vegaapi/recommendations/resource/${resourceID}`);

    public getParkingPolicySummariesByRecId = (
        request: IGetParkingPolicySummariesByRecIdRequest
    ): GeminiResponse<IGetParkingPolicySummariesResponse> =>
        this.instance.get(
            `vegaapi/vega-policies/scheduled/${request.recId}?filters=${encodeURIComponent(
                JSON.stringify(request.filterModel)
            )}&sortedBy=${encodeURIComponent(JSON.stringify(request.sortModel))}&gridPaginationModel=${encodeURIComponent(
                JSON.stringify(request.paginationModel)
            )}`
        );
}
