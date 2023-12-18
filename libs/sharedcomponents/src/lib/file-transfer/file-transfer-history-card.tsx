import React from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { DeleteSweep } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { ICloudProviderAccount, IFile } from '@vegaplatformui/models';
import { ConfirmDeleteFileDialog } from './confirm-delete-file-dialog';
import { FileTransferHistoryTable } from './file-transfer-history-table';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFileTransferHistoryCardProps {
    selectedFiles: IFile[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<IFile[]>>;
    isLoading: boolean;
    onClickDeleteFile: (file: IFile) => void;
    onClickDeleteSelectedFiles: () => void;
    confirmDeleteFile: (file: IFile) => void;
    setIsConfirmDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isConfirmDeleteDialogOpen: boolean;
    setFileToDelete: React.Dispatch<React.SetStateAction<IFile | undefined>>;
    fileToDelete?: IFile;
    historyFiles: IFile[];
}

const FileTransferHistoryCard: React.FC<IFileTransferHistoryCardProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();

    const onOpenDeleteFileDialog = (file: IFile) => {
        props.setFileToDelete(file);
        props.setIsConfirmDeleteDialogOpen(true);
    };

    const confirmDeleteFile = (file: IFile) => {
        props.confirmDeleteFile(file);
        onCloseDeleteFileDialog();
    };

    const onCloseDeleteFileDialog = () => {
        props.setFileToDelete(undefined);
        props.setIsConfirmDeleteDialogOpen(false);
    };

    const onClickDeleteSelectedFiles = () => {
        props.onClickDeleteSelectedFiles();
        props.setIsConfirmDeleteDialogOpen(false);
    };

    return (
        <>
            <ConfirmDeleteFileDialog
                onClickDeleteSelectedFiles={onClickDeleteSelectedFiles}
                isConfirmDeleteDialogOpen={props.isConfirmDeleteDialogOpen}
                onCloseConfirmDeleteDialog={onCloseDeleteFileDialog}
                confirmDeleteFile={confirmDeleteFile}
                selectedFiles={props.selectedFiles}
                fileToDelete={props.fileToDelete}
            />
            <Card elevation={0}>
                <CardContent>
                    <Grid container direction={'column'}>
                        <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                            <Grid xs={6} item>
                                <Typography className={commonStyles.cx(commonStyles.classes.PageCardTitle)} variant={'h5'}>
                                    File Upload History
                                </Typography>
                            </Grid>
                            <Grid xs={6} item container justifyContent={'flex-end'}>
                                <Stack direction={'row'} spacing={1}>
                                    {props.selectedFiles.length > 1 && (
                                        <Button
                                            startIcon={<DeleteSweep />}
                                            className={cx(classes.AccountButtons, commonStyles.classes.MultipleDeleteButton)}
                                            variant={'contained'}
                                            onClick={() => props.setIsConfirmDeleteDialogOpen(true)}
                                        >
                                            Delete Selected Files
                                        </Button>
                                    )}
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                            <Grid xs={6} item>
                                <Typography variant={'subtitle1'} className={cx(classes.Subtitle)}>
                                    Manage your uploaded files.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <FileTransferHistoryTable
                        selectedFiles={props.selectedFiles}
                        setSelectedFiles={props.setSelectedFiles}
                        isLoading={props.isLoading}
                        onOpenDeleteFileDialog={onOpenDeleteFileDialog}
                        historyFiles={props.historyFiles}
                    />
                </CardContent>
            </Card>
        </>
    );
};

const useStyles = makeStyles<IFileTransferHistoryCardProps>()((theme, props) => ({
    Subtitle: {
        paddingBottom: '1rem',
    },
    AccountButtons: {
        textTransform: 'none',
    },
}));

export { FileTransferHistoryCard };
