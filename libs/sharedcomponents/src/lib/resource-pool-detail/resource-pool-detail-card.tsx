// eslint-disable-next-line @typescript-eslint/no-empty-interface
import { Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { Add, North } from '@mui/icons-material';
import { ResourcePoolDetailTable } from './resource-pool-detail-table';
import { makeStyles } from '@vegaplatformui/styling';
import { ContainerType, IVegaContainer } from '@vegaplatformui/models';

export interface IResourceDetailCardProps {
    isLoading: boolean;
    onOpenDialog: (type: ContainerType) => void;
    onClickEdit: (space: IVegaContainer) => void;
    spaces: IVegaContainer[];
    onClickTableItem: (container: IVegaContainer[], containerType?: ContainerType) => void;
    onClickGoBackToParent: (container: IVegaContainer) => void;
}

const ResourcePoolDetailCard: React.FC<IResourceDetailCardProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const resourcePool = props.spaces.find((s) => s.container_type === ContainerType.ResourcePool.toLowerCase());

    return (
        <Card elevation={0}>
            <CardContent>
                <Grid container direction={'column'}>
                    <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                        <Grid xs={6} item>
                            <Typography fontWeight={600} variant={'h5'}>
                                {resourcePool?.name}
                            </Typography>
                        </Grid>
                        <Grid xs={6} item container justifyContent={'flex-end'}>
                            <Stack spacing={1} direction={'row'}>
                                <Button
                                    startIcon={<North />}
                                    className={cx(classes.SpaceButtons, classes.BackToParentButton)}
                                    variant={'text'}
                                    onClick={() => props.onClickGoBackToParent(resourcePool!)}
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
                                    onClick={() => props.onOpenDialog(ContainerType.ResourcePool)}
                                >
                                    Create
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                        <Grid xs={6} item>
                            <Typography variant={'subtitle1'} className={cx(classes.Subtitle)}>
                                {resourcePool?.description ?? ''}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <ResourcePoolDetailTable
                    onClickTableItem={props.onClickTableItem}
                    spaces={props.spaces}
                    isLoading={props.isLoading}
                    onClickEdit={props.onClickEdit}
                />
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles<IResourceDetailCardProps>()((theme, props) => ({
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

export { ResourcePoolDetailCard };
