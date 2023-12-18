import { ResourcesEntity } from './recommendations-types';
import { IResource } from './resource-types';

export interface IActionResponse {
    type: string;
    id: string;
}
export interface IPostTakeActionRequest {
    resources: IResource[];
    recommendationId: string;
    schedule?: string;
    timezone?: string;
}

export interface IPostTakeImmediateActionRequest {
    resourceId: string;
    action: string;
}

export interface IPutPoliciesRequest {
    policyId: string;
    data: any;
}

export enum RecommendationActionType {
    park = 'park',
    unpark = 'unpark',
}

export interface IParkingSchedule_Deprecated {
    on_cron_expression: string;
    off_cron_expression: string;
}

export interface IParkingSchedule {
    id?: string;
    name?: string;
    description?: string;
    is_active?: boolean;
    utc_offset?: string;
    scheduled_on_times?: Date[];
    resources?: IResource[];
    num_hourly_chunks?: number;
    last_modified?: Date;
    observe_daylight_savings?: boolean;
    recommendation_id?: string;
}

export interface IParkingScheduleSummary {
    id: string;
    name: string;
    description: string;
    utc_offset: string;
    number_of_resources: number;
    updated_at: Date;
}

export interface IGetParkingPolicySummariesResponse {
    total_rows: number;
    policies: IParkingScheduleSummary[];
}
