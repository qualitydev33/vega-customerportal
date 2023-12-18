import React, { useEffect, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Cron, CronError } from 'react-js-cron';
import 'react-js-cron/dist/styles.css';
import {
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    PaperProps,
    Select,
    SelectChangeEvent,
    Stack,
} from '@mui/material';
import { PaperComponent } from '../utilities/paper-component';
import { CancelButton } from '@vegaplatformui/utils';
import { Add, Remove } from '@mui/icons-material';
import { VegaChronCard } from './vega-chron-card';

export enum ParkingType {
    Park = 'Park',
    Unpark = 'Unpark',
}

export type VegaSchedule = {
    chronTime: string;
    parkingType: ParkingType;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISchedulerDialogProps {
    isDialogOpen: boolean;
    onCloseDialog: () => void;
}

const SchedulerDialog: React.FC<ISchedulerDialogProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [scheduleValues, setScheduleValues] = useState<VegaSchedule[]>([
        { chronTime: '30 5 * * 1,6', parkingType: ParkingType.Park },
        { chronTime: '30 5 * * 1,5', parkingType: ParkingType.Unpark },
        { chronTime: '30 5 * * 1,4', parkingType: ParkingType.Park },
        { chronTime: '30 5 * * 1,3', parkingType: ParkingType.Unpark },
    ]);
    const [error, onError] = useState<CronError>();

    return (
        <Dialog
            fullWidth
            open={props.isDialogOpen}
            onClose={props.onCloseDialog}
            PaperComponent={(paperProps: PaperProps) => PaperComponent(paperProps, '#scheduler-dialog')}
            aria-labelledby='scheduler-dialog'
            className={cx(classes.ChronDialog)}
        >
            <DialogTitle className={cx(classes.FormTitle)} variant={'h6'} style={{ cursor: 'move' }} id='scheduler-dialog'>
                Edit Parking Schedules
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3} alignItems={'flex-start'} divider={<Divider orientation={'horizontal'} flexItem />}>
                    <IconButton
                        color={'primary'}
                        onClick={() => {
                            setScheduleValues([...scheduleValues, { chronTime: '* * * * *', parkingType: ParkingType.Park }]);
                        }}
                    >
                        <Add />
                    </IconButton>
                    {scheduleValues.map((scheduleValue) => {
                        return (
                            <VegaChronCard
                                key={`${scheduleValue.chronTime}-${scheduleValue.parkingType}`}
                                scheduleValues={scheduleValues}
                                setScheduleValues={setScheduleValues}
                                scheduleValue={scheduleValue}
                            />
                        );
                    })}
                </Stack>
                <DialogActions className={cx(classes.DialogActions)}>
                    <CancelButton
                        className={cx(classes.DialogButtons)}
                        disableElevation={true}
                        variant={'contained'}
                        color={'secondary'}
                        autoFocus
                        onClick={props.onCloseDialog}
                    >
                        Cancel
                    </CancelButton>
                    <Button className={cx(classes.DialogButtons)} disableElevation={true} type={'submit'} variant={'contained'}>
                        Save
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

const useStyles = makeStyles<ISchedulerDialogProps>()((theme, props) => ({
    FormStack: {
        marginTop: '1rem',
    },
    CancelButton: { color: theme.palette.grey[50] },
    DialogActions: {
        marginTop: '1rem',
        marginRight: '-.5rem',
    },
    FormTitle: {
        cursor: 'move',
        fontWeight: 600,
        marginTop: '1rem',
        marginBottom: '.5rem',
    },
    DialogButtons: {
        textTransform: 'none',
    },
    ChronDialog: {
        zIndex: 1,
    },
}));

export { SchedulerDialog };
