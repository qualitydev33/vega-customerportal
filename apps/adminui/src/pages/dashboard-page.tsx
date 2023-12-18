import * as React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { makeStyles } from '@vegaplatformui/styling';
import { Button } from '@mui/material';

export interface IDashboardPageProps extends React.PropsWithChildren {}

const useStyles = makeStyles<IDashboardPageProps>()((theme, props) => ({
    welcomeCard: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

const DashboardPage: React.FC<IDashboardPageProps> = (props) => {
    const { classes, cx } = useStyles(props);
    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card className={cx(classes.welcomeCard)} variant='outlined'>
                        Welcome to the Vega Admin Portal
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};
export { DashboardPage };
