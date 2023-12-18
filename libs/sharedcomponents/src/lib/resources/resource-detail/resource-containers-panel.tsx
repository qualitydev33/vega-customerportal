import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Stack, Typography, Grid, Button, Skeleton } from '@mui/material';
import { IResource, IResourceContainersInfo } from '@vegaplatformui/models';

interface ResourceContainersPanelProps {
    isLoading: boolean;
    resourceContainer?: IResourceContainersInfo;
    resourceSiblings: IResource[]; 
}

const renderSkeleton = (lines = 1) => {
    return <Skeleton variant='rectangular' animation='wave' width={250} height={30 * lines} />;
};

const ResourceContainersPanel: React.FC<ResourceContainersPanelProps> = (props) => {
    const { classes, cx } = useStyles(props);
    return (
        <Stack gap={2}>
            <Typography fontWeight={600} variant={'h6'}>
                Containers
            </Typography>
            <Stack gap={5}>
                <Grid container direction={'row'} columnGap={8}>
                    <Grid item className={cx(classes.label)} xs={12} sm={12} md={7} lg={7} xl={7}>
                        <Typography fontWeight={'bold'}>Space</Typography>
                        <Typography>
                            Related to a resource. A Space is a container that allows users to group workloads into functional application
                            (operational) groups. Example: dev, test, prod application specific workloads, or by a specific environment (dev includes
                            all dev application workloads).
                        </Typography>
                    </Grid>
                    <Grid item className={cx(classes.labelValue)}>
                        <Typography>{props.isLoading ? renderSkeleton() : props.resourceContainer?.space_name}</Typography>
                    </Grid>
                </Grid>
                <Grid container direction={'row'} columnGap={8}>
                    <Grid item className={cx(classes.label)} xs={12} sm={12} md={7} lg={7} xl={7}>
                        <Typography fontWeight={'bold'}>Workload (Grandparent)</Typography>
                        <Typography>
                            The grandparent to a resource. A workload is a container that groups different Resource Pools to allow multi-cloud
                            applications to ingest multiple cloud accounts and data from third parties.{' '}
                        </Typography>
                    </Grid>
                    <Grid item className={cx(classes.labelValue)}>
                        <Typography>{props.isLoading ? renderSkeleton() : props.resourceContainer?.workload_name}</Typography>
                    </Grid>
                </Grid>
                <Grid container direction={'row'} columnGap={8}>
                    <Grid item className={cx(classes.label)} xs={12} sm={12} md={7} lg={7} xl={7}>
                        <Typography fontWeight={'bold'}>Resource Pool</Typography>
                        <Typography>The parent to a resource. A Resource Pool is a container that groups together different resources. </Typography>
                    </Grid>
                    <Grid item className={cx(classes.labelValue)}>
                        <Typography>{props.isLoading ? renderSkeleton() : props.resourceContainer?.resource_pool_name}</Typography>
                    </Grid>
                </Grid>
                <Grid container direction={'row'} columnGap={8}>
                    <Grid item className={cx(classes.label)} xs={12} sm={12} md={7} lg={7} xl={7}>
                        <Typography fontWeight={'bold'}>Siblings</Typography>
                        <Typography>Other resources grouped in the same Resource Pool</Typography>
                    </Grid>
                    <Grid item>
                        {props.isLoading ? (
                            <>
                                {renderSkeleton(4)}
                                <br />
                            </>
                        ) : (props.resourceSiblings.map((resource) => (
                                <Typography key={resource.id} marginBottom={2}>
                                    {resource.name}
                                </Typography>
                            ))
                        )}

                        <Button className={cx(classes.ViewSiblingButton)} variant={'contained'}>
                            View Sibling Containers
                        </Button>
                    </Grid>
                </Grid>
            </Stack>
        </Stack>
    );
};

const useStyles = makeStyles<ResourceContainersPanelProps>()((theme, props) => ({
    label: {
        color: theme.palette.secondary.main,
    },
    labelValue: {
        color: theme.palette.primary.main,
    },
    ViewSiblingButton: {
        backgroundColor: theme.palette.grey[100],
        color: theme.palette.grey[900],
        '&:hover': {
            backgroundColor: theme.palette.grey[200],
        },
    },
}));

export { ResourceContainersPanel };
