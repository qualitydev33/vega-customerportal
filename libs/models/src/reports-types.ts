export interface IDashboard {
    id: string;
    name: string;
    dashboardId: string;
    principal: string;
}

export interface ListDashboardsRequest {
    folderNames: string[];
    tags?: AwsTag[];
}

export interface AwsTag {
    key: string;
    value: string;
}
