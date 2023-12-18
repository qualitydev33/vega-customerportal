import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import {
    defaultVegaTableControl,
    IParkingScheduleForm,
    IVegaTableControl,
    ParkingSchedulesCard,
    SnackbarErrorOutput,
    SnackBarOptions,
    useTableUtilities,
    vegaTableControls,
} from '@vegaplatformui/sharedcomponents';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ActionsApi, ResourcesApi } from '@vegaplatformui/apis';
import { useKeycloak } from '@react-keycloak-fork/web';
import { IParkingSchedule, IParkingScheduleSummary, IResource } from '@vegaplatformui/models';
import { wait } from 'amazon-quicksight-embedding-sdk/dist/commons';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IParkingControllerProps {}

const ParkingController: React.FC<IParkingControllerProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const { keycloak } = useKeycloak();
    const [isLoading, setIsLoading] = useState(true);
    const [parkingSchedules, setParkingSchedules] = useState<IParkingScheduleSummary[]>([]);
    const [selectedSchedules, setSelectedSchedules] = useState<IParkingScheduleSummary[]>([]);
    const [tableControls, setTableControls] = useRecoilState(vegaTableControls);
    const [scheduleToEdit, setScheduleToEdit] = React.useState<IParkingSchedule | undefined>(undefined);
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const [resources, setResources] = useState<IResource[]>([]);
    const setSnackbarOptions = useSetRecoilState(SnackBarOptions);
    const parkingScheduleTableUtilities = useTableUtilities('parking-schedules-table');
    const createScheduleResourcesTableUtilities = useTableUtilities('create-schedule-resources-table');
    const [isParkableResourcesLoading, setIsParkableResourcesLoading] = useState(false);

    const resourcesApi = useMemo(() => {
        const resourcesApi = new ResourcesApi();
        resourcesApi.token = keycloak.token ?? '';
        return resourcesApi;
    }, [keycloak.token]);

    const actionsApi = useMemo(() => {
        const actionsApi = new ActionsApi();
        actionsApi.token = keycloak.token ?? '';
        return actionsApi;
    }, [keycloak.token]);

    useEffect(() => {
        loadParkingSchedules();
    }, [
        parkingScheduleTableUtilities.currentTableControl?.paginationModel,
        parkingScheduleTableUtilities.currentTableControl?.sortModel,
        parkingScheduleTableUtilities.currentTableControl?.filterModel,
    ]);

    useEffect(() => {
        loadParkableResources();
    }, [
        createScheduleResourcesTableUtilities.currentTableControl?.paginationModel,
        createScheduleResourcesTableUtilities.currentTableControl?.sortModel,
        createScheduleResourcesTableUtilities.currentTableControl?.filterModel,
        scheduleToEdit,
    ]);

    const loadSelectedParkingSchedule = (schedule: IParkingScheduleSummary | undefined) => {
        if (schedule !== undefined) {
            setIsLoading(true);
            actionsApi
                .getParkingPolicy(schedule.id)
                .then((response) => {
                    setScheduleToEdit({
                        ...response.data,
                        scheduled_on_times: response.data.scheduled_on_times?.map((date) => {
                            const dareAsString = date as unknown as string;
                            return new Date(dareAsString);
                        }),
                    });
                    setIsDrawerOpen(true);
                })
                .catch((error) => {
                    setSnackbarOptions({
                        snackBarProps: { open: true, autoHideDuration: 6000 },
                        alertProps: { severity: 'error' },
                        message: `Error loading schedule: ${error}.`,
                    });
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setScheduleToEdit(undefined);
        }
    };

    const loadParkingSchedules = () => {
        if (parkingScheduleTableUtilities.currentTableControl !== undefined) {
            setIsLoading(true);
            actionsApi
                .getParkingPolicySummaries({
                    paginationModel: parkingScheduleTableUtilities.currentTableControl.paginationModel,
                    sortModel: parkingScheduleTableUtilities.currentTableControl.sortModel,
                    filterModel: parkingScheduleTableUtilities.currentTableControl.filterModel,
                })
                .then((response) => {
                    setParkingSchedules(response.data.policies);
                    parkingScheduleTableUtilities.updateTotalRows(response.data.total_rows);
                })
                .catch((error) => {
                    setSnackbarOptions({
                        snackBarProps: { open: true, autoHideDuration: 6000 },
                        alertProps: { severity: 'error' },
                        message: `There was an error loading the parking schedules: ${SnackbarErrorOutput(error)}`,
                    });
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const loadParkableResources = () => {
        if (createScheduleResourcesTableUtilities.currentTableControl !== undefined) {
            setIsParkableResourcesLoading(true);
            resourcesApi
                .loadParkableResources(scheduleToEdit?.id ?? '', {
                    paginationModel: createScheduleResourcesTableUtilities.currentTableControl.paginationModel,
                    sortModel: createScheduleResourcesTableUtilities.currentTableControl.sortModel,
                    filterModel: createScheduleResourcesTableUtilities.currentTableControl.filterModel,
                })
                .then((response) => {
                    setResources(response.data.resources);
                    createScheduleResourcesTableUtilities.updateTotalRows(response.data.total_rows);
                })
                .catch((error) => {
                    setSnackbarOptions({
                        snackBarProps: { open: true, autoHideDuration: 6000 },
                        alertProps: { severity: 'error' },
                        message: `There was an error loading the resources: ${SnackbarErrorOutput(error)}`,
                    });
                })
                .finally(() => {
                    setIsParkableResourcesLoading(false);
                });
        }
    };

    const onClickDeleteSchedule = (schedule: any) => {
        setIsLoading(true);
        actionsApi
            .deleteParkingSchedule(schedule.id)
            .then((response) => {
                loadParkingSchedules();
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: `Schedule deleted.`,
                });
                setIsDrawerOpen(false);
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `Error deleting schedule: ${SnackbarErrorOutput(error)}.`,
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const onClickDeleteSchedules = async () => {
        setIsLoading(true);
        actionsApi
            .deleteParkingSchedules(selectedSchedules.map((schedule) => schedule.id))
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            .then(() => {
                loadParkingSchedules();
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: `Schedules deleted.`,
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was an error deleting some of your schedules: ${SnackbarErrorOutput(error)}`,
                });
            })
            .finally(() => setIsLoading(false));
    };

    const onClickCreateSchedule = (schedule: IParkingScheduleForm) => {
        actionsApi
            .postParking({
                name: schedule.name,
                description: schedule.description,
                resources: schedule.selectedResources,
                scheduled_on_times: schedule.schedule,
                num_hourly_chunks: schedule.intervals,
                is_active: true,
                observe_daylight_savings: schedule.isDaylightSavings,
                utc_offset: schedule.timezone?.offset,
            })
            .then((response) => {
                loadParkingSchedules();
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: `Schedule created.`,
                });
                setIsDrawerOpen(false);
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `Error creating schedule: ${SnackbarErrorOutput(error)}.`,
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const onClickEditSchedule = (schedule: IParkingScheduleForm) => {
        actionsApi
            .putParking(scheduleToEdit!.id!, {
                recommendation_id: scheduleToEdit!.recommendation_id,
                name: schedule.name,
                description: schedule.description,
                resources: schedule.selectedResources,
                scheduled_on_times: schedule.schedule,
                num_hourly_chunks: schedule.intervals,
                is_active: true,
                observe_daylight_savings: schedule.isDaylightSavings,
                utc_offset: schedule.timezone?.offset,
            })
            .then((response) => {
                loadParkingSchedules();
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: `Schedule updated.`,
                });
                setIsDrawerOpen(false);
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `Error updating schedule: ${SnackbarErrorOutput(error)}.`,
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const onClickCopySchedule = () => {
        console.log('This does something?');
        setSnackbarOptions({
            snackBarProps: { open: true, autoHideDuration: 6000 },
            alertProps: { severity: 'warning' },
            message: `Copy schedule button pressed`,
        });
    };

    return (
        <ParkingSchedulesCard
            onToggleDrawer={setIsDrawerOpen}
            isDrawerOpen={isDrawerOpen}
            setScheduleToEdit={loadSelectedParkingSchedule}
            scheduleToEdit={scheduleToEdit}
            parkableResources={resources}
            parkingSchedules={parkingSchedules}
            selectedSchedules={selectedSchedules}
            setSelectedSchedules={setSelectedSchedules}
            isLoading={isLoading || isParkableResourcesLoading}
            onClickCreateSchedule={onClickCreateSchedule}
            onClickEditSchedule={onClickEditSchedule}
            onClickDeleteSchedule={onClickDeleteSchedule}
            onClickDeleteSelectedSchedules={onClickDeleteSchedules}
            onClickCopySchedule={onClickCopySchedule}
            onClickSetCreateSnackbarTemp={(context: string) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'warning' },
                    message: `${context} button pressed`,
                });
            }}
        />
    );
};

const useStyles = makeStyles<IParkingControllerProps>()((theme, props) => ({}));

export { ParkingController };
