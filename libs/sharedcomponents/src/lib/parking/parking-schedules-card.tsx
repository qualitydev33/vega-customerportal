import React, { useState } from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { Button, Card, CardContent, CircularProgress, Grid, Menu, MenuItem, Stack, Tooltip, Typography } from '@mui/material';
import { Add, Delete, FileCopy } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { ParkingSchedulesTable } from './parking-schedules-table';
import { IParkingSchedule, IParkingScheduleSummary, IResource } from '@vegaplatformui/models';
import { DrawerScheduler } from '../drawer-scheduler/drawer-scheduler';
import { IRecurringScheduleForm } from '../drawer-scheduler/recurring-schedule';
import { StyledToolTip } from '../utilities/styled-tooltip';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IParkingCardProps {
    parkingSchedules: IParkingScheduleSummary[];
    selectedSchedules: IParkingScheduleSummary[];
    setSelectedSchedules: React.Dispatch<React.SetStateAction<IParkingScheduleSummary[]>>;
    isLoading: boolean;
    onClickEditSchedule: (schedule: IParkingScheduleForm) => void;
    onClickCreateSchedule: (schedule: IParkingScheduleForm) => void;
    onClickDeleteSelectedSchedules: () => void;
    onClickDeleteSchedule: (schedule: any) => void;
    onClickCopySchedule: () => void;
    onClickSetCreateSnackbarTemp: (context: string) => void;
    parkableResources: IResource[];
    scheduleToEdit: IParkingSchedule | undefined;
    setScheduleToEdit: (schedule: IParkingScheduleSummary | undefined) => void;
    isDrawerOpen: boolean;
    onToggleDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IParkingScheduleForm extends Partial<IRecurringScheduleForm> {
    selectedResources: IResource[];
}

const ParkingSchedulesCard: React.FC<IParkingCardProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();

    const onClickCreate = () => {
        props.onToggleDrawer(true);
    };

    const onClickAction = (scheduleId: any) => {
        props.setScheduleToEdit(props.parkingSchedules.find((schedule) => schedule.id === scheduleId));
    };

    const onCloseDrawer = () => {
        props.setScheduleToEdit(undefined);
        props.onToggleDrawer(false);
    };

    return (
        <>
            <DrawerScheduler
                isServerPaginated={true}
                scheduleToEdit={props.scheduleToEdit}
                resources={props.parkableResources}
                isLoading={props.isLoading}
                width={'60%'}
                isOpen={props.isDrawerOpen}
                onCloseDrawer={onCloseDrawer}
                onCancel={() => props.onToggleDrawer(false)}
                onSave={props.scheduleToEdit ? props.onClickEditSchedule : props.onClickCreateSchedule}
                onDelete={props.onClickDeleteSchedule}
            />
            <Card elevation={0}>
                <CardContent>
                    <Grid container direction={'column'}>
                        <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                            <Grid xs={4} item>
                                <Typography className={commonStyles.cx(commonStyles.classes.PageCardTitle)} variant={'h5'}>
                                    Parking Schedules
                                </Typography>
                            </Grid>
                            <Grid xs={8} item container justifyContent={'flex-end'}>
                                <Stack direction={'row'} spacing={1}>
                                    <StyledToolTip
                                        title={props.parkableResources.length === 0 ? 'No available resources to park' : 'Create parking schedule'}
                                    >
                                        <span>
                                            <Button
                                                startIcon={<Add />}
                                                variant={'contained'}
                                                onClick={() => {
                                                    onClickCreate();
                                                }}
                                                disabled={props.parkableResources.length === 0}
                                            >
                                                Create Parking Schedule
                                            </Button>
                                        </span>
                                    </StyledToolTip>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                            <Grid xs={6} item>
                                <Typography variant={'subtitle1'} className={cx(classes.Subtitle)}>
                                    Schedule and manage your parked resources
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Stack>
                        <ParkingSchedulesTable
                            parkingSchedules={props.parkingSchedules}
                            selectedSchedules={props.selectedSchedules}
                            setSelectedSchedules={props.setSelectedSchedules}
                            isLoading={props.isLoading}
                            onClickAction={onClickAction}
                        />
                    </Stack>
                </CardContent>
            </Card>
        </>
    );
};

const useStyles = makeStyles<IParkingCardProps>()((theme, props) => ({
    Subtitle: {
        paddingBottom: '1rem',
    },
}));

export { ParkingSchedulesCard };
