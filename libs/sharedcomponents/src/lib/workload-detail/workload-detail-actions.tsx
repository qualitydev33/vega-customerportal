import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Button, Stack } from '@mui/material';
import { WorkloadDetailActionCard } from './workload-detail-action-card';
import { SchedulerDialog } from '@vegaplatformui/sharedcomponents';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IWorkloadActionsProps {}

const WorkloadDetailActions: React.FC<IWorkloadActionsProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [test, setTest] = React.useState(false);

    return (
        <>
            <SchedulerDialog
                isDialogOpen={test}
                onCloseDialog={() => {
                    setTest(false);
                }}
            />
            <Stack spacing={0}>
                <WorkloadDetailActionCard
                    actionDescription={'This will park or unpark all resources in the workload'}
                    actionTitle={'Parking'}
                    actionButtons={[
                        <Button
                            disableElevation={true}
                            key={'parkingSchedule'}
                            className={cx(classes.Buttons)}
                            variant={'contained'}
                            onClick={() => {
                                setTest(true);
                            }}
                        >
                            Parking Schedule
                        </Button>,
                        <Button disableElevation={true} key={'togglePark'} className={cx(classes.Buttons)} variant={'contained'}>
                            {/*TODO: This will either be park or unpark once the workload data is loaded into this class e.g. (check workload status: workload.parked ? Park : Unpark)*/}
                            Park/Unpark
                        </Button>,
                    ]}
                />
                <WorkloadDetailActionCard
                    actionDescription={'Description'}
                    actionTitle={'Snapshot'}
                    actionButtons={[
                        <Button key={'deleteSnapshot'} disableElevation={true} className={cx(classes.Buttons)} variant={'contained'}>
                            Delete Snapshot
                        </Button>,
                    ]}
                />
            </Stack>
        </>
    );
};

const useStyles = makeStyles<IWorkloadActionsProps>()((theme, props) => ({
    Buttons: {
        textTransform: 'none',
        backgroundColor: theme.palette.grey['100'],
        color: theme.palette.grey['900'],
    },
}));

export { WorkloadDetailActions };
