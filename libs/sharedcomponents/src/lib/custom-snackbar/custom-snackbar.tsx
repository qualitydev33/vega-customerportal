import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Alert, AlertProps, Snackbar, SnackbarProps, Stack } from '@mui/material';

export type CustomSnackBarOptions = {
    snackBarProps: Omit<SnackbarProps, 'onClose' | 'anchorOrigin'>;
    alertProps: Omit<AlertProps, 'onClose'>;
    message: string | JSX.Element;
};

export interface ICustomSnackbarProps {
    snackbarOptions: CustomSnackBarOptions;
    onCloseSnackbar: () => void;
}

const CustomSnackbar: React.FC<ICustomSnackbarProps> = (props) => {
    const { cx, classes } = useStyles(props);

    return (
        <Snackbar
            className={cx(classes.Snackbar)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={props.onCloseSnackbar}
            {...props.snackbarOptions.snackBarProps}
        >
            <Alert sx={{ textAlign: 'center' }} className={cx(classes.Alert)} onClose={props.onCloseSnackbar} {...props.snackbarOptions.alertProps}>
                <Stack>{props.snackbarOptions.message}</Stack>
            </Alert>
        </Snackbar>
    );
};

const useStyles = makeStyles<ICustomSnackbarProps>()((theme, props) => ({
    Snackbar: {
        width: '50%',
    },
    Alert: {
        width: '80%',
    },
}));

export { CustomSnackbar };
