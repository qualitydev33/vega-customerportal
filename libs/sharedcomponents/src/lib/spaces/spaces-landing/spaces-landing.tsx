import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { ConfirmDeleteContainerDialog, CreateContainerDialog, SchedulerDialog } from '@vegaplatformui/sharedcomponents';
import { Stack } from '@mui/material';
import { SpacesCard } from './spaces-card';
import { SpacesSummaryCard } from './spaces-summary-card';
import { SpaceDetailSummaryCard } from '../space-detail/space-detail-summary-card';
import { SpaceDetailCard } from '../space-detail/space-detail-card';
import { WorkloadDetailSummaryCard } from '../../workload-detail/workload-detail-summary-card';
import { WorkloadDetailCard } from '../../workload-detail/workload-detail-card';
import { ResourcePoolDetailSummaryCard } from '../../resource-pool-detail/resource-pool-detail-summary-card';
import { ResourcePoolDetailCard } from '../../resource-pool-detail/resource-pool-detail-card';
import { ContainerType, IResource, IVegaContainer } from '@vegaplatformui/models';

export type CreateContainerForm = {
    containerType: ContainerType;
    name: string;
    budget: number;
    space_id?: string;
    description?: string;
    childrenTable?: IResource[];
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISpacesLandingProps {
    containerToDelete: IVegaContainer | undefined;
    isConfirmDeleteDialogOpen: boolean;
    onCloseConfirmDeleteDialog: () => void;
    onConfirmDeleteContainer: (container: IVegaContainer | undefined) => void;
    containerToEditForm: CreateContainerForm;
    setContainerToEditForm: Dispatch<SetStateAction<CreateContainerForm>>;
    isDialogOpen: boolean;
    onCloseDialog: () => void;
    onSubmitCreateContainerForm: (form: CreateContainerForm, children: IResource[]) => void;
    onClickDeleteSpace: (container: IVegaContainer | undefined) => void;
    spaces: IVegaContainer[];
    onClickEditSpace: (container: IVegaContainer) => void;
    containerToEdit: IVegaContainer | undefined;
    isLoading: boolean;
    onOpenDialog: (type: ContainerType) => void;
    resources: IResource[];
    isResourcesLoading: boolean;
    /*ToDo replace with the workload props when the spaces api is more flushed out. Not sure if the get workloads call shows soft deleted workloads or not*/
    workloads: IVegaContainer[];
}

const SpacesLanding: React.FC<ISpacesLandingProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [createContainerLocation, setCreateContainerLocation] = React.useState<ContainerType>(ContainerType.Space);
    const [content, setContent] = React.useState<JSX.Element>();

    useEffect(() => {
        setContent(
            <>
                {/*<SpacesSummaryCard spaces={props.spaces} />*/}
                <SpacesCard
                    onClickTableItem={onClickTableItem}
                    spaces={props.spaces}
                    isLoading={props.isLoading}
                    onOpenSpaceDialog={props.onOpenDialog}
                    onClickEditSpace={props.onClickEditSpace}
                    onClickDeleteSpace={props.onClickDeleteSpace}
                />
            </>
        );
    }, [props.spaces]);

    const onClickTableItem = (container: IVegaContainer[], containerType?: ContainerType) => {
        //ToDo find table item  and refilter list of spaces which likely should be in recoil state
        const filteredItems = container;
        switch (containerType) {
            case ContainerType.Space:
                setCreateContainerLocation(ContainerType.Space);
                setContent(
                    <>
                        {/*<SpaceDetailSummaryCard spaces={filteredItems} />*/}
                        <SpaceDetailCard
                            onClickTableItem={onClickTableItem}
                            onClickGoBackToParent={onClickGoBackToParent}
                            spaces={filteredItems}
                            isLoading={props.isLoading}
                            onOpenSpaceDialog={props.onOpenDialog}
                            onClickEditSpace={props.onClickEditSpace}
                        />
                    </>
                );
                break;
            case ContainerType.Workload:
                setCreateContainerLocation(ContainerType.Workload);
                setContent(
                    <>
                        {/*<WorkloadDetailSummaryCard workloads={filteredItems} />*/}
                        <WorkloadDetailCard
                            onClickTableItem={onClickTableItem}
                            onClickGoBackToParent={onClickGoBackToParent}
                            spaces={filteredItems}
                            isLoading={props.isLoading}
                            onClickEditSpace={props.onClickEditSpace}
                            onOpenDialog={props.onOpenDialog}
                        />
                    </>
                );
                break;
            case ContainerType.ResourcePool:
                setCreateContainerLocation(ContainerType.ResourcePool);
                setContent(
                    <>
                        {/*<ResourcePoolDetailSummaryCard resourcePool={filteredItems} />*/}
                        <ResourcePoolDetailCard
                            isLoading={props.isLoading}
                            onOpenDialog={props.onOpenDialog}
                            onClickEdit={props.onClickEditSpace}
                            spaces={filteredItems}
                            onClickTableItem={onClickTableItem}
                            onClickGoBackToParent={onClickGoBackToParent}
                        />
                    </>
                );
                break;
        }
    };

    const onClickGoBackToParent = (container: IVegaContainer) => {
        switch (container.container_type) {
            case ContainerType.ResourcePool.toLowerCase():
                const parentWorkload = props.spaces.find((space) => space.id === container.parent_id);
                setCreateContainerLocation(ContainerType.Workload);
                setContent(
                    <>
                        {/*<WorkloadDetailSummaryCard workloads={props.spaces} />*/}
                        <WorkloadDetailCard
                            onClickTableItem={onClickTableItem}
                            onClickGoBackToParent={onClickGoBackToParent}
                            spaces={props.spaces.filter((space) => space.path?.split('/')[1] === parentWorkload?.name)}
                            isLoading={props.isLoading}
                            onClickEditSpace={props.onClickEditSpace}
                            onOpenDialog={props.onOpenDialog}
                        />
                    </>
                );
                break;
            case ContainerType.Workload.toLowerCase():
                //set filter to containing space
                const parentSpace = props.spaces.find((space) => space.id === container.parent_id);
                setCreateContainerLocation(ContainerType.Space);
                setContent(
                    <>
                        {/*<SpaceDetailSummaryCard spaces={props.spaces.filter((space) => space.path?.split('/')[0] === parentSpace?.name)} />*/}
                        <SpaceDetailCard
                            onClickTableItem={onClickTableItem}
                            onClickGoBackToParent={onClickGoBackToParent}
                            spaces={props.spaces.filter((space) => space.path?.split('/')[0] === parentSpace?.name)}
                            isLoading={props.isLoading}
                            onOpenSpaceDialog={props.onOpenDialog}
                            onClickEditSpace={props.onClickEditSpace}
                        />
                    </>
                );
                break;
            case ContainerType.Space.toLowerCase():
                //set to initial state\
                setCreateContainerLocation(ContainerType.Space);
                setContent(
                    <>
                        {/*<SpacesSummaryCard spaces={props.spaces} />*/}
                        <SpacesCard
                            onClickTableItem={onClickTableItem}
                            spaces={props.spaces}
                            isLoading={props.isLoading}
                            onOpenSpaceDialog={props.onOpenDialog}
                            onClickEditSpace={props.onClickEditSpace}
                            onClickDeleteSpace={props.onClickDeleteSpace}
                        />
                    </>
                );
        }
    };

    return (
        <>
            <SchedulerDialog isDialogOpen={false} onCloseDialog={() => {}} />
            <ConfirmDeleteContainerDialog
                container={props.containerToDelete}
                isConfirmDeleteDialogOpen={props.isConfirmDeleteDialogOpen}
                onCloseConfirmDeleteDialog={props.onCloseConfirmDeleteDialog}
                confirmDeleteContainer={props.onConfirmDeleteContainer}
            />
            <CreateContainerDialog
                createContainerLocation={createContainerLocation}
                containerToEditForm={props.containerToEditForm}
                setContainerToEditForm={props.setContainerToEditForm}
                isDialogOpen={props.isDialogOpen}
                onCloseDialog={props.onCloseDialog}
                onSubmitCreateContainerForm={props.onSubmitCreateContainerForm}
                containerToEdit={props.containerToEdit}
                onClickDeleteSpace={props.onClickDeleteSpace}
                allContainers={props.spaces}
                spaces={props.spaces.filter((container) => container.container_type === ContainerType.Space.toLowerCase())}
                workloads={props.spaces.filter((container) => container.container_type === ContainerType.Workload.toLowerCase())}
                resourcePools={props.spaces.filter((container) => container.container_type === ContainerType.ResourcePool.toLowerCase())}
                resources={props.resources}
                isResourcesLoading={props.isResourcesLoading}
            />
            <Stack direction={'column'} spacing={1}>
                {content}
            </Stack>
        </>
    );
};

const useStyles = makeStyles<ISpacesLandingProps>()((theme, props) => ({}));

export { SpacesLanding };
