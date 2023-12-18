import React, { ReactNode } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, PaperProps, Typography } from '@mui/material';
import { CancelButton } from '@vegaplatformui/utils';
import { IVegaContainer } from '@vegaplatformui/models';
import Draggable from 'react-draggable';
import { ContainerTypeFormatter } from '../utilities/container-type-formatter';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IConfirmDeleteContainerDialogProps {
    container: IVegaContainer | undefined;
    isConfirmDeleteDialogOpen: boolean;
    onCloseConfirmDeleteDialog: () => void;
    confirmDeleteContainer: (container?: IVegaContainer) => void;
}

function PaperComponent(props: PaperProps) {
    const nodeRef = React.useRef(null);
    return (
        <Draggable nodeRef={nodeRef} handle='#confirm-delete-container-dialog' cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper ref={nodeRef} {...props} />
        </Draggable>
    );
}

const ConfirmDeleteContainerDialog: React.FC<IConfirmDeleteContainerDialogProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return (
        <Dialog
            fullWidth
            open={props.isConfirmDeleteDialogOpen}
            onClose={props.onCloseConfirmDeleteDialog}
            PaperComponent={PaperComponent}
            aria-labelledby='confirm-delete-container-dialog'
        >
            <DialogTitle className={cx(classes.FormTitle)} style={{ cursor: 'move' }} id='confirm-delete-container-dialog'>
                <Grid container spacing={2} direction={'row'}>
                    <Grid item xs={12}>
                        <Typography fontWeight={'600'} variant={'h5'}>
                            Are you sure you want to delete the{' '}
                            {props.container && ContainerTypeFormatter(props.container.container_type).toLowerCase()} {props.container?.name}?
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
                        className={cx(classes.DialogButtons)}
                        disableElevation={true}
                        variant={'contained'}
                        color={'secondary'}
                        autoFocus
                        onClick={props.onCloseConfirmDeleteDialog}
                    >
                        Cancel
                    </CancelButton>
                    <Button
                        className={cx(classes.DialogButtons)}
                        color={'error'}
                        variant={'contained'}
                        onClick={() => {
                            props.confirmDeleteContainer(props.container);
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

const useStyles = makeStyles<IConfirmDeleteContainerDialogProps>()((theme, props) => ({
    CancelButton: { color: theme.palette.grey[50] },
    DialogActions: {
        marginTop: '1rem',
        marginRight: '-.5rem',
    },
    FormTitle: {
        cursor: 'move',
        fontWeight: 600,
        marginTop: '1rem',
        marginBottom: '.5rem',
    },
    DialogButtons: {
        textTransform: 'none',
    },
}));

export { ConfirmDeleteContainerDialog };
