import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Button, Drawer, Stack, Typography } from '@mui/material';
import { CreateScheduleResourcesTable } from '../parking/create-schedule-resources-table';
import { ResetButton } from './recurring-schedule';
import { ArrowBack, ArrowLeft, ExpandLess, ExpandMore } from '@mui/icons-material';
import { IResource } from '@vegaplatformui/models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IEditAttachResourcesDrawerProps {
    width: string;
    isOpen: boolean;
    resources: IResource[];
    selectedResources: IResource[];
    setSelectedResources: React.Dispatch<React.SetStateAction<IResource[]>>;
    onClickBack: () => void;
    isEditing: boolean;
    onCancel: () => void;
    isServerPaginated?: boolean;
}

const EditAttachResourcesDrawer: React.FC<IEditAttachResourcesDrawerProps> = (props) => {
    const { classes, cx } = useStyles(props);

    const onClickCancel = () => {
        props.onCancel();
        props.onClickBack();
    };

    const onClickSave = () => {
        props.onClickBack();
    };

    return (
        <Drawer
            PaperProps={{
                className: cx(classes.DrawerPaper),
            }}
            classes={{ root: cx(classes.DrawerRoot) }}
            anchor={'right'}
            open={props.isOpen}
            onClose={() => console.log('on close clicked')}
            hideBackdrop={true}
        >
            <div>
                <Button
                    startIcon={<ArrowBack className={cx(classes.ArrowBackIcon)} />}
                    className={cx(classes.AttachedResourcesButton)}
                    color={'inherit'}
                    variant={'text'}
                    onClick={onClickCancel}
                >
                    <Typography variant={'h6'}>Attach Resources</Typography>
                </Button>
            </div>
            <div>
                <Typography className={cx(classes.Subtitle)} variant={'subtitle1'}>
                    Select resources to attach to this schedule.
                </Typography>
            </div>
            <div className={cx(classes.TableContainer)}>
                <CreateScheduleResourcesTable
                    resources={props.resources}
                    selectedResources={props.selectedResources}
                    setSelectedResources={(res) => props.setSelectedResources(res)}
                    isLoading={false}
                    isSelectable={true}
                    isServerPaginated={props.isServerPaginated}
                />
            </div>
            <Stack direction='row' justifyContent='flex-end' alignItems='center' spacing={2} className={cx(classes.ActionButtonContainer)}>
                <ResetButton onClick={onClickCancel}>Cancel</ResetButton>
                <Button onClick={onClickSave} disabled={props.isEditing ? false : props.selectedResources.length === 0} variant={'contained'}>
                    Save
                </Button>
            </Stack>
        </Drawer>
    );
};

const useStyles = makeStyles<IEditAttachResourcesDrawerProps>()((theme, props) => ({
    TableContainer: { paddingLeft: '2rem', paddingRight: '2rem', paddingTop: '1rem', paddingBottom: '1rem', overflow: 'auto' },
    DrawerRoot: {
        zIndex: '1300 !important' as any,
    },
    DrawerPaper: { width: props.width },
    AttachedResourcesButton: {
        float: 'left',
        textTransform: 'none',
    },
    ArrowBackIcon: {
        marginRight: '1rem',
    },
    ActionButtonContainer: { marginTop: 'auto', marginBottom: '1rem', marginRight: '1rem', paddingTop: '1rem' },
    Subtitle: {
        marginLeft: '3rem',
    },
}));

export { EditAttachResourcesDrawer };
