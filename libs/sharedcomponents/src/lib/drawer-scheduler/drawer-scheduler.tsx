import React, { useEffect, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Button, Drawer, Grid, IconButton, SelectChangeEvent, Stack, Typography, useTheme } from '@mui/material';
import { IRecurringScheduleForm, RecurringSchedule, ResetButton } from './recurring-schedule';
import { AttachResourcesDropdown } from './attach-resources-dropdown';
import { EditAttachResourcesDrawer } from './edit-attach-resources-drawer';
import { Close } from '@mui/icons-material';
import { IParkingSchedule, IResource } from '@vegaplatformui/models';
import { IParkingScheduleForm, useTableUtilities } from '@vegaplatformui/sharedcomponents';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDrawerSchedulerProps {
    onCancel: () => void;
    isOpen: boolean;
    width: string;
    resources: IResource[];
    isLoading: boolean;
    scheduleToEdit?: IParkingSchedule;
    enableEditAttachResourcesDrawer?: boolean;
    onCloseDrawer: () => void;
    onSave: (parkingSchedule: IParkingScheduleForm) => void;
    onChangesMade?: (parkingSchedule: IParkingScheduleForm) => void;
    onDelete?: (parkingSchedule: IParkingSchedule) => void;
    selectedResources?: IResource[];
    isServerPaginated?: boolean;
}

const DrawerScheduler: React.FC<IDrawerSchedulerProps> = ({ enableEditAttachResourcesDrawer = true, ...props }) => {
    const { classes, cx } = useStyles(props);
    const [scheduleType, setScheduleType] = React.useState('Scheduler');
    const [isEditAttachResourcesDrawerOpen, setIsEditAttachResourcesDrawerOpen] = React.useState(false);
    const [selectedResources, setSelectedResources] = useState<IResource[]>(props.scheduleToEdit?.resources ?? props.selectedResources ?? []);
    const [recurringScheduleForm, setRecurringScheduleForm] = useState<IRecurringScheduleForm>();
    const createScheduleResourceTableControls = useTableUtilities('create-schedule-resources-table');

    const onChangeScheduleType = (event: SelectChangeEvent) => {
        setScheduleType(event.target.value);
    };

    const onClickSave = () => {
        props.onSave({ ...recurringScheduleForm, selectedResources });
        props.onCloseDrawer();
    };

    const onClickDelete = () => {
        props.onDelete && props.scheduleToEdit && props.onDelete(props.scheduleToEdit);
        props.onCloseDrawer();
    };

    useEffect(() => {
        props.onChangesMade && props.onChangesMade({ ...recurringScheduleForm, selectedResources });
        setSelectedResources(props.scheduleToEdit?.resources || props.selectedResources || selectedResources);
    }, [props.scheduleToEdit, recurringScheduleForm]);

    const onCancelSaveResourceEdits = () => {
        setSelectedResources(props.scheduleToEdit?.resources || props.selectedResources || []);
    };

    return (
        <>
            <Drawer
                PaperProps={{
                    className: cx(classes.DrawerPaper),
                }}
                classes={{ root: cx(classes.DrawerRoot) }}
                anchor={'right'}
                open={props.isOpen}
                onClose={() => console.log('on close clicked')}
            >
                <Grid className={cx(classes.Container)} container direction={'row'}>
                    <Grid alignItems='flex-start' justifyContent='space-between' direction={'row'} container item xs={12}>
                        <Grid item xs={10}>
                            <Stack direction={'column'} spacing={0}>
                                <Typography variant={'h6'}>Create a parking schedule</Typography>
                                <Typography variant={'subtitle1'} className={cx(classes.Subtitle)}>
                                    Create and manage recurring schedules to park and unpark resources. Drag across day and time slots to create a
                                    parking schedule.
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={2}>
                            {/*                       <FormControl size={'small'} sx={{ float: 'right', minWidth: '11rem' }}>
                            <Select value={scheduleType} onChange={onChangeScheduleType}>
                                <MenuItem value={'Scheduler'}>Scheduler</MenuItem>
                                <MenuItem value={'Cron Scheduler'}>Cron Scheduler</MenuItem>
                            </Select>
                        </FormControl>*/}
                            <IconButton onClick={props.onCancel} className={cx(classes.CloseButton)}>
                                <Close />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container>
                        <Grid item xs={12}>
                            <RecurringSchedule onChangesMade={setRecurringScheduleForm} scheduleToEdit={props.scheduleToEdit} />
                        </Grid>
                        <Grid item xs={12}>
                            <AttachResourcesDropdown
                                selectedResources={selectedResources}
                                setSelectedResources={setSelectedResources}
                                resources={selectedResources}
                                isLoading={props.isLoading}
                                onClickEditAttachResources={() => {
                                    setIsEditAttachResourcesDrawerOpen(true);
                                }}
                                disableEditAttachResourcesDrawer={props.resources.length === 0 && selectedResources.length === 0}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Stack direction='row' justifyContent='flex-end' alignItems='center' spacing={2} className={cx(classes.ActionButtonStack)}>
                    {props.scheduleToEdit && (
                        <Button onClick={onClickDelete} color={'error'} className={cx(classes.DeleteScheduleButton)} variant={'contained'}>
                            Delete Schedule
                        </Button>
                    )}
                    <ResetButton onClick={props.onCloseDrawer}>Cancel</ResetButton>
                    <Button
                        disabled={recurringScheduleForm?.name !== undefined && recurringScheduleForm?.name === ''}
                        onClick={onClickSave}
                        variant={'contained'}
                    >
                        Save
                    </Button>
                </Stack>
            </Drawer>
            {enableEditAttachResourcesDrawer && (
                <EditAttachResourcesDrawer
                    isServerPaginated={props.isServerPaginated}
                    onCancel={onCancelSaveResourceEdits}
                    isEditing={props.scheduleToEdit !== undefined}
                    selectedResources={selectedResources}
                    setSelectedResources={setSelectedResources}
                    resources={[...props.resources]}
                    onClickBack={() => setIsEditAttachResourcesDrawerOpen(false)}
                    isOpen={isEditAttachResourcesDrawerOpen}
                    width={props.width}
                />
            )}
        </>
    );
};

const useStyles = makeStyles<IDrawerSchedulerProps>()((theme, props) => ({
    DrawerRoot: {
        zIndex: '1300 !important' as any,
    },
    DeleteScheduleButton: { marginRight: 'auto', marginLeft: '1rem' },
    DrawerPaper: { width: props.width },
    Container: { padding: '1rem', overflow: 'auto' },
    CloseButton: { float: 'right', marginRight: '-1rem', marginTop: '-1rem' },
    ActionButtonStack: { marginTop: 'auto', marginBottom: '1rem', marginRight: '1rem', paddingTop: '1rem' },
    Subtitle: { paddingBottom: '1rem' },
}));

export { DrawerScheduler };
