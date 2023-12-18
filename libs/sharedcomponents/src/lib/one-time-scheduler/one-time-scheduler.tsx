import React, { useEffect } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { UTCDate } from '@date-fns/utc';
import { DateTimePicker } from '@mui/x-date-pickers';
import { FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { ITimeZone } from '@vegaplatformui/utils';
import { FormField } from '@vegaplatformui/sharedcomponents';
// @ts-ignore
import { minimalTimezoneSet } from 'compact-timezone-list';
import dayjs from 'dayjs';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IOneTimeSchedulerProps {
    setDateToSchedule: (date: Date | undefined) => void;
    timezone: ITimeZone;
    onChangeTimezone: (timezone: ITimeZone) => void;
    defaultValue?: Date;
}

const OneTimeScheduler: React.FC<IOneTimeSchedulerProps> = (props) => {
    const { classes, cx } = useStyles(props);

    const onChangeTimezone = (timezone: ITimeZone) => {
        props.onChangeTimezone?.(timezone);
    };

    return (
        <Stack key={props.timezone.tzCode} spacing={1}>
            <FormField label='Time Zone' htmlFor='time_zone'>
                <FormControl id={'time_zone'} fullWidth>
                    {props.timezone === undefined ? (
                        <InputLabel className={cx(classes.TimeZoneInputLabel)} disableAnimation shrink={false} focused={false} id='item_type_label'>
                            Select a time zone
                        </InputLabel>
                    ) : null}
                    <Select
                        id={'time_zone'}
                        className={cx(classes.Dropdowns)}
                        size={'small'}
                        value={props.timezone?.tzCode ?? ''}
                        displayEmpty={true}
                        onChange={(e) => {
                            onChangeTimezone(minimalTimezoneSet.find((s: ITimeZone) => s.tzCode === e.target.value));
                        }}
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
            <FormField label='Date Time' htmlFor='date_time'>
                <DateTimePicker
                    key={props.defaultValue?.toString() ?? 'default'}
                    value={props.defaultValue !== undefined ? dayjs(props.defaultValue) : undefined}
                    ampm={false}
                    timezone={props.timezone?.tzCode ?? undefined}
                    disableIgnoringDatePartForTimeValidation
                    disablePast={true}
                    onChange={(event: any) => {
                        props.setDateToSchedule(event['$d']);
                    }}
                    label={'Select a Date & Time'}
                    slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
            </FormField>
        </Stack>
    );
};

const useStyles = makeStyles<IOneTimeSchedulerProps>()((theme, props) => ({
    TimeZoneInputLabel: {
        marginTop: '-.5rem',
        color: '#9C9CA7',
    },
    Dropdowns: {
        minWidth: '100%',
    },
}));

export { OneTimeScheduler };
