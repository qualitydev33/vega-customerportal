import React, { useEffect } from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, IconButton, Paper, PaperProps, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { AzureTemplate, AwsTemplate, GcpTemplate, VegaInformYaml, AwsLogo, AzureLogo, GcpLogo } from '@vegaplatformui/sharedassets';
import Draggable from 'react-draggable';
import { BulkProviderAccountCard } from './bulk-provider-account-card';
import { ArrowBack, Close, Download } from '@mui/icons-material';
import { SetterOrUpdater } from 'recoil';
import { CustomSnackBarOptions, useFetchFileBlobAndDownload } from '@vegaplatformui/sharedcomponents';

export interface IBulkProviderAccountDialogProps {
    isDialogOpen: boolean;
    onCloseDialog: () => void;
    onBackDrawer: () => void;
    selectedFiles: File[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
    isFilesLoading: boolean;
    onSubmitBulkAccount(file: File): void;
    setSnackbarOptions: SetterOrUpdater<CustomSnackBarOptions>;
}

function PaperComponent(props: PaperProps) {
    const nodeRef = React.useRef(null);
    return (
        <Draggable nodeRef={nodeRef} handle='#choose-cloud-provider-dialog' cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper ref={nodeRef} {...props} />
        </Draggable>
    );
}

const BulkProviderAccountDrawer: React.FC<IBulkProviderAccountDialogProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();

    const onCloseDialog = () => {
        props.onCloseDialog();
        props.setSelectedFiles([]);
    };

    const onBackDrawer = () => {
        props.onBackDrawer();
        props.setSelectedFiles([]);
    };

    const onSubmitBulkAccount = (file: File) => {
        props.onSubmitBulkAccount(file);
        onCloseDialog();
    };

    return (
        <>
            <Drawer
                PaperProps={{
                    className: cx(classes.DrawerPaper),
                }}
                classes={{ root: cx(classes.DrawerRoot) }}
                anchor={'right'}
                open={props.isDialogOpen}
                onClose={onBackDrawer}
                aria-labelledby='bulk-import-drawer'
                hideBackdrop
            >
                <DialogTitle variant={'h6'} id='bulk-import-drawer-title'>
                    <Grid container>
                        <Grid xs={10}>
                            <Stack direction={'row'} justifyContent='flex-start' alignItems='flex-start' spacing={1}>
                                <IconButton onClick={onBackDrawer}>
                                    <ArrowBack color={'secondary'} />
                                </IconButton>
                                {/*Link multiple provider accounts by uploading a CSV file. Accounts will automatically be tested after creation
                                        and there will be a discovery every 30 minutes to search for errors.*/}
                                <Stack direction={'column'}>
                                    Bulk Provider Import
                                    <Typography variant={'body2'}>
                                        Download these templates to link multiple provider accounts by uploading a CSV file.
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid xs={2}>
                            <IconButton className={cx(classes.CloseButton)} onClick={props.onCloseDialog}>
                                <Close color={'secondary'} />
                            </IconButton>
                        </Grid>
                    </Grid>
                </DialogTitle>

                <DialogContent className={cx(classes.FormContentWindow)}>
                    <BulkProviderAccountCard
                        selectedFiles={props.selectedFiles}
                        setSelectedFiles={props.setSelectedFiles}
                        isFilesLoading={props.isFilesLoading}
                        setSnackbarOptions={props.setSnackbarOptions}
                    />
                </DialogContent>
                <Stack className={cx(classes.FormContentWindow)}>
                    <DialogActions className={cx(classes.DialogActions)}>
                        {/*<CancelButton variant={'contained'} color={'secondary'} autoFocus onClick={onCloseDialog}>*/}
                        {/*    Cancel*/}
                        {/*</CancelButton>*/}
                        <Button
                            className={commonStyles.cx(commonStyles.classes.LowercaseTextButton)}
                            variant={'contained'}
                            onClick={() => onSubmitBulkAccount(props.selectedFiles[0])}
                            disabled={props.selectedFiles.length < 1}
                        >
                            Upload File
                        </Button>
                    </DialogActions>
                </Stack>
            </Drawer>
        </>
    );
};

const useStyles = makeStyles<IBulkProviderAccountDialogProps>()((theme, props) => ({
    DialogActions: {
        marginRight: '1rem',
    },
    FormContentWindow: {
        width: '90%',
    },
    DrawerRoot: {
        zIndex: '1300 !important' as any,
    },
    DrawerPaper: { width: '35%' },
    CloseButton: {
        float: 'right',
        marginRight: '-1.5rem',
        marginTop: '-1rem',
    },
}));

export { BulkProviderAccountDrawer };
