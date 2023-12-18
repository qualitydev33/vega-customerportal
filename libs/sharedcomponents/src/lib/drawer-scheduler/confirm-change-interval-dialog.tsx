import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { CancelButton } from '@vegaplatformui/utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IConfirmChangeIntervalDialogProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmChangeIntervalDialog: React.FC<IConfirmChangeIntervalDialogProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return (
        <Dialog sx={{ zIndex: 1301 }} open={props.show} onClose={props.onClose}>
            <DialogTitle>{'Change schedule time interval?'}</DialogTitle>
            <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                    Changing the schedule interval will clear existing schedule entries. Are you sure you want to continue?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <CancelButton onClick={props.onClose} autoFocus>
                    Cancel
                </CancelButton>
                <Button onClick={props.onConfirm}>Confirm</Button>
            </DialogActions>
        </Dialog>
    );
};

const useStyles = makeStyles<IConfirmChangeIntervalDialogProps>()((theme, props) => ({}));

export { ConfirmChangeIntervalDialog };
