import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Box, Card, CardContent, Grid, List, Stack, Typography } from '@mui/material';
import { Stars, Savings, AccountBalanceWallet, Cloud, CloudCircle, ListAlt, ListOutlined } from '@mui/icons-material';
import { IGetRecommendationsOverviewResponse } from '@vegaplatformui/models';
import { FormatNumberUSDHundredth } from '../utilities/value-formatter-methods';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRecommendationsSummaryProps {
    recommendationsSummary: IGetRecommendationsOverviewResponse | undefined;
}

const RecommendationsSummaryCard: React.FC<IRecommendationsSummaryProps> = (props) => {
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
                    {/*
                    {SummaryGroup(<Savings />, FormatNumberUSDHundredth(props.recommendationsSummary?.possible_savings || 0), 'Possible Monthly Savings')}
*/}
                    {SummaryGroup(
                        <ListOutlined />,
                        props.recommendationsSummary?.active_recommendations?.toString() ?? '0',
                        'Active Recommendations'
                    )}
                    {SummaryGroup(<CloudCircle />, props.recommendationsSummary?.affected_resources?.toString() ?? '0', 'Affected Resources')}
                </Stack>
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles<IRecommendationsSummaryProps>()((theme, props) => ({
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

export { RecommendationsSummaryCard };
