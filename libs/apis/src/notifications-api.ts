import { GeminiResponse } from '@vegaplatformui/utils';
import { HttpClient } from './http-common';

export class NotificationsAPI extends HttpClient {
    protected static classInstance?: NotificationsAPI;
    public token!: string;
    public baseURL!: string;

    constructor() {
        super(`https://${process.env.NX_API_URL!}`);
        this._initializeRequestInterceptor();
    }

    public static getInstance() {
        if (!this.classInstance) {
            this.classInstance = new NotificationsAPI();
        }

        return this.classInstance;
    }

    public getNotifications = (limit = 10, offset = 0): GeminiResponse<any> =>
        this.instance.get(`/vegaapi/notifications?limit=${limit}&offset=${offset}`);
    public getOrganizationNotifications = (limit = 10, offset = 0): GeminiResponse<any> =>
        this.instance.get(`/vegaapi/notifications/organization?limit=${limit}&offset=${offset}`);
}
