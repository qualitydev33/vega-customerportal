import { IUser } from './users-types';

export type IBusinessGrouping = {
    id: string;
    name: string;
    users: IUser[];
    owned_by: string;
    type: number;
    organization_id: string;
    parent_id: string;
};

export type IBusinessGroupingType = {
    id: number;
    name: string;
    is_active: boolean;
};

export interface IListBusinessGroupingsRequest {
    page: number;
    size: number;
    filter: string;
    ordering: string;
    fields: string;
}

export interface IGetBusinessGroupingTypesRequest {
    page: number;
    size: number;
    filter: string;
    ordering: string;
    fields: string;
}

export interface IGetBusinessGroupingRequest {
    id: string;
}

export interface IDeleteBusinessGroupingRequest {
    id: string;
}

export interface IDeleteBusinessGroupingsRequest {
    ids: string[];
}

export interface IPutBusinessGroupingRequest {
    name: string;
    type: number;
    users: IUser[];
}

export interface IPostBusinessGroupingRequest {
    name: string;
    type: number;
    users: IUser[];
}

export type IBusinessGroupingForm = {
    name: string;
    type: number;
    users: string[];
};
