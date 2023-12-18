import { HttpClient } from './http-common';
import { GeminiResponse } from '@vegaplatformui/utils';
import { ISendSupportEmailRequest, SupportEmailRecipient } from '@vegaplatformui/models';

export class VegaApi extends HttpClient {
    protected static classInstance?: VegaApi;
    public token!: string;
    public baseURL!: string;

    constructor() {
        super(`https://${process.env.NX_API_URL!}`);
        this._initializeRequestInterceptor();
    }

    public static getInstance() {
        if (!this.classInstance) {
            this.classInstance = new VegaApi();
        }

        return this.classInstance;
    }

    sendSupportEmail = (request: ISendSupportEmailRequest, recipient: SupportEmailRecipient): GeminiResponse<any> =>
        this.instance.post(`/vegaapi/support/${recipient}`, request);
}
