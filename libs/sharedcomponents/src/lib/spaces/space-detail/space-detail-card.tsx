import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Button, Card, CardContent, Grid, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { Add, ArrowDropDown, ArrowDropUp, North } from '@mui/icons-material';
import { SpaceDetailTable } from './space-detail-table';
import { ContainerType, IVegaContainer } from '@vegaplatformui/models';
import { CreateContainerButton } from '../create-container-button';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISpaceCardProps {
    isLoading: boolean;
    onOpenSpaceDialog: (type: ContainerType) => void;
    onClickEditSpace: (space: IVegaContainer) => void;
    spaces: IVegaContainer[];
    onClickTableItem: (container: IVegaContainer[], containerType?: ContainerType) => void;
    onClickGoBackToParent: (container: IVegaContainer) => void;
}

const SpaceDetailCard: React.FC<ISpaceCardProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const space = props.spaces.find((s) => s.container_type === ContainerType.Space.toLowerCase());

    return (
        <Card elevation={0}>
            <CardContent>
                <Grid container direction={'column'}>
                    <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                        <Grid xs={6} item>
                            <Typography fontWeight={600} variant={'h5'}>
                                {space?.name}
                            </Typography>
                        </Grid>
                        <Grid xs={6} item container justifyContent={'flex-end'}>
                            <Stack spacing={1} direction={'row'}>
                                <Button
                                    startIcon={<North />}
                                    className={cx(classes.SpaceButtons, classes.BackToParentButton)}
                                    variant={'text'}
                                    onClick={() => props.onClickGoBackToParent(space!)}
                                >
                                    Go to Parent
                                </Button>
                                {/*<Button className={cx(classes.SpaceButtons)} variant={'contained'}>*/}
                                {/*    Edit*/}
                                {/*</Button>*/}
                                <CreateContainerButton onOpenSpaceDialog={props.onOpenSpaceDialog} />
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                        <Grid xs={6} item>
                            <Typography variant={'subtitle1'} className={cx(classes.Subtitle)}>
                                {space?.description ?? ''}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <SpaceDetailTable
                    onClickTableItem={props.onClickTableItem}
                    spaces={props.spaces}
                    isLoading={props.isLoading}
                    onClickEditSpace={props.onClickEditSpace}
                />
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles<ISpaceCardProps>()((theme, props) => ({
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

export { SpaceDetailCard };
