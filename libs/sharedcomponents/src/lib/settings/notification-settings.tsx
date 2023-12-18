import { Button, Divider, Grid, Stack, Switch, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Form } from '@vegaplatformui/sharedcomponents';
import { SubmitHandler } from 'react-hook-form';
import { makeStyles } from '@vegaplatformui/styling';
import { CancelButton } from '@vegaplatformui/utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface INotificationSettingsProps {}

const NotificationSettings: React.FC<INotificationSettingsProps> = (props) => {
    const theme = useTheme();
    const { classes, cx } = useStyles();

    const notifications = [
        {label: 'Account', field: 'account', description: 'Notifications related to account management, such as changes in subscription plans, billing updates, or account expiration.'},
        {label: 'Service Updates', field: 'service_updates', description: "Notifications about updates, enhancements, or new features added to the platform's services."},
        {label: 'Savings', field: 'savings', description: 'Notifications about cost optimization alerts.'},
        {label: 'System Alerts', field: 'system_alerts', description: 'Notifications about system-wide issues, maintenance windows, or scheduled downtime.'},
        {label: 'Performance', field: 'performance', description: 'Notifications regarding performance metrics, such as CPU or memory utilization, network latency, or response times.'},
        {label: 'Backup and Recovery', field: 'backup_recovery', description: 'Notifications about backup completion, recovery progress, or backup failures.'},
        {label: 'Resource Utilization', field: 'resource_utilization', description: 'Notifications about resource usage, such as storage capacity, database connections, or virtual machine usage reaching certain thresholds.'},
        {label: 'User Activity', field: 'user_activity', description: 'Notifications about user activities, such as login attempts, password changes, or access requests.'},
        {label: 'API', field: 'api', description: 'Notifications related to API usage, including updates to API documentation, deprecations, or changes to authentication methods.'},
        {label: 'Traning and Education', field: 'traning_education', description: 'Notifications about webinars, training sessions, or educational resources available to users.'},
    ];

    const onSubmit: SubmitHandler<any> = (data) => {
        // TODO
    };

    return (
        <div>
            <Form onSubmit={onSubmit}>
                {({ errors, register, watch, setValue, formState, reset }) => {
                    return (
                        <Stack spacing={1}>
                            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} mb={3}>
                                <Stack>
                                    <Typography variant='body1' fontWeight={600}>
                                        Notifications
                                    </Typography>
                                    <Typography variant='body2' color={theme.palette.grey[600]}>
                                        Manage how you receive notifications in the platform, emails, and messaging.
                                    </Typography>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} marginLeft={'auto'}>
                                        <Typography variant='subtitle2' fontWeight={'bold'}>
                                            In Platform
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>

                            {notifications.map((notif, i) => (
                                <React.Fragment key={notif.field}>
                                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                        <Stack>
                                            <Typography fontSize={12} fontWeight={theme.typography.fontWeightBold}>
                                                {notif.label}
                                            </Typography>
                                            <Typography fontSize={12} color={theme.palette.grey[600]}>
                                                {notif.description}
                                            </Typography>
                                        </Stack>
                                        <Switch id={`platform-${notif.field}`} {...register(`notification_platform_${notif.field}`)} />
                                    </Stack>
                                    <Divider />
                                </React.Fragment>
                            ))}

                            <Grid item xs={12}>
                                <Stack spacing={2} direction={'row'} justifyContent={'end'} mt={3}>
                                    <CancelButton
                                        onClick={() =>
                                            reset({
                                                // TODO: Pass in initial values
                                            })
                                        }
                                        variant='contained'
                                        color='inherit'
                                        disabled={!formState.isDirty}
                                        type='button'
                                    >
                                        Cancel
                                    </CancelButton>
                                    <Button variant='contained' disabled={!formState.isDirty} type='submit'>
                                        Save
                                    </Button>
                                </Stack>
                            </Grid>
                        </Stack>
                    );
                }}
            </Form>
        </div>
    );
};

const useStyles = makeStyles()((theme) => ({}));

export { NotificationSettings };
