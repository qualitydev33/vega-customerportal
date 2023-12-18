import React from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, PaperProps, Typography } from '@mui/material';
import { PaperComponent } from '../utilities/paper-component';
import { CancelButton } from '@vegaplatformui/utils';
import { IFile } from '@vegaplatformui/models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IConfirmDeleteFileDialogProps {
    selectedFiles: IFile[];
    onClickDeleteSelectedFiles: () => void;
    isConfirmDeleteDialogOpen: boolean;
    onCloseConfirmDeleteDialog(): void;
    fileToDelete?: IFile;
    confirmDeleteFile(file: IFile): void;
}

const ConfirmDeleteFileDialog: React.FC<IConfirmDeleteFileDialogProps> = (props) => {
    const { classes, cx } = useCommonStyles();

    return (
        <Dialog
            fullWidth
            open={props.isConfirmDeleteDialogOpen}
            onClose={props.onCloseConfirmDeleteDialog}
            PaperComponent={(paperProps: PaperProps) => PaperComponent(paperProps, '#confirm-delete-file-dialog')}
            aria-labelledby='confirm-create-file-dialog'
        >
            <DialogTitle className={cx(classes.FormTitle)} style={{ cursor: 'move' }} id='confirm-delete-file-dialog'>
                <Grid container spacing={2} direction={'row'}>
                    <Grid item xs={12}>
                        {props.selectedFiles.length > 1 ? (
                            <Typography fontWeight={'600'} variant={'h5'}>
                                Are you sure you want to delete {props.selectedFiles.length} files?
                            </Typography>
                        ) : (
                            <Typography fontWeight={'600'} variant={'h5'}>
                                Are you sure you want to delete {props.fileToDelete?.filename}?
                            </Typography>
                        )}
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
                            if (props.selectedFiles.length > 1) {
                                return props.onClickDeleteSelectedFiles();
                            } else {
                                return props.confirmDeleteFile(props.fileToDelete!);
                            }
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

const useStyles = makeStyles<IConfirmDeleteFileDialogProps>()((theme, props) => ({}));

export { ConfirmDeleteFileDialog };
