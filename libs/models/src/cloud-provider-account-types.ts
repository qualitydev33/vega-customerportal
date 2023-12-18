import { JsonObject } from 'react-use-websocket/dist/lib/types';

export interface ICloudAccountsRequest {
    page: number;
    size: number;
    filter: string;
    ordering: string;
    fields: string;
}

export interface IGetCloudAccountRequest {
    id: string;
}

export interface IDeleteCloudAccountsRequest {
    id: string;
}

export interface IDeleteCloudAccountsBatchRequest {
    ids: string[];
}

export interface IPostCloudAccountsRequest {
    id?: string;
    provider_str: string;
    account_id: string;
    account_name: string;
    parent_account_id: string | null;
    enabled: boolean;
    secret_json?: string;
    external_id?: string;
}

export interface IPostCloudAccountsBatchRequest {
    file: Blob;
}

export interface IPutCloudAccountsRequest {
    id?: string;
    provider_str: string;
    account_id: string;
    account_name: string;
    parent_account_id: string | null;
    enabled: boolean;
    secret_json?: string;
    external_id?: string;
    created_at: string;
    created_by: string;
}

export type IDiscoveryDetails = {
    in_cooldown: boolean;
    is_discovery: boolean;
    request_id: string;
    client_id: string;
    datetime_in_30min: number;
    shouldConnect: boolean;
};

export type DiscoveryResponseData = {
    client_id?: string;
    request_id?: string;
    org_id?: string;
    cooldown_time_remaining?: string;
};

export type DiscoveryAccounts = {
    accounts: string[];
};

export interface IDiscoverRequest extends JsonObject {
    event: DiscoveryEvents;
    data: DiscoveryAccounts;
}

export interface IDiscoveryResponse {
    event: DiscoveryEvents;
    data: DiscoveryResponseData;
}

export type ICloudProviderAccount = {
    id: string;
    account_id: string;
    account_name: string;
    provider_str: string;
    parent_account_id: string | null;
    business_unit_id: string;
    resources: number;
    expensesMtd: number;
    currentMonthForecast: number;
    roleId?: string;
    subscriptionId?: string;
    clientId?: string;
    secretKey?: string;
    tenantId?: string;
    type?: string;
    projectId?: string;
    privateKeyId?: string;
    privateKey?: string;
    deleted_by?: string;
    deleted_at?: string;
    created_by: string;
    created_at: string;
    updated_by?: string | null;
    updated_at: string | null;
    organization_id: string;
    enabled: boolean;
    secret_json: string;
    external_id?: string;
    discovered_at?: string;
    discovered_status: number;
    discovered_message?: string;
};

export type LinkAwsAccountForm = {
    isEditAccount: boolean;
    payer_account_id: string;
    account_name: string;
    account_id: string;
    external_id: string;
};

export type LinkAzureAccountForm = {
    isEditAccount: boolean;
    subscriptionId: string;
    subscription: string;
    clientId: string;
    clientSecret: string;
    tenantId: string;
};

export type LinkGcpAccountForm = {
    isEditAccount: boolean;
    service_account: string;
    project_name: string;
};

export enum DiscoveryEvents {
    NewConnection = 'new_connection',
    RequestDiscovery = 'request_discovery',
    ClientConnected = 'client_connected',
    ClientDisconnected = 'client_disconnected',
    AuthenticationFailed = 'authentication_failed',
    DiscoveryStarted = 'discovery_started',
    DiscoveryInProgress = 'discovery_inprogress',
    DiscoveryRequestFailed = 'discovery_request_failed',
    DiscoveryComplete = 'discovery_complete',
    DiscoveryCompleteWithFailures = 'discovery_complete_with_failures',
    DiscoveryCooldown = 'discovery_cooldown',
    AccessCheckAndDiscover = 'accesscheck_and_discover',
}

export enum FilterTableByProvider {
    Aws = 'aws',
    Gcp = 'gcp',
    Azure = 'azure',
    All = 'All',
}
