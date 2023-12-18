import { DeleteSweep, Add, Search, Delete } from '@mui/icons-material';
import { Box, Button, ButtonProps, Card, CardContent, Grid, Stack, styled, TextField, Typography } from '@mui/material';
import { IBusinessGrouping, IBusinessGroupingType } from '@vegaplatformui/models';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { BusinessGroupingTable } from './business-grouping-table';

/* eslint-disable-next-line */
export interface IBusinessGroupingLandingProps {
    isLoading: boolean;
    onClickEditBusinessGrouping: (grouping: IBusinessGrouping) => void;
    onClickDeleteBusinessGrouping: (grouping: IBusinessGrouping) => void;
    setSelectedBusinessGrouping: Dispatch<SetStateAction<IBusinessGrouping[]>>;
    onClickOpenCreateBusinessGroupingDialog: () => void;
    onClickOpenEditBusinessGroupingDialog: (grouping: IBusinessGrouping) => void;
    businessGroupings: IBusinessGrouping[];
    selectedGroupings: IBusinessGrouping[];
    onClickDeleteSelectedGroupings: () => void;
    businessGroupingTypes: IBusinessGroupingType[];
}

export const BusinessGroupingLanding: React.FC<IBusinessGroupingLandingProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();

    return (
        <Card elevation={0}>
            <CardContent>
                <Grid container direction={'row'}>
                    <Grid item xs={6}>
                        <Grid container direction={'column'}>
                            <Grid xs={12} item>
                                <Typography className={commonStyles.cx(commonStyles.classes.PageCardTitle)} variant={'h5'}>
                                    Business Groupings
                                </Typography>
                            </Grid>
                            <Grid xs={12} item>
                                <Typography variant={'subtitle1'} className={cx(classes.Subtitle)}>
                                    Manage your Business Groups for reporting and authorization purposes.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack className={cx(classes.ButtonPlaceHolder)} direction={'row'} spacing={1} justifyContent={'flex-end'}>
                            {/*{props.selectedUnits.length > 1 && (*/}
                            {/*    <MultiDelete*/}
                            {/*        size='small'*/}
                            {/*        startIcon={<Delete />}*/}
                            {/*        className={cx(classes.UnitButtons)}*/}
                            {/*        variant={'contained'}*/}
                            {/*        onClick={props.onClickDeleteselectedUnits}*/}
                            {/*    >*/}
                            {/*        Delete Selected Units*/}
                            {/*    </MultiDelete>*/}
                            {/*)}*/}
                            <Button
                                startIcon={<Add />}
                                size='small'
                                className={cx(classes.UnitButtons)}
                                variant={'contained'}
                                onClick={props.onClickOpenCreateBusinessGroupingDialog}
                            >
                                Create Business Grouping
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
                <BusinessGroupingTable
                    businessGroupingTypes={props.businessGroupingTypes}
                    setSelectedGrouping={props.setSelectedBusinessGrouping}
                    onClickDeleteGrouping={props.onClickDeleteBusinessGrouping}
                    onClickOpenEditBusinessGroupingDialog={props.onClickOpenEditBusinessGroupingDialog}
                    isLoading={props.isLoading}
                    selectedGroupings={props.selectedGroupings}
                    businessGroupings={props.businessGroupings}
                />
            </CardContent>
        </Card>
    );
};

const MultiDelete = styled(Button)<ButtonProps>(({ theme }) => ({
    color: 'black',
    backgroundColor: theme.palette.grey[100],
    '&:hover': {
        backgroundColor: theme.palette.grey[50],
    },
}));

const useStyles = makeStyles<IBusinessGroupingLandingProps>()((theme, props) => ({
    ButtonPlaceHolder: {
        height: '2.25rem',
    },
    Subtitle: {
        paddingBottom: '1rem',
    },
    UnitButtons: {
        textTransform: 'none',
    },
}));

export default BusinessGroupingLanding;
