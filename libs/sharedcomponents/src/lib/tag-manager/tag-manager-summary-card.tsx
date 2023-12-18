import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { AccountBalanceWallet, Savings, Stars } from '@mui/icons-material';
import { VegaTag } from '@vegaplatformui/sharedcomponents';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITagManagerSummaryCardProps {
    tags: VegaTag[];
}

const TagManagerSummaryCard: React.FC<ITagManagerSummaryCardProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const SummaryTagGroup = (title: string, subtitle: string) => {
        return (
            <Grid spacing={1} container direction={'row'} alignItems={'center'}>
                <Grid item xs={6} container>
                    <Grid item xs={12}>
                        <Typography variant={'subtitle2'}>{title}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography fontWeight={600} variant={'h5'}>
                            {subtitle}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        );
    };

    return (
        <Card elevation={0}>
            <CardContent>
                <Stack direction={'row'} spacing={3} justifyContent={'space-around'} alignItems={'center'}>
                    {SummaryTagGroup('Tagged Resources', props.tags.length.toString())}
                    {SummaryTagGroup('Untagged Resources', '*Number*')}
                    {SummaryTagGroup('Untaggable Resources', '*Number*')}
                </Stack>
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles<ITagManagerSummaryCardProps>()((theme, props) => ({}));

export { TagManagerSummaryCard };
