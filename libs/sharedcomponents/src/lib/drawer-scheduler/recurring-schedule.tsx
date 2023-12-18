import React, { ReactNode, useEffect } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { zonedTimeToUtc } from 'date-fns-tz';
import {
    Badge,
    Button,
    ButtonProps,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import { FormField, WeeklyScheduler } from '@vegaplatformui/sharedcomponents';
import { Circle, Info, RestartAlt } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { IParkingSchedule } from '@vegaplatformui/models';
import { ConfirmChangeIntervalDialog } from './confirm-change-interval-dialog';
// @ts-ignore
import { minimalTimezoneSet } from 'compact-timezone-list';
import { ITimeZone } from '@vegaplatformui/utils';
import { UTCDate } from '@date-fns/utc';
import dayjs from 'dayjs';
import 'dayjs/plugin/timezone';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRecurringScheduleProps {
    scheduleToEdit?: IParkingSchedule;
    onChangesMade?: (schedule: IRecurringScheduleForm) => void;
}

export const ResetButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(grey[500]),
    backgroundColor: grey[300],
    '&:hover': {
        backgroundColor: grey[500],
    },
}));

export interface IRecurringScheduleForm {
    name: string | undefined;
    description: string | undefined;
    isDaylightSavings: boolean;
    timezone: ITimeZone | undefined;
    intervals: number | undefined;
    schedule: Date[] | undefined;
}

const RecurringSchedule: React.FC<IRecurringScheduleProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [selectionStyle, setSelectionStyle] = React.useState('linear');
    const [intervals, setIntervals] = React.useState<number | undefined>(props.scheduleToEdit?.num_hourly_chunks ?? 1);
    const [schedule, setSchedule] = React.useState<Date[]>(props.scheduleToEdit?.scheduled_on_times ?? []);
    const [timezone, setTimezone] = React.useState<ITimeZone | undefined>(
        minimalTimezoneSet.find((t: ITimeZone) => t.offset === props.scheduleToEdit?.utc_offset) ??
            minimalTimezoneSet.find((t: ITimeZone) => t.offset === dayjs(dayjs().tz(dayjs.tz.guess()).utcOffset()).format('Z'))
    );
    const [scheduleName, setScheduleName] = React.useState<string | undefined>(props.scheduleToEdit?.name ?? '');
    const [scheduleDescription, setScheduleDescription] = React.useState<string | undefined>(props.scheduleToEdit?.description ?? '');
    const [isDaylightSavings, setIsDaylightSavings] = React.useState<boolean>(props.scheduleToEdit?.observe_daylight_savings ?? false);
    const [intervalToChangeTo, setIntervalToChangeTo] = React.useState<number | undefined>(undefined);
    const [showConfirmChangeIntervalDialog, setShowConfirmChangeIntervalDialog] = React.useState<boolean>(false);

    const theme = useTheme();

    const onChangeSchedule = (scheduleToUpdate: Date[]) => {
        setSchedule(scheduleToUpdate);
    };

    useEffect(() => {
        props.onChangesMade?.({
            name: scheduleName,
            description: scheduleDescription,
            isDaylightSavings: isDaylightSavings,
            timezone: timezone,
            intervals: intervals,
            schedule: schedule,
        });
    }, [schedule, intervals, timezone, isDaylightSavings, scheduleName, scheduleDescription]);

    const onChangeIntervals = (event: SelectChangeEvent<number>, child: ReactNode) => {
        setIntervalToChangeTo(Number(event.target.value));
        setShowConfirmChangeIntervalDialog(true);
    };

    return (
        <>
            <ConfirmChangeIntervalDialog
                show={showConfirmChangeIntervalDialog}
                onClose={() => setShowConfirmChangeIntervalDialog(false)}
                onConfirm={() => {
                    setIntervals(intervalToChangeTo);
                    setSchedule([]);
                    setShowConfirmChangeIntervalDialog(false);
                }}
            />
            <Grid spacing={2} container direction={'row'}>
                <Grid item xs={6}>
                    <FormField label='Parking Schedule Name' htmlFor='parking_schedule_name'>
                        <TextField
                            onChange={(e) => setScheduleName(e.target.value)}
                            id={'parking_schedule_name'}
                            fullWidth={true}
                            size='small'
                            defaultValue={scheduleName}
                            placeholder={'Create a name for your parking schedule'}
                        />
                    </FormField>
                </Grid>
                <Grid item xs={6}>
                    <FormField label='Description' htmlFor='description'>
                        <TextField
                            onChange={(e) => setScheduleDescription(e.target.value)}
                            id={'description'}
                            fullWidth={true}
                            size='small'
                            defaultValue={scheduleDescription}
                            placeholder={'Add a description'}
                        />
                    </FormField>
                </Grid>
                <Grid item xs={6}>
                    <FormField label='Time Zone' htmlFor='time_zone'>
                        <FormControl id={'time_zone'} fullWidth>
                            {timezone === undefined ? (
                                <InputLabel
                                    className={cx(classes.TimeZoneInputLabel)}
                                    disableAnimation
                                    shrink={false}
                                    focused={false}
                                    id='item_type_label'
                                >
                                    Select a time zone
                                </InputLabel>
                            ) : null}
                            <Select
                                id={'time_zone'}
                                className={cx(classes.Dropdowns)}
                                size={'small'}
                                value={timezone?.tzCode ?? ''}
                                displayEmpty={true}
                                onChange={(e) => setTimezone(minimalTimezoneSet.find((s: ITimeZone) => s.tzCode === e.target.value))}
                            >
                                {minimalTimezoneSet
                                    .sort(function (a: ITimeZone, b: ITimeZone) {
                                        var textA = a.label.split(' ')[1].toUpperCase();
                                        var textB = b.label.split(' ')[1].toUpperCase();
                                        return textA < textB ? -1 : textA > textB ? 1 : 0;
                                    })
                                    .map((timezone: ITimeZone) => (
                                        <MenuItem key={timezone.tzCode} value={timezone.tzCode}>
                                            {timezone.label}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </FormField>
                </Grid>
                <Grid item xs={3}>
                    <FormField
                        label={
                            <Stack direction={'row'}>
                                <Typography className={cx(classes.SelectionStyleFormFieldTypography)}>Selection Style</Typography>
                                <Tooltip
                                    title='When dragging, Linear selects the entire column while Square selects individual square slots'
                                    placement={'right'}
                                    arrow
                                >
                                    <Info className={cx(classes.TooltipIcons)} />
                                </Tooltip>
                            </Stack>
                        }
                        htmlFor='selection_style'
                    >
                        <Select
                            id={'selection_style'}
                            className={cx(classes.Dropdowns)}
                            size={'small'}
                            value={selectionStyle}
                            onChange={(e) => setSelectionStyle(e.target.value)}
                        >
                            <MenuItem value={'linear'}>Linear</MenuItem>
                            <MenuItem value={'square'}>Square</MenuItem>
                        </Select>
                    </FormField>
                </Grid>
                <Grid item xs={3}>
                    <FormField label='Time Interval' htmlFor='intervals'>
                        <Select id={'intervals'} className={cx(classes.Dropdowns)} size={'small'} value={intervals} onChange={onChangeIntervals}>
                            <MenuItem value={1}>60 Minutes</MenuItem>
                            <MenuItem value={2}>30 Minutes</MenuItem>
                            <MenuItem value={4}>15 Minutes</MenuItem>
                        </Select>
                    </FormField>
                </Grid>
                <Grid item xs={6} className={cx(classes.DaylightSavingsControlContainer)}>
                    <FormControlLabel
                        control={<Checkbox checked={isDaylightSavings} onChange={() => setIsDaylightSavings(!isDaylightSavings)} />}
                        label='Daylight Savings Time (DST)'
                    />
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={2} direction='row' justifyContent='flex-end'>
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <Circle className={cx(classes.RunningCircle)} />
                            <Typography>Running</Typography>
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <Circle className={cx(classes.StoppedCircle)} />
                            <Typography>Stopped</Typography>
                        </Stack>
                        <ResetButton
                            onClick={() => {
                                setSchedule([]);
                            }}
                            startIcon={<RestartAlt />}
                            variant={'contained'}
                        >
                            Reset Selection
                        </ResetButton>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <WeeklyScheduler
                        selectedDates={schedule}
                        onChangeSelectedDates={onChangeSchedule}
                        hourlyChunks={intervals}
                        selectionScheme={selectionStyle}
                    />
                </Grid>
            </Grid>
        </>
    );
};

const useStyles = makeStyles<IRecurringScheduleProps>()((theme, props) => ({
    Dropdowns: {
        minWidth: '100%',
    },
    RunningCircle: { fontSize: '1rem', fill: theme.palette.primary.main },
    StoppedCircle: {
        fontSize: '1rem',
        fill: '#F1EDFE',
    },
    DaylightSavingsControlContainer: { marginTop: '-1rem' },
    TimezoneSelectSelect: { '&.MuiFilledInput-input': { color: 'grey' } },
    TimeZoneInputLabel: {
        marginTop: '-.5rem',
        color: '#9C9CA7',
    },
    SelectionStyleFormFieldTypography: {
        fontSize: 12,
        fontWeight: theme.typography.fontWeightBold,
        color: theme.palette.grey['900'],
    },
    TooltipIcons: {
        fill: theme.palette.grey['500'],
        fontSize: '1rem',
        marginTop: '-.25rem',
    },
}));

export { RecurringSchedule };
