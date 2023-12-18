export interface IAnomaly {
    cloud_provider: string;
    client_name: string;
    billing_account_id: string;
    business_group: string;
    business_unit: string;
    linked_account_id: string;
    linked_account_name: string;
    product: string;
    cloud_region: string;
    cloud_zone: string;
    product_cost_detail_category: string;
    cost_category: string;
    billing_unit: string;
    average_resource_count: number;
    average_daily_usage: number;
    average_net_fiscal: number;
    average_daily_ondemand: number;
    current_resource_count: number;
    current_usage_amount: number;
    current_net_fiscal: number;
    current_ondemand_cost: number;
    usage_difference: number;
    ondemand_difference: number;
    anomaly: string;
    date_tested: number;
    id: string;
}

export interface IAnomaliesGetResponse {
    current_page?: number;
    links?: [];
    data: IAnomaly[];
}

export enum AnomalyCategory {
    NetFiscal = 'Net Fiscal Spike',
    OnDemand = 'OnDemand Spike',
    Usage = 'Usage Spike',
}
