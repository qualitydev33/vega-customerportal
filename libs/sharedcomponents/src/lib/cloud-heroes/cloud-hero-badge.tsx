import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Stack, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICloudHeroBadgeProps {
    title: string;
    description: string;
    statusDescription: string;
    hasUserAchieved: boolean;
    image: JSX.Element;
}

const CloudHeroBadge: React.FC<ICloudHeroBadgeProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return (
        <Stack direction={'row'} spacing={2} alignItems="center" alignContent="center">
            {props.image}
            <Stack spacing={1} direction={'column'} className={cx(classes.TypographyStack)}>
                <Typography fontWeight={600}>{props.title}</Typography>
                <Typography>{props.description}</Typography>
                <Stack spacing={1} direction={'row'}>
                    <CheckCircle className={cx(props.hasUserAchieved ? classes.GreenIcon : classes.GreyIcon)} />
                    <Typography variant={'subtitle2'}>{props.statusDescription}</Typography>
                </Stack>
            </Stack>
        </Stack>
    );
};

const useStyles = makeStyles<ICloudHeroBadgeProps>()((theme, props) => ({
    TypographyStack: {
        marginTop: '1rem',
    },
    GreenIcon: {
        fill: 'green',
    },
    GreyIcon: {
        fill: theme.palette.grey[200],
    },
}));

export { CloudHeroBadge };
