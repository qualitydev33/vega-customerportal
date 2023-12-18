import React, { useEffect } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Stack, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

export interface IAnomalyGraphTableProps {
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

const AnomalyGraphTable: React.FC<IAnomalyGraphTableProps> = (props) => {
    const { classes, cx } = useStyles(props);
    return (
        <Stack>
            <Chart options={props.graphOptions} series={props.graphSeries} type={props.graphType} height={'200%'} width={'90%'} />
        </Stack>
    );
};

const useStyles = makeStyles<IAnomalyGraphTableProps>()((theme, props) => ({
    Chart: {
        height: 'calc(300px)',
    },
}));

export { AnomalyGraphTable };
