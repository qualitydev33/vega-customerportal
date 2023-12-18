import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Button, Collapse, Grid, Typography } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { CreateScheduleResourcesTable } from '../parking/create-schedule-resources-table';
import { IResource } from '@vegaplatformui/models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAttachResourcesDropdownProps {
    onClickEditAttachResources: () => void;
    resources: IResource[];
    selectedResources: IResource[];
    setSelectedResources: React.Dispatch<React.SetStateAction<IResource[]>>;
    isLoading: boolean;
    disableEditAttachResourcesDrawer?: boolean;
}

const AttachResourcesDropdown: React.FC<IAttachResourcesDropdownProps> = ({ disableEditAttachResourcesDrawer = true, ...props }) => {
    const { classes, cx } = useStyles(props);
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            <Grid className={cx(classes.Container)} container direction={'row'}>
                <Grid item xs={6}>
                    <Button
                        endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
                        onClick={handleExpandClick}
                        className={cx(classes.AttachedResourcesButton)}
                        color={'inherit'}
                        variant={'text'}
                    >
                        <Typography variant={'h6'}>Attached Resources</Typography>
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        onClick={props.onClickEditAttachResources}
                        className={cx(classes.AttachResourcesButton)}
                        variant={'contained'}
                        disabled={disableEditAttachResourcesDrawer}
                    >
                        Attach Resources
                    </Button>
                </Grid>
            </Grid>
            <Collapse in={expanded} timeout='auto' unmountOnExit>
                <CreateScheduleResourcesTable
                    isServerPaginated={false}
                    selectedResources={props.selectedResources}
                    setSelectedResources={props.setSelectedResources}
                    resources={[...props.resources]}
                    isSelectable={false}
                    isLoading={props.isLoading}
                />
            </Collapse>
        </>
    );
};

const useStyles = makeStyles<IAttachResourcesDropdownProps>()((theme, props) => ({
    Container: {
        marginTop: '1rem',
    },
    AttachResourcesButton: {
        float: 'right',
    },
    AttachedResourcesButton: {
        textTransform: 'none',
    },
}));

export { AttachResourcesDropdown };
