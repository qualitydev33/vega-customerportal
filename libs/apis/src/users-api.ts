import { HttpClient } from './http-common';
import { IUser, IListUsersRequest } from '@vegaplatformui/models';
import { GeminiResponse } from '@vegaplatformui/utils';

export class UsersApi extends HttpClient {
    protected static classInstance?: UsersApi;
    public token!: string;
    public baseURL!: string;

    constructor() {
        super(`https://${process.env.NX_API_URL!}`);
        this._initializeRequestInterceptor();
    }

    public static getInstance() {
        if (!this.classInstance) {
            this.classInstance = new UsersApi();
        }

        return this.classInstance;
    }

    public loadUsers = (request?: IListUsersRequest): GeminiResponse<IUser[]> => this.instance.get('vegaapi/users');
}
