import React from 'react';
import { GridRowId } from '@mui/x-data-grid';
import { GridValueGetterParams } from '@mui/x-data-grid-premium';
import { ContainerType, IVegaContainer } from '@vegaplatformui/models';

export const GetAggregatedCosts = (params: GridValueGetterParams<IVegaContainer>, spaces: IVegaContainer[]) => {
    const uniqueResourcesRootPath = [
        ...new Set(spaces.filter((space) => ContainerType.Resource && space!.path.split('/').length >= 4).map((space) => space?.path.split('/')[0])),
    ];
    //if type is a resource and is contained in the overarching space use cost Aggregation
    if (
        uniqueResourcesRootPath.find((path) => {
            return params.row?.path.includes(path);
        }) !== undefined
    ) {
        return spaces
            .filter((space) => {
                switch (space.container_type) {
                    case ContainerType.Resource:
                        return space.container_type === ContainerType.Resource && space.parent_id === params.row?.id;
                    case ContainerType.ResourcePool:
                        return space.container_type === ContainerType.ResourcePool && space.parent_id === params.row?.id;
                    case ContainerType.Workload:
                        return space.container_type === ContainerType.Workload && space.parent_id === params.row?.id;
                    case ContainerType.Space:
                        return space.container_type === ContainerType.Space;
                }
            })
            .reduce((totalCost, currentValue) => {
                return totalCost + currentValue.cost;
            }, 0);
    }
};

export const GetAggregatedBudgets = (id: GridRowId, spaces: IVegaContainer[]) => {};
