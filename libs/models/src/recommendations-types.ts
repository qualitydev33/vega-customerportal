import { IResource } from './resource-types';
import { IDataGridRequest } from './api-types';

export interface IGetRecommendationSummaryResponse {
    total_rows: number;
    recommendations: IRecommendation[];
}

export interface IRecommendation {
    rec_type: string;
    rec_savings: string;
    location: string;
    num_resources: string;
    detected_at: string;
    id: string;
    rec_status?: string;
}

export interface IRecommendationResource {
    id: string;
    resource: string;
    region: string;
    date_detected: string;
    date_scheduled: string;
    usage: string;
    individual_vega_savings: string;
    schedule?: string;
}

export interface IGetRecommendationResponse {
    rec: Rec;
    resources: IResource[];
}

export interface IGetRecommendationsOverviewResponse {
    possible_savings: number;
    affected_resources: number;
    active_recommendations: number;
}

export interface Rec {
    id: string;
    rec_type: string;
    organization_id: string;
    category: number;
    status: number;
    business_unit_id: string;
    workload_id: string;
    recommendation_message: string;
    details_message: string;
    status_date: string;
    deleted_by: string;
    deleted_at: string;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
}
export interface ResourcesEntity {
    id: string;
    organization_id: string;
    provider_account_id: string;
    resource_pool_id: string;
    business_unit_id: string;
    resource_id: string;
    name: string;
    resource_type_id: number;
    region: string;
    last_seen: string;
    is_active: boolean;
    tags: Tags;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    deleted_by: string;
    deleted_at: string;
    schedule?: string;
}
export interface Tags {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
}

export interface IGetParkingPolicySummariesByRecIdRequest extends IDataGridRequest {
    recId: string;
}
