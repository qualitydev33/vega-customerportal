export interface IUserSettingProfile {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    phone?: string;
    image?: string;
}
export interface IUserSettingAddress {
    street_address: string;
    country: string;
    city: string;
    state: string;
    zip_code: string;
}
export interface IUserSettingPassword {
    current_password: string;
    new_password: string;
    confirm_password: string;
}
export interface IUserSettingRealmRole {
    id: string;
    name: string;
    description: string;
    composite: boolean;
    clientRole: boolean;
    containerId: string;
    permissions: string[];
}
export interface IUserSettingBaseRequest {
    username: string;
}
export interface IUserSettingProfilePutRequest extends IUserSettingBaseRequest {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    mobile_phone?: string;
}
export interface IUserSettingAddressPutRequest extends IUserSettingBaseRequest {
    street_address?: string;
    country?: string;
    city?: string;
    state?: string;
    zip_code?: string;
}
export interface IUserSettingUserPostRequest {
    email: string;
    first_name: string;
    last_name: string;
    roles: string;
}
export interface IUserSettingUserRolesGetRequest extends IUserSettingBaseRequest {
    client: string;
}
export interface IUserSettingRolePostRequest {
    role_name: string;
}
export interface IUserSettingRoleBaseRequest extends IUserSettingBaseRequest {
    role_name: string;
}

export enum IUserSettingMFAStatusEnum {
    CONDITIONAL = 'CONDITIONAL',
    REQUIRED = 'REQUIRED',
    DISABLED = 'DISABLED',
    ALTERNATIVE = 'ALTERNATIVE',
}

export enum SSOTypeEnum {
    OPENID = 'oidc',
    SAML = 'saml',
}
export interface ISSONameIDPolicyFormat {
    label: string;
    value: string;
}
export interface IUserSettingSSOCommon {
    alias: string;
    redirect_uri: string;
    provider_id: string;
    display_name: string;
    xml_metadata: string;
}
export interface IUserSettingSSOOpenIDConfig {
    authorization_url: string;
    token_url: string;
    client_id: string;
    client_secret: string;
}
export interface IUserSettingSSOSamlConfig {
    signing_certificate: string;
    single_logout_service_url: string;
    name_id_policy_format: string;
    idp_entity_id: string;
    single_sign_on_service_url: string;
}
export interface IUserSettingSSOOpenID extends IUserSettingSSOCommon {
    config: IUserSettingSSOOpenIDConfig;
}
export interface IUserSettingSSOSaml extends IUserSettingSSOCommon {
    config: IUserSettingSSOSamlConfig;
}
export type IUserSettingSSO = IUserSettingSSOOpenID | IUserSettingSSOSaml;
export interface IUserSettingSSOBaseRequest {
    display_name: string;
    config: IUserSettingSSOOpenIDConfig | IUserSettingSSOSamlConfig;
}
