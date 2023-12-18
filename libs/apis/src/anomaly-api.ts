import { GeminiResponse } from '@vegaplatformui/utils';
import { HttpClient } from './http-common';

export class AnomalyApi extends HttpClient {
    protected static classInstance?: AnomalyApi;
    public token!: string;
    public baseURL!: string;

    constructor() {
        super(`https://${process.env.NX_API_URL!}`);
        this._initializeRequestInterceptor();
    }

    public static getInstance() {
        if (!this.classInstance) {
            this.classInstance = new AnomalyApi();
        }

        return this.classInstance;
    }

    // This is a test id but we should be passing the id of the project org and the business unit
    // We should also be passing pagination params and additional filters, we need to add filters to the backend api
    public getAnomalies = (orgId: string): GeminiResponse<any> => this.instance.get(`vegaapi/api/anomalies/${orgId}`);

    public getAnomalyStats = (orgId: string): GeminiResponse<any> => this.instance.get(`vegaapi/api/anomalies/${orgId}/stats`);
}
