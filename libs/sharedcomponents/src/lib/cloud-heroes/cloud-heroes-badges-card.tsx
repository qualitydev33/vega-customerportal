import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Card, CardContent, CardHeader, Grid, Stack, Typography } from '@mui/material';
import { CloudHeroBadge } from './cloud-hero-badge';
import { CloudHeroPurple, LiftOff, OneGiantLeap, OneSmallStep, VegaCow } from '@vegaplatformui/sharedassets';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICloudHeroesBadgesCardProps {}

const CloudHeroesBadgesCard: React.FC<ICloudHeroesBadgesCardProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return (
        <Card>
            <CardHeader
                title={
                    <Stack>
                        <Typography fontWeight={500} variant={'h6'}>
                            Badges
                        </Typography>
                        {/*<Typography variant={'body2'}>{`You have earned 1 badge`}</Typography>*/}
                    </Stack>
                }
            />
            <CardContent>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}>
                    <Typography>As you leverage Vega, you can show off your badges that are displayed here. Badges are coming soon.</Typography>
                </Stack>
                {/*<Grid container direction={'row'} alignItems='center' alignContent='center'>*/}
                {/*        <Grid item xs={6} >*/}
                {/*            <CloudHeroBadge*/}
                {/*                title={'Cloud Hero'}*/}
                {/*                description={'Welcome to Cloud Hero! Update your information in settings.'}*/}
                {/*                statusDescription={'Achieved February 3, 2023'}*/}
                {/*                image={<CloudHeroPurple className={cx(classes.BadgeIcons)} />}*/}
                {/*                hasUserAchieved={true}*/}
                {/*            />*/}
                {/*        </Grid>*/}
                {/*        <Grid item xs={6}>*/}
                {/*            <CloudHeroBadge*/}
                {/*                title={'Lift Off'}*/}
                {/*                description={'Action one recommendation provided by Vega.'}*/}
                {/*                statusDescription={'Not Achieved Yet'}*/}
                {/*                image={<LiftOff className={cx(classes.BadgeIcons)} />}*/}
                {/*                hasUserAchieved={false}*/}
                {/*            />*/}
                {/*        </Grid>*/}
                {/*    </Grid>*/}
                {/*    <Grid container direction={'row'} alignItems="center" alignContent="center" className={cx(classes.LowerRow)}>*/}
                {/*        <Grid item xs={6}>*/}
                {/*            <CloudHeroBadge*/}
                {/*                title={'One Small Step'}*/}
                {/*                description={'Achieve your first personal savings goal.'}*/}
                {/*                statusDescription={'Coming Soon!'}*/}
                {/*                image={<OneSmallStep className={cx(classes.BadgeIcons)} />}*/}
                {/*                hasUserAchieved={false}*/}
                {/*            />*/}
                {/*        </Grid>*/}
                {/*        <Grid item xs={6}>*/}
                {/*            <CloudHeroBadge*/}
                {/*                title={'One Giant Leap'}*/}
                {/*                description={'Achieve your first savings team goal.'}*/}
                {/*                statusDescription={'Coming Soon!'}*/}
                {/*                image={<OneGiantLeap className={cx(classes.BadgeIcons)} />}*/}
                {/*                hasUserAchieved={false}*/}
                {/*            />*/}
                {/*        </Grid>*/}
                {/*     <Grid className={cx(classes.LowerRow)} sx={{ marginLeft: 'auto' }} item xs={3}>*/}
                {/*        <VegaCow className={cx(classes.VegaCow)} />*/}
                {/*    </Grid> */}
                {/*</Grid>*/}
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles<ICloudHeroesBadgesCardProps>()((theme, props) => ({
    LowerRow: { marginTop: '2rem' },
    VegaCow: { marginBottom: '-1rem' },
    BadgeIcons: { width: '15rem' },
}));

export { CloudHeroesBadgesCard };
