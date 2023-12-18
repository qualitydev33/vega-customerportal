import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { ResourcesTable } from './resources-table';
import { IResource } from '@vegaplatformui/models';
import { RecommendationsApi } from '@vegaplatformui/apis';

export interface IResourcesAllProps {
    resources: IResource[];
    setSelectedResources: React.Dispatch<React.SetStateAction<IResource[]>>;
    selectedResources: IResource[];
    isLoading: boolean;
    recommendationsApi: RecommendationsApi;
}

const ResourcesAll: React.FC<IResourcesAllProps> = (props) => {
    const { classes, cx } = useStyles(props);
    return (
        <ResourcesTable
            selectedResources={props.selectedResources}
            setSelectedResources={props.setSelectedResources}
            resources={props.resources}
            isLoading={props.isLoading}
            isServerPaginated={true}
            recommendationsApi={props.recommendationsApi}
        />
    );
};

const useStyles = makeStyles<IResourcesAllProps>()((theme, props) => ({}));

export { ResourcesAll };
