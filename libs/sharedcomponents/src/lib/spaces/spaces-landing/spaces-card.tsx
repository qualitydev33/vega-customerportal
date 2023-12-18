import React, { useRef } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import {
    Button,
    ButtonGroup,
    Card,
    CardContent,
    ClickAwayListener,
    Grid,
    Grow,
    Menu,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Stack,
    Typography,
} from '@mui/material';
import { Add, DeleteSweep, ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { SpacesTable } from './spaces-table';
import { ContainerType, IVegaContainer } from '@vegaplatformui/models';
import { CreateContainerButton } from '../create-container-button';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISpacesCardProps {
    spaces: IVegaContainer[];
    isLoading: boolean;
    onOpenSpaceDialog: (type: ContainerType) => void;
    onClickEditSpace: (space: IVegaContainer) => void;
    onClickDeleteSpace: (space: IVegaContainer) => void;
    onClickTableItem: (container: IVegaContainer[], containerType?: ContainerType) => void;
}

const SpacesCard: React.FC<ISpacesCardProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return (
        <Card elevation={0}>
            <CardContent>
                <Grid container direction={'column'}>
                    <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                        <Grid xs={6} item>
                            <Typography fontWeight={600} variant={'h5'}>
                                Spaces
                            </Typography>
                        </Grid>
                        <Grid xs={6} item container justifyContent={'flex-end'}>
                            <Grid xs={6} item container justifyContent={'flex-end'}>
                                <CreateContainerButton onOpenSpaceDialog={props.onOpenSpaceDialog} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                        <Grid xs={6} item>
                            <Stack direction={'column'} spacing={0}>
                                <Typography variant={'subtitle1'}>A place to group containers and add structure to your cloud resources.</Typography>
                                <Typography variant={'subtitle1'} className={cx(classes.Subtitle)}>
                                    Vega's grouping hierarchy is Spaces {'>'} Workloads {'>'} Resource Pools {'>'} Resources.
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                <SpacesTable
                    onClickTableItem={props.onClickTableItem}
                    spaces={props.spaces}
                    isLoading={props.isLoading}
                    onClickEditSpace={props.onClickEditSpace}
                />
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles<ISpacesCardProps>()((theme, props) => ({
    ButtonPlaceHolder: {
        height: '2.25rem',
    },
    Subtitle: {
        paddingBottom: '1rem',
    },
    SpaceButtons: {
        textTransform: 'none',
    },
}));

export { SpacesCard };
