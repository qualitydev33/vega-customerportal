import { Stack, Theme, Typography } from '@mui/material';
import { makeStyles } from '@vegaplatformui/styling';

interface IMenuHeadingProps {
    heading: string;
    theme: Theme;
    isDrawerOpen: boolean;
}

export const MenuHeading = (props: IMenuHeadingProps) => {
    const { classes } = useStyles(props);

    if (!props.isDrawerOpen) {
        return null;
    }

    return (
        <Stack>
            <Typography className={classes.Heading}>{props.heading}</Typography>
        </Stack>
    );
};

const useStyles = makeStyles<IMenuHeadingProps>()((theme, props) => ({
    Heading: {
        marginTop: '0.5rem',
        fontSize: '14px',
        fontWeight: 600,
        color: theme.palette.grey[600],
        marginBottom: theme.spacing(0.5),
    },
}));
