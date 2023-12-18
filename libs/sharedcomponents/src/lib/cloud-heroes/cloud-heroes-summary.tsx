import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import { CloudHeroPurple } from '@vegaplatformui/sharedassets';
import { CloudHeroesWelcomeStepper } from './cloud-heroes-welcome-stepper';
import { CloudHeroesMyRewardsCard } from './cloud-heroes-my-rewards-card';
import { CloudHeroesBadgesCard } from './cloud-heroes-badges-card';
import Keycloak from 'keycloak-js';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICloudHeroesSummaryProps {
    keycloak: Keycloak;
}

const CloudHeroesSummary: React.FC<ICloudHeroesSummaryProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return (
        <Grid container spacing={1}>
            <Grid item xs={6}>
                <CloudHeroesWelcomeStepper cardClassName={classes.SmallCards} keycloak={props.keycloak} />
            </Grid>
            <Grid item xs={6}>
                <CloudHeroesMyRewardsCard cardClassName={classes.SmallCards} />
            </Grid>
            <Grid item xs={12}>
                <Card elevation={0}>
                    <CloudHeroesBadgesCard />
                </Card>
            </Grid>
        </Grid>
    );
};

const useStyles = makeStyles<ICloudHeroesSummaryProps>()((theme, props) => ({
    SmallCards: {
        minHeight: '22.5rem',
    },
}));

export { CloudHeroesSummary };
