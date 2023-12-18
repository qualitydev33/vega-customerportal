import React from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { Button, Card, CardContent, Grid, Paper, Typography } from '@mui/material';
import { FileDownloadsTable } from './file-downloads-table';
import { IFile } from '@vegaplatformui/models';

export interface IFileDownloadsProps {
    setSelectedFiles: React.Dispatch<React.SetStateAction<IFile[]>>;
    selectedFiles: IFile[];
    availableFilesToDownload: IFile[];
    onClickDownloadSelectedFiles(): void;
    onClickDownloadFile: (data: IFile) => void;
    isLoading: boolean;
}

const FileDownloadsCard: React.FC<IFileDownloadsProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();

    return (
        <Card elevation={0}>
            <CardContent>
                <Grid container direction={'column'}>
                    <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                        <Grid xs={6} item>
                            <Typography className={commonStyles.cx(commonStyles.classes.PageCardTitle)} variant={'h5'}>
                                From Vega
                            </Typography>
                        </Grid>
                        <Grid xs={6} item container justifyContent={'flex-end'}>
                            {props.selectedFiles.length > 1 ? (
                                <Button variant={'contained'} onClick={props.onClickDownloadSelectedFiles}>
                                    Download selected files
                                </Button>
                            ) : (
                                <div className={cx(classes.ButtonPlaceHolder)}></div>
                            )}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                        <Grid xs={6} item>
                            <Typography variant={'subtitle1'} className={cx(classes.Subtitle)}>
                                Download files from Vega analysts.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <FileDownloadsTable
                    availableFilesToDownload={props.availableFilesToDownload}
                    setSelectedFiles={props.setSelectedFiles}
                    selectedFiles={props.selectedFiles}
                    onClickDownloadFile={props.onClickDownloadFile}
                    isLoading={props.isLoading}
                />
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles<IFileDownloadsProps>()((theme, props) => ({
    ButtonPlaceHolder: {
        height: '2.25rem',
    },
    Subtitle: {
        paddingBottom: '1rem',
    },
}));

export { FileDownloadsCard };
