import React from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, PaperProps, Typography } from '@mui/material';
import { CancelButton } from '@vegaplatformui/utils';
import { ICloudProviderAccount } from '@vegaplatformui/models';
import Draggable from 'react-draggable';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IConfirmDeleteCloudAccountsBatchDialogProps {
    selectedAccounts: ICloudProviderAccount[];
    isConfirmDeleteDialogBatchOpen: boolean;
    onCloseConfirmDeleteBatchDialog: () => void;
    confirmDeleteAccounts: () => void;
}

function PaperComponent(props: PaperProps) {
    const nodeRef = React.useRef(null);
    return (
        <Draggable nodeRef={nodeRef} handle='#confirm-delete-accounts-dialog' cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper ref={nodeRef} {...props} />
        </Draggable>
    );
}
const ConfirmDeleteCloudAccountsBatchDialog: React.FC<IConfirmDeleteCloudAccountsBatchDialogProps> = (props) => {
    const { classes, cx } = useCommonStyles();

    return (
        <Dialog
            fullWidth
            open={props.isConfirmDeleteDialogBatchOpen}
            onClose={props.onCloseConfirmDeleteBatchDialog}
            PaperComponent={PaperComponent}
            aria-labelledby='confirm-delete-accounts-dialog'
        >
            <DialogTitle className={cx(classes.FormTitle)} style={{ cursor: 'move' }} id='confirm-delete-accounts-dialog'>
                <Grid container spacing={2} direction={'row'}>
                    <Grid item xs={12}>
                        <Typography fontWeight={'600'} variant={'h5'}>
                            Are you sure you want to delete {props.selectedAccounts.length} accounts?
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
                        onClick={props.onCloseConfirmDeleteBatchDialog}
                    >
                        Cancel
                    </CancelButton>
                    <Button
                        className={cx(classes.LowercaseTextButton)}
                        color={'error'}
                        variant={'contained'}
                        onClick={() => {
                            props.confirmDeleteAccounts();
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

const useStyles = makeStyles<IConfirmDeleteCloudAccountsBatchDialogProps>()((theme, props) => ({}));

export { ConfirmDeleteCloudAccountsBatchDialog };
