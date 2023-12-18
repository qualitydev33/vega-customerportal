export enum ContainerType {
    Space = 'space',
    Workload = 'workload',
    ResourcePool = 'resource_pool',
    Resource = 'resource',
}

export interface IVegaContainer {
    id: string;
    container_type: ContainerType;
    name: string;
    path: string;
    provider: string[] | null;
    cost: number;
    description: string;
    budget: number;
    itemsExceededBudget: string;
    nested: string;
    parent_id: string;
    is_default: boolean;
}
