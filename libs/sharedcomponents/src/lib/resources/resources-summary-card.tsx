import React, { useMemo } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { Savings, FormatListNumbered, CloudCircle } from '@mui/icons-material';
import { IResource, IResourcesSummary } from '@vegaplatformui/models';
import { FormatNumberUSDHundredth } from '../utilities/value-formatter-methods';

export interface IResourcePoolsSummaryCardProps {
    summary: IResourcesSummary;
}

const ResourcesSummaryCard: React.FC<IResourcePoolsSummaryCardProps> = (props) => {
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
                    {/*                    {SummaryGroup(<Savings />, FormatNumberUSDHundredth(props.summary.projected_monthly_savings), 'Projected Monthly Savings')}
                    {SummaryGroup(<FormatListNumbered />, FormatNumberUSDHundredth(props.summary.actual_savings_mtd), 'Actual Savings (MTD)')}*/}
                    {SummaryGroup(<FormatListNumbered />, props.summary.num_resources.toString(), 'Resources')}
                    {SummaryGroup(<CloudCircle />, props.summary.active_resources.toString(), 'Running')}
                    {SummaryGroup(<CloudCircle />, props.summary.resources_on_a_schedule.toString(), 'Scheduled')}
                </Stack>
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles<IResourcePoolsSummaryCardProps>()((theme, props) => ({
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

export { ResourcesSummaryCard };
