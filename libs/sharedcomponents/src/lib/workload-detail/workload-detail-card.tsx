import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { Add, North } from '@mui/icons-material';
import { ContainerType, IVegaContainer } from '@vegaplatformui/models';
import { WorkloadDetailTable } from './workload-detail-table';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IWorkloadsCardProps {
    isLoading: boolean;
    onOpenDialog: (type: ContainerType) => void;
    onClickEditSpace: (space: IVegaContainer) => void;
    spaces: IVegaContainer[];
    onClickTableItem: (container: IVegaContainer[], containerType?: ContainerType) => void;
    onClickGoBackToParent: (container: IVegaContainer) => void;
}

const WorkloadDetailCard: React.FC<IWorkloadsCardProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const workload = props.spaces.find((s) => s.container_type === ContainerType.Workload.toLowerCase());

    return (
        <Card elevation={0}>
            <CardContent>
                <Grid container direction={'column'}>
                    <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                        <Grid xs={6} item>
                            <Typography fontWeight={600} variant={'h5'}>
                                {workload?.name}
                            </Typography>
                        </Grid>
                        <Grid xs={6} item container justifyContent={'flex-end'}>
                            <Stack spacing={1} direction={'row'}>
                                <Button
                                    startIcon={<North />}
                                    className={cx(classes.SpaceButtons, classes.BackToParentButton)}
                                    variant={'text'}
                                    onClick={() => props.onClickGoBackToParent(workload!)}
                                >
                                    Go to Parent
                                </Button>
                                {/*<Button className={cx(classes.SpaceButtons)} variant={'contained'}>*/}
                                {/*    Edit*/}
                                {/*</Button>*/}
                                <Button
                                    startIcon={<Add />}
                                    className={cx(classes.SpaceButtons)}
                                    variant={'contained'}
                                    onClick={() => props.onOpenDialog(ContainerType.Workload)}
                                >
                                    Create
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                        <Grid xs={6} item>
                            <Typography variant={'subtitle1'} className={cx(classes.Subtitle)}>
                                {workload?.description ?? ''}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <WorkloadDetailTable
                    isLoading={props.isLoading}
                    onClickEditSpace={props.onClickEditSpace}
                    spaces={props.spaces}
                    onClickTableItem={props.onClickTableItem}
                />
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles<IWorkloadsCardProps>()((theme, props) => ({
    ButtonPlaceHolder: {
        height: '2.25rem',
    },
    Subtitle: {
        paddingBottom: '1rem',
    },
    SpaceButtons: {
        textTransform: 'none',
    },
    BackToParentButton: {
        color: theme.palette.grey[600],
    },
}));

export { WorkloadDetailCard };
