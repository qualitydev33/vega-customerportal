import React, { useEffect } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { CancelButton, ITimeZone } from '@vegaplatformui/utils';
import { DateTimePicker } from '@mui/x-date-pickers';
import { IResource } from '@vegaplatformui/models';
import parser from 'cron-parser';
import { OneTimeScheduler } from '@vegaplatformui/sharedcomponents';
import dayjs from 'dayjs';
// @ts-ignore
import { minimalTimezoneSet } from 'compact-timezone-list';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IEditRecommendationScheduleDialogProps {
    selectedResources: IResource[];
    onCloseDialog: () => void;
    isDialogOpen: boolean;
    onClickSaveSchedule: (date: Date, timezone: ITimeZone | undefined) => void;
}

const EditRecommendationScheduleDialog: React.FC<IEditRecommendationScheduleDialogProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [dateToSchedule, setDateToSchedule] = React.useState<Date | undefined>(undefined);
    const [timezone, setTimezone] = React.useState<ITimeZone>(
        minimalTimezoneSet.find((t: ITimeZone) => t.offset === dayjs(dayjs().tz(dayjs.tz.guess()).utcOffset()).format('Z'))
    );

    useEffect(() => {
        handleLoadSchedule();
    }, [props.selectedResources]);

    useEffect(() => {
        handleLoadSchedule();
    }, []);

    const handleLoadSchedule = () => {
        if (props.selectedResources && props.selectedResources.length > 0) {
            if (
                props.selectedResources.length === 1 &&
                props.selectedResources[0].schedule !== undefined &&
                props.selectedResources[0].schedule !== null
            ) {
                const date = parser.parseExpression(props.selectedResources[0].schedule, { tz: props.selectedResources[0].timezone });
                setTimezone(minimalTimezoneSet.find((t: ITimeZone) => t.tzCode === props.selectedResources[0].timezone));
                setDateToSchedule(date.next().toDate());
            } else {
                setDateToSchedule(undefined);
                setTimezone(minimalTimezoneSet.find((t: ITimeZone) => t.offset === dayjs(dayjs().tz(dayjs.tz.guess()).utcOffset()).format('Z')));
            }
        }
    };

    return (
        <Dialog fullWidth={true} maxWidth={'sm'} open={props.isDialogOpen} onClose={props.onCloseDialog}>
            <DialogTitle>{`Edit schedule for ${
                props.selectedResources && props.selectedResources.length > 1
                    ? 'selected resources'
                    : `${props.selectedResources && props.selectedResources.length === 1 && props.selectedResources[0].resource_id}`
            }`}</DialogTitle>
            <DialogContent>
                <OneTimeScheduler
                    timezone={timezone}
                    onChangeTimezone={setTimezone}
                    defaultValue={dateToSchedule}
                    setDateToSchedule={setDateToSchedule}
                />
            </DialogContent>
            <DialogActions>
                <CancelButton
                    disableElevation
                    onClick={() => {
                        handleLoadSchedule();
                        props.onCloseDialog();
                    }}
                >
                    Cancel
                </CancelButton>
                <Button
                    disabled={dateToSchedule === undefined}
                    disableElevation
                    variant={'contained'}
                    onClick={() => props.onClickSaveSchedule(dateToSchedule!, timezone)}
                    autoFocus
                >
                    Save Schedule
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const useStyles = makeStyles<IEditRecommendationScheduleDialogProps>()((theme, props) => ({}));

export { EditRecommendationScheduleDialog };
