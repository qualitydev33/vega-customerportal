import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Stack, Typography } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPageComingSoonProps {}

const PageComingSoon: React.FC<IPageComingSoonProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return (
        <Stack className={cx(classes.Stack)} direction='column' justifyContent='center' alignItems='center' spacing={2}>
            <Typography>Coming Soon</Typography>
        </Stack>
    );
};

const useStyles = makeStyles<IPageComingSoonProps>()((theme, props) => ({
    Stack: {
        height: '100vh',
        marginTop: '-8rem',
    },
}));

export { PageComingSoon };
