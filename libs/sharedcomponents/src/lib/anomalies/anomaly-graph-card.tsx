import React, { useEffect } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { IFileDownloadsProps } from '@vegaplatformui/sharedcomponents';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { AnomalyGraphTable } from './anomaly-graph-table';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

export interface IAnomalyGraphProps {
    graphOptions: ApexOptions;
    graphSeries: number[] | ApexAxisChartSeries;
    graphType:
        | 'line'
        | 'area'
        | 'bar'
        | 'histogram'
        | 'pie'
        | 'donut'
        | 'radialBar'
        | 'scatter'
        | 'bubble'
        | 'heatmap'
        | 'treemap'
        | 'boxPlot'
        | 'candlestick'
        | 'radar'
        | 'polarArea'
        | 'rangeBar';
}

const AnomalyGraphCard: React.FC<IAnomalyGraphProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return (
        <Card elevation={0} className={cx(classes.Card)}>
            <CardContent>
                <Grid container direction={'column'}>
                    <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                        <Grid xs={6} item>
                            <Typography variant={'h6'}>
                                {props.graphType === 'donut'
                                    ? 'OnDemand Spike Anomalies by Product'
                                    : 'Daily Trending Costs by Product Detail Category'}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                        <Grid xs={6} item>
                            <Typography variant={'subtitle1'} className={cx(classes.Subtitle)}>
                                {props.graphType === 'donut' ? 'Data spikes by product' : 'Data spikes by detail category'}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <AnomalyGraphTable graphOptions={props.graphOptions} graphSeries={props.graphSeries} graphType={props.graphType} />
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles<IAnomalyGraphProps>()((theme, props) => ({
    Subtitle: {
        paddingBottom: '1rem',
    },
    Card: {
        margin: '.5rem',
        width: '50%',
    },
}));

export { AnomalyGraphCard };
