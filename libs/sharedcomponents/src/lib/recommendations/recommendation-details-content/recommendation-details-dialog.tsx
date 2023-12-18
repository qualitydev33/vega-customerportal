import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import {
    Button,
    Card,
    CardContent,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fade,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Grid,
    Grow,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    Slide,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { IGetRecommendationResponse, IRecommendation, IResource, RecommendationActionType, ResourcesEntity } from '@vegaplatformui/models';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormField, OneTimeScheduler, SnackBarOptions } from '@vegaplatformui/sharedcomponents';
import { RecommendationDetailsContentFeedbackDialog } from './recommendation-details-content-feedback-dialog';
import { useRecoilState } from 'recoil';
import { SampleRecDetails } from '@vegaplatformui/sharedassets';
import axios from 'axios';
import { TransitionProps } from '@mui/material/transitions';
import { CancelButton, dateToCron, ITimeZone } from '@vegaplatformui/utils';
import { RecommendationsApi } from '@vegaplatformui/apis';
import { Cron, CronError } from 'react-js-cron';
import dayjs from 'dayjs';
// @ts-ignore
import { minimalTimezoneSet } from 'compact-timezone-list';

export interface IRecommendationDetailsProps {
    recommendation: IGetRecommendationResponse;
    isScheduled?: boolean;
    isActionNow?: boolean;
    isHushed?: boolean;
    recommendationResources: IResource[];
    onCloseDialog(): void;
    showDialog: boolean;
    recommendationsApi: RecommendationsApi;
    loadRecommendation: () => void;
}

const RecommendationDetailsDialog: React.FC<IRecommendationDetailsProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
    const [snackbarOptions, setSnackbarOptions] = useRecoilState(SnackBarOptions);
    const [recDetails, setRecDetails] = useState<any>(null);
    const [dateToSchedule, setDateToSchedule] = React.useState<Date | undefined>(undefined);
    const [scheduleType, setScheduleType] = React.useState('Parked Schedule');
    const [confirmText, setConfirmText] = React.useState('');
    const [timezone, setTimezone] = React.useState<ITimeZone>(
        minimalTimezoneSet.find((t: ITimeZone) => t.offset === dayjs(dayjs().tz(dayjs.tz.guess()).utcOffset()).format('Z'))
    );

    useEffect(() => {
        axios.get(SampleRecDetails).then((response) => {
            setRecDetails(response.data);
        });
    }, []);

    const [remindAgain, setRemindAgain] = React.useState({
        twentyFourHours: true,
        never: false,
        schedule: false,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRemindAgain({
            twentyFourHours: false,
            never: false,
            schedule: false,
            [event.target.name]: event.target.checked,
        });
    };

    const { twentyFourHours, never, schedule } = remindAgain;

    const onClickHush = () => {
        props.onCloseDialog();
        setSnackbarOptions({
            snackBarProps: { open: true, autoHideDuration: 6000 },
            alertProps: { severity: 'info' },
            message: `${props.recommendation.rec.rec_type} action has ${props.isHushed ? 'been hushed' : 'started'}`,
        });
        setIsFeedbackDialogOpen(true);
    };

    const onClickSchedule = () => {
        switch (props.recommendation.rec.rec_type) {
            default:
                props.recommendationsApi
                    .postTakeAction({
                        recommendationId: props.recommendation.rec.id,
                        resources: props.recommendationResources,
                        schedule: dateToCron(dateToSchedule!, timezone.tzCode),
                        timezone: timezone?.tzCode,
                    })
                    .then((response) => {
                        props.loadRecommendation();
                        setSnackbarOptions({
                            snackBarProps: { open: true, autoHideDuration: 6000 },
                            alertProps: { severity: 'info' },
                            message: `${props.recommendation.rec.rec_type} action has ${props.isHushed ? 'been hushed' : 'scheduled'}`,
                        });
                    })
                    .catch((error) => {
                        setSnackbarOptions({
                            snackBarProps: { open: true, autoHideDuration: 6000 },
                            alertProps: { severity: 'error' },
                            message: `There was a problem executing your request: ${error}`,
                        });
                    })
                    .finally(() => {
                        props.onCloseDialog();
                        setIsFeedbackDialogOpen(true);
                    });
                break;
        }
    };

    const onClickImmediate = () => {
        let now = new Date();
        now.setMinutes(now.getMinutes() + 1);

        props.recommendationsApi
            .postTakeAction({
                recommendationId: props.recommendation.rec.id,
                resources: props.recommendationResources,
                schedule: dateToCron(now, timezone.tzCode),
                timezone: timezone?.tzCode,
            })
            .then((response) => {
                props.loadRecommendation();
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: `${props.recommendation.rec.rec_type} action has ${props.isHushed ? 'been hushed' : 'started'}`,
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem executing your request: ${error}`,
                });
            })
            .finally(() => {
                props.onCloseDialog();
                setIsFeedbackDialogOpen(true);
            });
    };

    const getHandler = (): (() => void) => {
        if (props.isHushed) return onClickHush;
        if (props.isScheduled) return onClickSchedule;
        if (props.isActionNow) return onClickImmediate;
        return () => {};
    };

    return (
        <>
            {/* <RecommendationDetailsContentFeedbackDialog onCloseDialog={setIsFeedbackDialogOpen} isDialogOpen={isFeedbackDialogOpen} /> */}
            <Dialog TransitionComponent={Fade} maxWidth={'lg'} open={props.showDialog} fullWidth={true}>
                <DialogTitle variant={'h6'}>{props.recommendation.rec.rec_type}</DialogTitle>
                <DialogContent>
                    <div dangerouslySetInnerHTML={{ __html: recDetails }} />

                    {props.isActionNow ? (
                        <FormField className={cx(classes.DialogContentForm)} label='To take action now, please type CONFIRM' htmlFor={'confimField'}>
                            <TextField value={confirmText} onChange={(e) => setConfirmText(e.target.value)} fullWidth />
                        </FormField>
                    ) : (
                        <Stack className={cx(classes.DialogContentForm)} spacing={3}>
                            <FormField label='Choose when you would like to start this action' htmlFor={'datePicker'}>
                                <OneTimeScheduler timezone={timezone} onChangeTimezone={setTimezone} setDateToSchedule={setDateToSchedule} />
                            </FormField>
                        </Stack>
                    )}
                    {props.isHushed && (
                        <>
                            <Stack spacing={2}>
                                <FormControl component='fieldset' variant='standard'>
                                    <FormField
                                        className={cx(classes.DialogContentForm)}
                                        label='Choose when you would like to be reminded of this recommendation again'
                                        htmlFor={'confirmField'}
                                    >
                                        <FormGroup>
                                            <FormControlLabel
                                                control={<Radio checked={twentyFourHours} onChange={handleChange} name='twentyFourHours' />}
                                                label='24 hours'
                                            />
                                            <FormControlLabel
                                                control={<Radio checked={never} onChange={handleChange} name='never' />}
                                                label='Never'
                                            />
                                            <FormControlLabel
                                                control={<Radio checked={schedule} onChange={handleChange} name='schedule' />}
                                                label='Schedule'
                                            />
                                        </FormGroup>
                                    </FormField>
                                </FormControl>
                                {remindAgain.schedule && (
                                    <div>
                                        <FormField label='Choose when you would like to start this action' htmlFor={'datePicker'}>
                                            <DateTimePicker slotProps={{ textField: { fullWidth: true } }} />
                                        </FormField>
                                    </div>
                                )}
                            </Stack>
                        </>
                    )}
                    <DialogActions className={cx(classes.DialogActions)}>
                        <CancelButton
                            onClick={() => {
                                props.onCloseDialog();
                            }}
                            variant='contained'
                            disableElevation
                        >
                            Cancel
                        </CancelButton>
                        <Button
                            onClick={() => {
                                setConfirmText('');
                                let handler = getHandler();
                                handler();
                            }}
                            variant='contained'
                            disableElevation
                            disabled={(props.isActionNow && confirmText !== 'CONFIRM') || (!props.isActionNow && dateToSchedule === undefined)}
                        >
                            Ok
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>
    );
};

const useStyles = makeStyles<IRecommendationDetailsProps>()((theme, props) => ({
    DialogContentForm: { marginBottom: '2rem' },
    DialogHeader: {
        marginTop: '1rem',
    },
    DialogActions: {
        marginRight: '-.5rem',
    },
    ChronSchedule: {
        '& .react-js-cron-field > span': {
            fontWeight: 'bold',
        },
    },
    ChronDialog: {
        zIndex: 2,
    },
}));

export { RecommendationDetailsDialog };
