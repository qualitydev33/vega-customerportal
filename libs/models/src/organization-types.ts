export interface IOrganizationOwner {
    firstName: string;
    lastName: string;
    emailAddress: string;
}

// Api Path: /api/organizations POST/PATCH
export interface IOrganizationPostRequest {
    name: string;
    slug: string;
    owner: IOrganizationOwner;
    keycloakRealm: string;
    domain: string;
    sku: number;
    isTrial: boolean;
    trialStart?: string;
    trialEnd?: string;
    isMSP: boolean;
    isChildOrg: boolean;
    childOrg?: string;
    created_by: string;
}

// Api Path: /api/organizations/:id GET
export interface IOrganizationResponse {
    id: string;
    name: string;
    status: string;
    sku: number;
    is_enabled: number;
    registered_at: string;
}

// Api Path /api/organizations GET
export interface IOrganizationsResponse {
    data: IOrganizationResponse[];
}

// Api Path /api/organizations/:id/<enable|disable> PATCH
export interface IOrganizationStatusUpdateResponse {
    message: string;
}
