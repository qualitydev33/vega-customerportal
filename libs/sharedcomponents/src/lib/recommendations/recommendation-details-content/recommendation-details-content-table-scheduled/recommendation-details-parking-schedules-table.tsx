import React, { useEffect } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { ParkingSchedulesTable } from '../../../parking/parking-schedules-table';
import { IGetRecommendationResponse, IParkingSchedule, IParkingScheduleSummary } from '@vegaplatformui/models';
import { RecommendationsApi } from '@vegaplatformui/apis';
import { DrawerScheduler } from '../../../drawer-scheduler/drawer-scheduler';
import { IParkingScheduleForm, SnackBarOptions, useTableUtilities } from '@vegaplatformui/sharedcomponents';
import { useSetRecoilState } from 'recoil';
import { wait } from 'amazon-quicksight-embedding-sdk/dist/commons';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRecommendationDetailsParkingSchedulesTableProps {
    recommendationApi: RecommendationsApi;
    recommendation: IGetRecommendationResponse;
    loadRecommendation: () => void;
}

const RecommendationDetailsParkingSchedulesTable: React.FC<IRecommendationDetailsParkingSchedulesTableProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [selectedSchedules, setSelectedSchedules] = React.useState<IParkingScheduleSummary[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [scheduleToEdit, setScheduleToEdit] = React.useState<IParkingSchedule | undefined>(undefined);
    const [showDrawerScheduler, setShowDrawerScheduler] = React.useState<boolean>(false);
    const setSnackbarOptions = useSetRecoilState(SnackBarOptions);
    const [parkingSchedules, setParkingSchedules] = React.useState<IParkingScheduleSummary[]>([]);
    const parkingScheduleTableUtilities = useTableUtilities('parking-schedules-table');

    useEffect(() => {
        loadParkingSchedules();
    }, [
        parkingScheduleTableUtilities.currentTableControl?.paginationModel,
        parkingScheduleTableUtilities.currentTableControl?.sortModel,
        parkingScheduleTableUtilities.currentTableControl?.filterModel,
    ]);

    const loadParkingSchedules = () => {
        props.loadRecommendation();
        if (parkingScheduleTableUtilities.currentTableControl) {
            setIsLoading(true);
            props.recommendationApi
                .getParkingPolicySummariesByRecId({
                    recId: props.recommendation.rec.id,
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
                        message: `Error loading schedules: ${error}.`,
                    });
                })
                .finally(() => setIsLoading(false));
        }
    };

    const loadSelectedParkingSchedule = (scheduleId: string | undefined) => {
        if (scheduleId !== undefined) {
            setIsLoading(true);
            props.recommendationApi
                .getParkingPolicy(scheduleId)
                .then((response) => {
                    setScheduleToEdit({
                        ...response.data,
                        scheduled_on_times: response.data.scheduled_on_times?.map((date) => {
                            const dareAsString = date as unknown as string;
                            return new Date(dareAsString);
                        }),
                    });
                    setShowDrawerScheduler(true);
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

    const onClickSaveSchedule = (schedule: IParkingScheduleForm) => {
        setIsLoading(true);
        props.recommendationApi
            .putParking(scheduleToEdit!.id!, {
                recommendation_id: props.recommendation.rec.id,
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
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: `Schedule updated.`,
                });
                loadParkingSchedules();
                setShowDrawerScheduler(false);
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `Error updating schedule: ${error}.`,
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const onClickDeleteSchedules = async () => {
        setIsLoading(true);
        props.recommendationApi
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
                    message: `There was an error deleting some of your schedules.`,
                });
            })
            .finally(() => setIsLoading(false));
    };

    const onClickDeleteSchedule = (schedule: any) => {
        setIsLoading(true);
        props.recommendationApi
            .deleteParkingSchedule(schedule.id)
            .then((response) => {
                loadParkingSchedules();
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: `Schedule deleted.`,
                });
                setShowDrawerScheduler(false);
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `Error deleting schedule: ${error}.`,
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <>
            <DrawerScheduler
                isServerPaginated={false}
                scheduleToEdit={scheduleToEdit}
                onCancel={() => setShowDrawerScheduler(false)}
                isOpen={showDrawerScheduler}
                width={'60%'}
                resources={props.recommendation.resources}
                isLoading={isLoading}
                onCloseDrawer={() => setShowDrawerScheduler(false)}
                onSave={onClickSaveSchedule}
                onDelete={onClickDeleteSchedule}
            />
            <ParkingSchedulesTable
                disableFilters={true}
                parkingSchedules={parkingSchedules}
                selectedSchedules={selectedSchedules}
                setSelectedSchedules={setSelectedSchedules}
                isLoading={isLoading}
                onClickAction={loadSelectedParkingSchedule}
                onClickDelete={onClickDeleteSchedules}
            />
        </>
    );
};

const useStyles = makeStyles<IRecommendationDetailsParkingSchedulesTableProps>()((theme, props) => ({}));

export { RecommendationDetailsParkingSchedulesTable };
