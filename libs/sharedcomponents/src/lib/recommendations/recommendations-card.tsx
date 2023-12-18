import React, { useState } from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { RecommendationsTable } from './recommendations-table';
import { IGetRecommendationsOverviewResponse, IRecommendation } from '@vegaplatformui/models';
import { RecommendationsApi } from '@vegaplatformui/apis';

export interface IRecommendationsProps {
    rows: IRecommendation[];
    recommendationApi: RecommendationsApi;
    isLoading: boolean;
}

const RecommendationsCard: React.FC<IRecommendationsProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();
    const [openDialog, setOpenDialog] = useState(false);

    return (
        <Card elevation={0} className={cx(classes.Card)}>
            <CardContent>
                <Grid container direction={'column'} marginBottom={1}>
                    <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                        <Grid xs={12} item>
                            <Typography className={commonStyles.cx(commonStyles.classes.PageCardTitle)} variant={'h5'}>Take Action</Typography>
                        </Grid>
                        <Grid xs={12} item>
                            <Typography variant={'subtitle1'}>Perform actions on your Vega recommendations.</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <RecommendationsTable isLoading={props.isLoading} recommendationApi={props.recommendationApi} rows={props.rows} />
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles<IRecommendationsProps>()((theme, props) => ({
    Card: {
        marginTop: '1rem',
    },
}));

export { RecommendationsCard };
