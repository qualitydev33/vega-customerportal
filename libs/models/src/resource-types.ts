import { IVegaContainer } from './space-types';
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid-premium';
import { GridFilterModel } from '@mui/x-data-grid';

export interface IResourceTag {
    name: string;
    owner: string;
    benjamin: string;
    environment: string;
}

export interface IResource {
    id: string;
    resource_id: string;
    provider_str: string;
    cost: number;
    cloud_account_id: string;
    resource_pool_id: string | null;
    type_str: string;
    is_parking_capable: boolean;
    is_snapshot_capable: boolean;
    region: string;
    tags?: IResourceTag;
    name?: string;
    date_detected?: string;
    updated_at?: string;
    schedule?: string;
    is_actioned?: boolean;
    scheduled_event_id?: string;
    os_type?: string;
    timezone?: string;
    is_running?: boolean;
}

export interface IGetResourcesResponse {
    total_rows: number;
    resources: IResource[];
}

export interface IGetParkableResourcesResponse {
    total_rows: number;
    resources: IResource[];
}

export interface IResourceContainersInfo {
    resource_pool_id: string;
    resource_pool_name: string;
    space_id: string;
    space_name: string;
    workload_id: string;
    workload_name: string;
}

export interface IResourcesSummary {
    projected_monthly_savings: number;
    actual_savings_mtd: number;
    num_resources: number;
    active_resources: number;
    resources_on_a_schedule: number;
}
