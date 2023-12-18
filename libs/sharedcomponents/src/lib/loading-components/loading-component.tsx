import React, { Suspense } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { CircularProgress, Grid, Typography } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ILoadingComponentProps extends React.PropsWithChildren {
    fallback?: React.ReactNode;
}

const LoadingComponent: React.FC<ILoadingComponentProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return (
        <Suspense
            fallback={
                props.fallback ? (
                    props.fallback
                ) : (
                    <Grid container className={cx(classes.Container)} direction={'column'} alignItems={'center'}>
                        <Grid item xs={12}>
                            <CircularProgress />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>Loading...</Typography>
                        </Grid>
                    </Grid>
                )
            }
        >
            {props.children}
        </Suspense>
    );
};

const useStyles = makeStyles<ILoadingComponentProps>()((theme, props) => ({
    Container: {
        mt: '10rem',
    },
}));

export { LoadingComponent };
