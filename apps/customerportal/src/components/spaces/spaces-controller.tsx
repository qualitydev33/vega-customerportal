import React, { useEffect, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import {
    CreateContainerForm,
    defaultVegaTableControl,
    SnackbarErrorOutput,
    SnackBarOptions,
    SpacesLanding,
    useErrorHandlingV2,
    useTableUtilities,
    vegaTableControls,
} from '@vegaplatformui/sharedcomponents';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { spacesState } from '../../recoil/atom';
import { useKeycloak } from '@react-keycloak-fork/web';
import { ContainerApi } from '@vegaplatformui/apis';
import { ContainerType, IResource, IVegaContainer } from '@vegaplatformui/models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISpacesControllerProps {}

const SpacesController: React.FC<ISpacesControllerProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [spaces, setSpaces] = useRecoilState(spacesState);
    const setSnackbarOptions = useSetRecoilState(SnackBarOptions);
    const { keycloak } = useKeycloak();
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [containerToEdit, setContainerToEdit] = React.useState<IVegaContainer | undefined>(undefined);
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = React.useState<boolean>(false);
    const [containerToDelete, setContainerToDelete] = React.useState<IVegaContainer | undefined>(undefined);
    const [tableControls, setTableControls] = useRecoilState(vegaTableControls);
    const [withErrorHandlingV2] = useErrorHandlingV2();
    const [resources, setResources] = useState<IResource[]>([]);
    const [workloads, setWorkloads] = useState<IVegaContainer[]>([]);
    const [isLoadingResources, setIsLoadingResources] = useState(false);
    const resourceChildrenTableUtilities = useTableUtilities('resource-children-table');

    const [containerToEditForm, setContainerToEditForm] = React.useState<CreateContainerForm>({
        containerType: containerToEdit?.container_type ?? ContainerType.Space,
        name: containerToEdit?.name ?? '',
        budget: containerToEdit?.budget ?? 0,
        space_id: containerToEdit ? spaces.find((container) => container.id === containerToEdit?.parent_id)?.id : '',
        description: containerToEdit?.description ?? '',
    });
    const containerApi = new ContainerApi();
    containerApi.token = keycloak.token ?? '';

    useEffect(() => {
        loadSpaces();

        setTableControls((controls) => {
            return [
                ...controls,
                {
                    key: 'spaces-table',
                    value: { ...defaultVegaTableControl },
                },
                {
                    key: 'space-detail-table',
                    value: { ...defaultVegaTableControl },
                },
            ];
        });
        return () => {
            setTableControls((controls) => {
                return controls.filter((control) => control.key !== 'space-detail-table' && control.key !== 'space-detail-table');
            });
        };
    }, []);

    const loadSpaces = () => {
        setIsLoading(true);
        containerApi
            .loadSpaces({ limit: 10, offset: 0 })
            .then((response) => {
                setSpaces(response.data);
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem loading spaces: ${SnackbarErrorOutput(error)}`,
                });
            });
        setIsLoading(false);
    };

    const getWorkloads = () => {
        containerApi
            .loadWorkloads()
            .then((response) => {
                setWorkloads(response.data);
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem loading workloads`,
                });
            });
    };

    const getResources = () => {
        if (resourceChildrenTableUtilities.currentTableControl !== undefined) {
            withErrorHandlingV2(async () => {
                setIsLoadingResources(true);
                if (resourceChildrenTableUtilities.currentTableControl !== undefined) {
                    const res = await containerApi.loadResources({
                        paginationModel: resourceChildrenTableUtilities.currentTableControl.paginationModel,
                        filterModel: resourceChildrenTableUtilities.currentTableControl.filterModel,
                        sortModel: resourceChildrenTableUtilities.currentTableControl.sortModel,
                    });
                    if (res.status !== 200) return;
                    setResources(res.data.resources);
                    resourceChildrenTableUtilities.updateTotalRows(res.data.total_rows);
                }
                setIsLoadingResources(false);
            }, 'There was an error loading resources.');
        }
    };

    useEffect(() => {
        if (isDialogOpen) {
            getResources();
        }
    }, [
        resourceChildrenTableUtilities.currentTableControl?.paginationModel,
        resourceChildrenTableUtilities.currentTableControl?.sortModel,
        resourceChildrenTableUtilities.currentTableControl?.filterModel,
    ]);

    const onOpenDialog = (type: ContainerType) => {
        if (type === ContainerType.ResourcePool) {
            //getWorkloads();
            getResources();
        }
        setIsDialogOpen(true);
        setContainerToEditForm({
            containerType: containerToEdit?.container_type ?? type,
            name: containerToEdit?.name ?? '',
            budget: containerToEdit?.budget ?? 0,
            space_id: containerToEdit ? spaces.find((container) => container.id === containerToEdit?.parent_id)?.id : '',
            description: containerToEdit?.description ?? '',
        });
    };

    const onCloseDialog = () => {
        setIsDialogOpen(false);
        setContainerToEdit(undefined);
    };

    const onClickEditSpace = (space: IVegaContainer) => {
        if (space.container_type === ContainerType.ResourcePool) {
            //getWorkloads();
            getResources();
        }
        setContainerToEdit(space);
        setContainerToEditForm({
            containerType: space?.container_type ?? ContainerType.Space,
            name: space?.name ?? '',
            budget: space?.budget ?? 0,
            space_id: spaces.find((container) => container.id === space?.parent_id)?.id ?? '',
            description: space?.description ?? '',
        });
        setIsDialogOpen(true);
    };

    const onClickDeleteSpace = (space?: IVegaContainer) => {
        setContainerToDelete(space);
        setIsConfirmDeleteDialogOpen(true);
    };

    const handleError = (message: string) => {
        setSnackbarOptions({
            snackBarProps: { open: true, autoHideDuration: 6000 },
            alertProps: { severity: 'error' },
            message: message,
        });
    };

    const handleSuccess = (message: string) => {
        setSnackbarOptions({
            snackBarProps: { open: true, autoHideDuration: 6000 },
            alertProps: { severity: 'info' },
            message: message,
        });
        loadSpaces();
    };

    const onSubmitContainerForm = async (data: CreateContainerForm, selectedChildren: IResource[]) => {
        switch (data.containerType) {
            case ContainerType.Space:
                containerToEdit
                    ? containerApi
                          //.updateSpace({ name: data.name, budget: data.budget, description: data.description }, containerToEdit!.id)
                          .updateSpace({ name: data.name, budget: 0, description: data.description }, containerToEdit!.id)
                          .then((response) => {
                              handleSuccess('Your space was edited successfully');
                              loadSpaces();
                          })

                          .catch((error) => {
                              handleError(`There was a problem editing your space: ${SnackbarErrorOutput(error)}`);
                          })
                    : containerApi
                          //.createSpace({ name: data.name, budget: data.budget, description: data.description })
                          .createSpace({ name: data.name, budget: 0, description: data.description })
                          .then((response) => {
                              handleSuccess('Your space was created successfully');
                              loadSpaces();
                          })
                          .catch((error) => {
                              handleError(`There was a problem creating your space: ${SnackbarErrorOutput(error)}`);
                          });
                break;
            case ContainerType.Workload:
                containerToEdit
                    ? containerApi
                          // .updateWorkload(
                          //     { name: data.name, budget: data.budget, space_id: data.space_id, description: data.description },
                          //     containerToEdit!.id
                          // )
                          .updateWorkload(
                              {
                                  name: data.name,
                                  budget: 0,
                                  space_id: data.space_id !== undefined ? data.space_id : null,
                                  description: data.description,
                              },
                              containerToEdit!.id
                          )
                          .then((response) => {
                              handleSuccess('Your workload was edited successfully');
                              loadSpaces();
                          })
                          .catch((error) => {
                              handleError(`There was a problem editing your workload: ${SnackbarErrorOutput(error)}`);
                          })
                    : containerApi
                          // .createWorkload({ name: data.name, budget: data.budget, space_id: data.space_id, description: data.description })
                          .createWorkload({
                              name: data.name,
                              budget: 0,
                              space_id: data.space_id !== undefined ? data.space_id : null,
                              description: data.description,
                          })
                          .then((response) => {
                              handleSuccess('Your workload was created successfully');
                              loadSpaces();
                          })
                          .catch((error) => {
                              handleError(`There was a problem creating your workload: ${SnackbarErrorOutput(error)}`);
                          });
                break;
            case ContainerType.ResourcePool:
                containerToEdit
                    ? containerApi
                          // .updateResourcePool({ name: data.name, budget: data.budget, description: data.description }, containerToEdit!.id)
                          .updateResourcePool(
                              {
                                  name: data.name,
                                  budget: 0,
                                  description: data.description,
                                  workload_id: data.space_id !== undefined ? data.space_id : null,
                                  resources: selectedChildren.map((child) => {
                                      return { ...child, resource_pool_id: containerToEdit!.id } as IResource;
                                  }),
                              },
                              containerToEdit!.id
                          )
                          .then((response) => {
                              handleSuccess('Your resource pool was edited successfully');
                              loadSpaces();
                          })
                          .catch((error) => {
                              handleError(`There was a problem editing your resource pool: ${SnackbarErrorOutput(error)}`);
                          })
                    : containerApi
                          // .createResourcePool({ name: data.name, budget: data.budget, description: data.description, workload_id: data.space_id })
                          .createResourcePool({
                              name: data.name,
                              budget: 0,
                              description: data.description,
                              workload_id: data.space_id !== undefined ? data.space_id : null,
                              resources: selectedChildren.map((child) => {
                                  return { ...child, resource_pool_id: null } as IResource;
                              }),
                          })
                          .then((response) => {
                              handleSuccess('Your resource pool was created successfully');
                              loadSpaces();
                          })
                          .catch((error) => {
                              handleError(`There was a problem creating your resource pool: ${SnackbarErrorOutput(error)}`);
                          });
                break;
            default:
                throw new Error('Invalid container type');
        }
    };

    const onCloseConfirmDeleteDialog = () => {
        setIsConfirmDeleteDialogOpen(false);
    };

    const deleteContainer = (data: IVegaContainer) => {
        switch (data?.container_type) {
            case ContainerType.Space:
                containerApi
                    .deleteSpace(data.id)
                    .then((response) => {
                        handleSuccess('Your space was deleted successfully');
                    })
                    .catch((error) => {
                        handleError(`There was a problem deleting your space: ${SnackbarErrorOutput(error)}`);
                    });

                break;
            case ContainerType.Workload:
                containerApi
                    .deleteWorkload(data.id)
                    .then((response) => {
                        handleSuccess('Your workload was deleted successfully');
                    })
                    .catch((error) => {
                        handleError(`There was a problem deleting your workload: ${SnackbarErrorOutput(error)}`);
                    });
                break;
            case ContainerType.ResourcePool:
                containerApi
                    .deleteResourcePool(data.id)
                    .then((response) => {
                        handleSuccess('Your resource pool was deleted successfully');
                    })
                    .catch((error) => {
                        handleError(`There was a problem deleting your resource pool: ${SnackbarErrorOutput(error)}`);
                    });
                break;
            default:
                throw new Error('Invalid container type');
        }
    };

    const confirmDeleteContainer = (data?: IVegaContainer) => {
        deleteContainer(data!);
        setContainerToDelete(undefined);
        setIsConfirmDeleteDialogOpen(false);
        setIsDialogOpen(false);
    };

    return (
        <SpacesLanding
            spaces={spaces}
            isLoading={isLoading}
            onClickEditSpace={onClickEditSpace}
            onClickDeleteSpace={onClickDeleteSpace}
            onOpenDialog={onOpenDialog}
            onCloseDialog={onCloseDialog}
            onSubmitCreateContainerForm={onSubmitContainerForm}
            onCloseConfirmDeleteDialog={onCloseConfirmDeleteDialog}
            containerToEdit={containerToEdit}
            containerToEditForm={containerToEditForm}
            setContainerToEditForm={setContainerToEditForm}
            isDialogOpen={isDialogOpen}
            isConfirmDeleteDialogOpen={isConfirmDeleteDialogOpen}
            containerToDelete={containerToDelete}
            onConfirmDeleteContainer={confirmDeleteContainer}
            resources={resources}
            isResourcesLoading={isLoadingResources}
            workloads={workloads}
        />
    );
};

const useStyles = makeStyles<ISpacesControllerProps>()((theme, props) => ({}));

export { SpacesController };

function flat(array: any[]) {
    let result: IVegaContainer[] = [];
    array.forEach(function (a) {
        result.push(a);
        if (Array.isArray(a.children)) {
            result = result.concat(flat(a.children));
        }
    });
    return result;
}
