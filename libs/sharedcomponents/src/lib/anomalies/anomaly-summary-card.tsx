import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { Stars, Savings, AccountBalanceWallet } from '@mui/icons-material';
import { IAnomaly } from '@vegaplatformui/models';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAnomalySummaryProps {
    anomalies: IAnomaly[];
}

const AnomalySummaryCard: React.FC<IAnomalySummaryProps> = (props) => {
    const { classes, cx } = useStyles(props);

    const SummaryGroup = (icon: JSX.Element, title: string, subtitle: string) => {
        return (
            <Grid spacing={1} container direction={'row'} alignItems={'center'}>
                <Grid item>
                    <Box className={cx(classes.IconBox)}>{icon}</Box>
                </Grid>
                <Grid item xs={6} container>
                    <Grid item xs={12}>
                        <Typography variant={'h6'}>{title}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'subtitle2'}>{subtitle}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        );
    };

    return (
        <Card elevation={0}>
            <CardContent>
                <Stack direction={'row'} spacing={3} justifyContent={'space-around'} alignItems={'center'}>
                    {SummaryGroup(<Stars />, props.anomalies.length.toString(), 'Anomalies Detected')}
                    {SummaryGroup(<AccountBalanceWallet />, '*% of Variance*', 'Average Variance')}
                    {SummaryGroup(<Savings />, '*Dollar Amount*', 'Overage')}
                </Stack>
            </CardContent>
        </Card>
    );
};

// TODO: Clean this up
const useStyles = makeStyles<IAnomalySummaryProps>()((theme, props) => ({
    IconBox: {
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[500],
        color: theme.palette.grey[900],
        borderRadius: '8px',
        width: '3rem',
        height: '3rem',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
    },
}));

export { AnomalySummaryCard };
