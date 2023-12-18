import React, { useState } from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { FileDropZone } from '../file-drop-zone/file-drop-zone';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFileTransferCardProps {
    selectedFiles: File[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
    onClickUploadFile: (data: File[]) => void;
    isLoading: boolean;
}

const FileTransferCard: React.FC<IFileTransferCardProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();

    return (
        <>
            <Card elevation={0}>
                <CardContent>
                    <Grid container direction={'column'}>
                        <Grid item xs={12} justifyContent={'space-between'}>
                            <Grid>
                                <Typography className={commonStyles.cx(commonStyles.classes.PageCardTitle)} variant={'h5'}>
                                    To Vega
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} justifyContent={'space-between'}>
                            <Grid>
                                <Typography variant={'subtitle1'} className={cx(classes.Subtitle)}>
                                    Upload your files to Vega analysts.
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} justifyContent={'space-between'}>
                            <Stack direction='column' justifyContent='center' alignItems='center' spacing={2}>
                                <FileDropZone
                                    setSelectedFiles={props.setSelectedFiles}
                                    selectedFiles={props.selectedFiles}
                                    isLoading={props.isLoading}
                                    inputOptions={{ maxFiles: 1, multiple: false }}
                                    onClickRemoveFile={() => props.setSelectedFiles([])}
                                />
                                <Button
                                    variant={'contained'}
                                    disableElevation
                                    color={'primary'}
                                    disabled={props.selectedFiles.length < 1 || props.isLoading}
                                    onClick={() => {
                                        props.onClickUploadFile(props.selectedFiles);
                                    }}
                                >
                                    <Typography>Upload Files</Typography>
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
};

const useStyles = makeStyles<IFileTransferCardProps>()((theme, props) => ({
    Subtitle: {
        paddingBottom: '1rem',
    },
}));

export { FileTransferCard };
