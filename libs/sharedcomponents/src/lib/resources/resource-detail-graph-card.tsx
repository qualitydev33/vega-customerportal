import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Stack, Typography } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IResourceDetailGraphCardProps {}

const ResourceDetailGraphCard: React.FC<IResourceDetailGraphCardProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return (
        <Stack>
            <Typography fontWeight={600} variant={'h5'}>
                Expenses
            </Typography>
            <Stack direction='row' justifyContent='center' alignItems='center' spacing={2} className={cx(classes.ComingSoonStack)}>
                <Typography> Coming Soon </Typography>
            </Stack>
        </Stack>
    );
};

const useStyles = makeStyles<IResourceDetailGraphCardProps>()((theme, props) => ({
    GraphCard: {
        width: '100%',
    },
    ComingSoonStack: {
        marginTop: '12rem',
    },
}));

export { ResourceDetailGraphCard };
