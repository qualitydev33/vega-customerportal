import { GeminiResponse } from '@vegaplatformui/utils';
import {
    IUserSettingProfilePutRequest,
    IUserSettingAddressPutRequest,
    IUserSettingRolePostRequest,
    IUserSettingRoleBaseRequest,
    IUserSettingUserRolesGetRequest,
    IUserSettingUserPostRequest,
    IUserSettingBaseRequest,
    IUserSettingSSOBaseRequest,
} from '@vegaplatformui/models';
import { HttpClient } from './http-common';

export class UserSettingApi extends HttpClient {
    protected static classInstance?: UserSettingApi;
    public token!: string;
    public baseURL!: string;

    constructor() {
        super(`https://${process.env.NX_API_URL!}`);
        this._initializeRequestInterceptor();
    }

    public static getInstance() {
        if (!this.classInstance) {
            this.classInstance = new UserSettingApi();
        }

        return this.classInstance;
    }

    // User Profile Section
    public getUser = (data: IUserSettingBaseRequest): GeminiResponse<any> => this.instance.get(`/keycloak/keycloak/${data.username}/user`);
    public getPhoto = (data: IUserSettingBaseRequest): GeminiResponse<any> => this.instance.get(`/keycloak/keycloak/${data.username}/photo`);
    public updateProfile = (data: IUserSettingProfilePutRequest): GeminiResponse<any> =>
        this.instance.put<IUserSettingProfilePutRequest>(
            `/keycloak/keycloak/${data.username}/profile?first_name=${data.first_name}&last_name=${data.last_name}&email=${data.email}&mobile_phone=${data.mobile_phone}`
        );
    public uploadImg = (data: IUserSettingBaseRequest, formData: FormData): GeminiResponse<any> =>
        this.instance.post(`/keycloak/keycloak/photo?username=${data.username}`, formData);
    public deleteImg = (username: string): GeminiResponse<any> => this.instance.delete(`/keycloak/keycloak/photo?username=${username}`);
    public updateAddress = (data: IUserSettingAddressPutRequest): GeminiResponse<any> =>
        this.instance.put<IUserSettingAddressPutRequest>(
            `/keycloak/keycloak/${data.username}/address?street_address=${data.street_address}&country=${data.country}&city=${data.city}&state=${data.state}&zip_code=${data.zip_code}`
        );

    public updatePassword = (data: IUserSettingBaseRequest, formData: FormData): GeminiResponse<any> =>
        this.instance.put<IUserSettingBaseRequest>(`/keycloak/keycloak/${data.username}/password`, formData);

    // Users Table Section
    public getUsers = (data: string): GeminiResponse<any> => this.instance.get<string>(`/keycloak/keycloak_admin/users?size=50`);
    public createUser = (data: IUserSettingUserPostRequest): GeminiResponse<any> =>
        this.instance.post<IUserSettingUserPostRequest>(
            `/keycloak/keycloak_admin/user?email=${data.email}&first_name=${data.first_name}&last_name=${data.last_name}&roles=${data.roles}`
        );
    public deleteUser = (data: IUserSettingBaseRequest): GeminiResponse<any> =>
        this.instance.delete<IUserSettingBaseRequest>(`/keycloak/keycloak_admin/${data.username}`);

    // Permissions/Role Section
    public getRealmClients = (data: string) => this.instance.get<string>(`/keycloak/keycloak_admin/clients`);
    public getRealmRoleByUsername = (data: IUserSettingBaseRequest): GeminiResponse<any> =>
        this.instance.get<IUserSettingBaseRequest>(`/keycloak/keycloak_admin/${data.username}/roles`);
    public getRealmRoles = (data: string): GeminiResponse<any> => this.instance.get<string>(`/keycloak/keycloak_admin/realmRoles`);
    public getUserClientRoles = (data: IUserSettingUserRolesGetRequest): GeminiResponse<any> =>
        this.instance.get<IUserSettingUserRolesGetRequest>(`/keycloak/keycloak_admin/${data.username}/roles?client=${data.client}`);
    public createRole = (data: IUserSettingRolePostRequest, username: string): GeminiResponse<any> =>
        this.instance.post<IUserSettingRolePostRequest>(`/keycloak/keycloak_admin/roles?role_name=${data.role_name}`);
    public assignRoleToUsers = (role_name: string, usernames: string[]): GeminiResponse<any> =>
        this.instance.put(`/keycloak/keycloak_admin/users/${role_name}`, usernames);
    public updateUserRole = (data: IUserSettingRoleBaseRequest): GeminiResponse<any> =>
        this.instance.put<IUserSettingRoleBaseRequest>(
            `/keycloak/keycloak_admin/${data.username}/roles?role_name=${data.role_name}&username=${data.username}`
        );
    public updateRoleName = (role_name: string, new_role_name: string): GeminiResponse<any> =>
        this.instance.put(`/keycloak/keycloak_admin/roles/${role_name}?new_role_name=${new_role_name}`);
    public removeRolesFromUser = (data: IUserSettingRoleBaseRequest): GeminiResponse<any> =>
        this.instance.delete<IUserSettingRoleBaseRequest>(`/keycloak/keycloak_admin/${data.username}/roles?role_name=${data.role_name}`);
    public removeRoleFromUsers = (role_name: string, usernames: string[]): GeminiResponse<any> =>
        this.instance.delete(`/keycloak/keycloak_admin/users/${role_name}`, {
            data: usernames,
        });

    // SSO
    public getIDPList = () => this.instance.get(`/keycloak/keycloak_admin/idp`);
    public createOpenIdIDP = (data: IUserSettingSSOBaseRequest): GeminiResponse<any> =>
        this.instance.post(`/keycloak/keycloak_admin/idp/openID`, data);
    public createSamlIDP = (data: IUserSettingSSOBaseRequest): GeminiResponse<any> => this.instance.post(`/keycloak/keycloak_admin/idp/saml`, data);
    public updateOpenIdIDP = (alias: string, data: IUserSettingSSOBaseRequest): GeminiResponse<any> =>
        this.instance.put(`/keycloak/keycloak_admin/idp/openID/${alias}`, data);
    public updateSamlIDP = (alias: string, data: IUserSettingSSOBaseRequest): GeminiResponse<any> =>
        this.instance.put(`/keycloak/keycloak_admin/idp/saml/${alias}`, data);
    public deleteIDP = (alias: string): GeminiResponse<any> => this.instance.delete(`/keycloak/keycloak_admin/idp/${alias}`);
    public generateSSOXML = (url: string): GeminiResponse<any> =>
        this.instance.post(`/keycloak/keycloak_admin/generate-xml?url=${encodeURIComponent(url)}`);
    public importConfigIDP = (provider_id: string, config_file_path: string): GeminiResponse<any> =>
        this.instance.post(
            `/keycloak/keycloak_admin/idp/import-config?provider_id=${provider_id}&config_file_path=${encodeURIComponent(config_file_path)}`
        );

    // MFA
    public getMFAStatus = (): GeminiResponse<any> => this.instance.get('/keycloak/keycloak_admin/browser_flow/conditional_otp');
    public updateMFAStatus = (type: string): GeminiResponse<any> =>
        this.instance.put(`/keycloak/keycloak_admin/browser_flow/conditional_otp?parameter_type=${type}`);
}
