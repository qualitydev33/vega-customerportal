import { IResource } from './resource-types';

export interface ISpacesRequest {
    limit: number;
    offset: number;
}

export interface ICreateSpaceRequest {
    name: string;
    description?: string;
    budget: number;
}

export interface ICreateWorkloadRequest {
    name: string;
    budget: number;
    description?: string;
    space_id: string | null;
}

export interface ICreateResourcePoolRequest {
    name: string;
    description?: string;
    budget: number;
    workload_id: string | null;
    resources: IResource[];
}

export interface IUpdateResourcePoolRequest {
    name: string;
    description?: string;
    budget: number;
    workload_id: string | null;
    resources: IResource[];
}

export interface IUpdateWorkloadRequest {
    name: string;
    description?: string;
    budget: number;
    space_id: string | null;
}

export interface IResourcesGetRequest {
    page?: number;
    size?: number;
    fields: string;
    ordering?: string;
    filter?: string;
}

