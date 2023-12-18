import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import {
    ResourcesSummaryCard,
    SnackBarOptions,
    useErrorHandlingV2,
    ResourcesAll,
    CreateContainerDialog,
    CreateContainerForm,
    defaultVegaTableControl,
    vegaTableControls,
    useTableUtilities,
} from '@vegaplatformui/sharedcomponents';
import { useKeycloak } from '@react-keycloak-fork/web';
import { Button, Card, CardContent, Grid, Menu, MenuItem, Stack, Tab, Tabs, Typography } from '@mui/material';
import { ContainerApi, RecommendationsApi } from '@vegaplatformui/apis';
import { ContainerType, IParkingSchedule, IResource, IResourcesSummary, IVegaContainer } from '@vegaplatformui/models';
import { useRecoilState } from 'recoil';
import { PlayArrow, Stop, Add, ArrowDropUp, ArrowDropDown } from '@mui/icons-material';
import { RecurringSchedule } from 'libs/sharedcomponents/src/lib/drawer-scheduler/recurring-schedule';
import { DrawerScheduler } from 'libs/sharedcomponents/src/lib/drawer-scheduler/drawer-scheduler';
import { GridFilterModel } from '@mui/x-data-grid';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IResourcesControllerProps {}

const resourcesTabs = [
    { label: 'All', id: 'all' },
    // { label: 'Aws', id: 'aws' },
    // { label: 'Azure', id: 'azure' },
    // { label: 'Gcp', id: 'gcp' },
];
const defaultContainerToEditForm = {
    containerType: ContainerType.ResourcePool,
    name: '',
    budget: 0,
    space_id: '',
    description: '',
};
const defaultResourcesSummary = {
    projected_monthly_savings: 0,
    actual_savings_mtd: 0,
    num_resources: 0,
    active_resources: 0,
    resources_on_a_schedule: 0,
};

const ResourcesController: React.FC<IResourcesControllerProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const { keycloak } = useKeycloak();
    const [snackbarOptions, setSnackbarOptions] = useRecoilState(SnackBarOptions);
    const [withErrorHandlingV2] = useErrorHandlingV2();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isCreateMenuOpen = Boolean(anchorEl);
    const [isCreateResourcePoolDialog, setIsCreateResourcePoolDialog] = useState<boolean>(false);
    const [isDrawerScheduleOpen, setIsDrawerScheduleOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState(resourcesTabs[0].id);
    const [resources, setResources] = useState<IResource[]>([]);
    const [workloads, setWorkloads] = useState<IVegaContainer[]>([]);
    const [selectedResources, setSelectedResources] = useState<IResource[]>([]);
    const resourcesTableUtilities = useTableUtilities('resources-table');

    const [summary, setSummary] = useState<IResourcesSummary>(defaultResourcesSummary);
    const [containerToEditForm, setContainerToEditForm] = React.useState<CreateContainerForm>(defaultContainerToEditForm);
    const [scheduleToEdit, setScheudleToEdit] = React.useState<IParkingSchedule | undefined>(undefined);

    const containerApi = useMemo(() => {
        const containerApiInstance = new ContainerApi();
        containerApiInstance.token = keycloak.token ?? '';
        return containerApiInstance;
    }, [keycloak.token]);

    const recommendationsApi = useMemo(() => {
        const recommendationsApiInstance = new RecommendationsApi();
        recommendationsApiInstance.token = keycloak.token ?? '';
        return recommendationsApiInstance;
    }, [keycloak.token]);

    const onTabChange = (event: React.ChangeEvent<object>, newValue: string) => {
        setCurrentTab(newValue);
    };

    const onClickToggleCreateDropDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const onCloseToggleCreateDropDown = () => {
        setAnchorEl(null);
    };

    const onClickCreateResourcePoolItem = () => {
        onCloseToggleCreateDropDown();
        setIsCreateResourcePoolDialog(true);
    };
    const onClickParkingScheduleItem = () => {
        onCloseToggleCreateDropDown();
        setIsDrawerScheduleOpen(true);
    };

    const getSummary = async () => {
        withErrorHandlingV2(async () => {
            const res = await containerApi.getResourcesSummary();
            if (res.status !== 200) return;
            setSummary(res.data);
        }, 'There was an error getting summary informations.');
    };

    const getResources = () => {
        if (resourcesTableUtilities.currentTableControl !== undefined) {
            withErrorHandlingV2(async () => {
                setIsLoading(true);
                if (resourcesTableUtilities.currentTableControl !== undefined) {
                    const res = await containerApi.loadResources({
                        sortModel: resourcesTableUtilities.currentTableControl.sortModel,
                        filterModel: resourcesTableUtilities.currentTableControl.filterModel,
                        paginationModel: resourcesTableUtilities.currentTableControl.paginationModel,
                    });
                    if (res.status !== 200) return;
                    setResources(res.data.resources);
                    resourcesTableUtilities.updateTotalRows(res.data.total_rows);
                }
                setIsLoading(false);
            }, 'There was an error loading resources.');
        }
    };

    const getWorkloads = () => {
        withErrorHandlingV2(async () => {
            const res = await containerApi.loadWorkloads();
            if (res.status !== 200) return;
            setWorkloads(
                res.data.map((x: any) => {
                    return {
                        id: x.id,
                        container_type: ContainerType.Workload,
                        name: x.name,
                        description: x.description,
                        parent_id: x.space_id,
                    };
                })
            );
        }, 'There was an error loading workloads.');
    };

    const onCloseCreateContainerDialog = useCallback(() => {
        setIsCreateResourcePoolDialog(false);
        setContainerToEditForm(defaultContainerToEditForm);
    }, []);

    const onSubmitCreateContainerForm = useCallback((data: CreateContainerForm, children: IResource[]) => {
        withErrorHandlingV2(
            async () => {
                const res = await containerApi.createResourcePool({
                    name: data.name,
                    budget: 0, //data.budget
                    description: data.description,
                    workload_id: data.space_id ? data.space_id : null,
                    resources: children,
                });
            },
            'There was a problem creating your resource pool',
            'Your resource pool was created successfully'
        );
    }, []);

    const onCloseDrawerScheduler = useCallback(() => {
        setIsDrawerScheduleOpen(false);
    }, []);

    useEffect(() => {
        setScheudleToEdit((prev) => ({
            ...prev,
            resources: selectedResources,
        }));
    }, [selectedResources]);

    useEffect(() => {
        getWorkloads();
    }, []);

    useEffect(() => {
        getSummary();
        getResources();
    }, [
        resourcesTableUtilities.currentTableControl?.paginationModel,
        resourcesTableUtilities.currentTableControl?.sortModel,
        resourcesTableUtilities.currentTableControl?.filterModel,
    ]);

    return (
        <Stack direction={'column'} spacing={1}>
            <ResourcesSummaryCard summary={summary} />
            <Card elevation={0}>
                <CardContent>
                    <Grid container direction={'column'} marginBottom={4}>
                        <Grid item xs={12} container>
                            <Typography fontWeight={600} variant={'h5'}>
                                Resources
                            </Typography>
                        </Grid>
                        <Grid item xs={12} container direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                            {/*<Typography variant={'subtitle1'}>*/}
                            {/*  Your resources are populated from a data workflow every night. Create a Resource Pool to group together resources and*/}
                            {/*  take action.*/}
                            {/*</Typography>*/}
                            <Stack direction={'column'} spacing={0}>
                                <Typography variant={'subtitle1'}>
                                    Resources are discovered from provider accounts and are populated from a data workflow every night.
                                </Typography>
                                <Typography variant={'subtitle1'}>
                                    They have the option to be populated by a manual resource discovery in Provider Accounts.
                                </Typography>
                            </Stack>
                            <Stack direction={'row'}>
                                <Button
                                    startIcon={<Add />}
                                    variant={'contained'}
                                    onClick={onClickToggleCreateDropDown}
                                    endIcon={isCreateMenuOpen ? <ArrowDropUp /> : <ArrowDropDown />}
                                    disabled={!selectedResources.length}
                                >
                                    Create
                                </Button>
                                <Menu id='resource-create-menu' anchorEl={anchorEl} open={isCreateMenuOpen} onClose={onCloseToggleCreateDropDown}>
                                    <MenuItem onClick={onClickCreateResourcePoolItem}>Resource Pool</MenuItem>
                                    <MenuItem onClick={onClickParkingScheduleItem}>Parking Schedule</MenuItem>
                                </Menu>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Stack direction='column'>
                        <div>
                            {/*<Tabs variant='scrollable' value={currentTab} onChange={onTabChange}>*/}
                            {/*    {resourcesTabs.map((currentTab) => (*/}
                            {/*        <Tab key={currentTab.id} label={currentTab.label.toUpperCase()} value={currentTab.id} />*/}
                            {/*    ))}*/}
                            {/*</Tabs>*/}
                        </div>
                        <div>
                            {/*{currentTab === 'all' ? (*/}

                            {/*) : currentTab === 'aws' ? (*/}
                            {/*    <></>*/}
                            {/*) : currentTab === 'azure' ? (*/}
                            {/*    <></>*/}
                            {/*) : currentTab === 'gcp' ? (*/}
                            {/*    <></>*/}
                            {/*) : (*/}
                            {/*    <div>Unknow section</div>*/}
                            {/*)}*/}
                            <ResourcesAll
                                setSelectedResources={setSelectedResources}
                                selectedResources={selectedResources}
                                resources={resources}
                                isLoading={isLoading}
                                recommendationsApi={recommendationsApi}
                            />
                        </div>
                    </Stack>
                </CardContent>
            </Card>
            <CreateContainerDialog
                createContainerLocation={ContainerType.ResourcePool}
                containerToEditForm={containerToEditForm}
                setContainerToEditForm={setContainerToEditForm}
                isDialogOpen={isCreateResourcePoolDialog}
                onCloseDialog={onCloseCreateContainerDialog}
                onSubmitCreateContainerForm={onSubmitCreateContainerForm}
                containerToEdit={undefined}
                onClickDeleteSpace={(space) => {}}
                allContainers={[]}
                spaces={[]}
                workloads={workloads}
                resourcePools={[]}
                resources={[]}
                enableResourcesTableDisplay={false}
                isResourcesLoading={false}
                selectedResources={selectedResources}
            />
            <DrawerScheduler
                width={'60%'}
                isOpen={isDrawerScheduleOpen}
                enableEditAttachResourcesDrawer={false}
                scheduleToEdit={scheduleToEdit}
                resources={[]}
                isLoading={false}
                onCloseDrawer={onCloseDrawerScheduler}
                onCancel={onCloseDrawerScheduler}
                onSave={() => {}}
            />
        </Stack>
    );
};

const useStyles = makeStyles<IResourcesControllerProps>()((theme, props) => ({
    Tabpanel: {
        paddingBlock: theme.spacing(2),
    },
    StopButton: {
        marginLeft: '1rem',
        marginRight: '1rem',
    },
}));

export { ResourcesController };
