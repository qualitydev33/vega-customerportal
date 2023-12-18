import React from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, PaperProps, Typography } from '@mui/material';
import { CancelButton } from '@vegaplatformui/utils';
import { ICloudProviderAccount } from '@vegaplatformui/models';
import Draggable from 'react-draggable';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IConfirmDeleteCloudAccountProps {
    accountToDelete?: ICloudProviderAccount;
    isConfirmDeleteDialogOpen: boolean;
    onCloseConfirmDeleteDialog: () => void;
    confirmDeleteAccount: (account: ICloudProviderAccount) => void;
}

function PaperComponent(props: PaperProps) {
    const nodeRef = React.useRef(null);
    return (
        <Draggable nodeRef={nodeRef} handle='#confirm-delete-account-dialog' cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper ref={nodeRef} {...props} />
        </Draggable>
    );
}

const ConfirmDeleteCloudAccountDialog: React.FC<IConfirmDeleteCloudAccountProps> = (props) => {
    const { classes, cx } = useCommonStyles();

    return (
        <Dialog
            fullWidth
            open={props.isConfirmDeleteDialogOpen}
            onClose={props.onCloseConfirmDeleteDialog}
            PaperComponent={PaperComponent}
            aria-labelledby='confirm-create-account-dialog'
        >
            <DialogTitle className={cx(classes.FormTitle)} style={{ cursor: 'move' }} id='confirm-delete-account-dialog'>
                <Grid container spacing={2} direction={'row'}>
                    <Grid item xs={12}>
                        <Typography fontWeight={'600'} variant={'h5'}>
                            Are you sure you want to delete {props.accountToDelete?.account_id}?
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'subtitle1'}> You cannot undo this action </Typography>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <DialogActions className={cx(classes.DialogActions)}>
                    <CancelButton
                        className={cx(classes.LowercaseTextButton)}
                        disableElevation={true}
                        variant={'contained'}
                        color={'secondary'}
                        autoFocus
                        onClick={props.onCloseConfirmDeleteDialog}
                    >
                        Cancel
                    </CancelButton>
                    <Button
                        className={cx(classes.LowercaseTextButton)}
                        color={'error'}
                        variant={'contained'}
                        onClick={() => {
                            props.confirmDeleteAccount(props.accountToDelete!);
                        }}
                        disableElevation={true}
                    >
                        Yes, Delete
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

const useStyles = makeStyles<IConfirmDeleteCloudAccountProps>()((theme, props) => ({}));

export { ConfirmDeleteCloudAccountDialog };
