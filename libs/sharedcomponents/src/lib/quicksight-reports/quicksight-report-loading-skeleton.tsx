import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Box, LinearProgress, Skeleton, Stack, Typography } from '@mui/material';

const QuicksightReportLoadingSkeleton: React.FC = () => {
    const { classes, cx } = useStyles();

    return (
        <Stack spacing={1}>
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>
            <Skeleton className={cx(classes.Skeleton)} variant='rectangular' width={'100%'} height={`calc(100vh - 7rem)`} />
        </Stack>
    );
};

const useStyles = makeStyles()((theme) => ({
    Skeleton: {
        backgroundColor: `#F5F5F5`,
    },
}));

export { QuicksightReportLoadingSkeleton };
