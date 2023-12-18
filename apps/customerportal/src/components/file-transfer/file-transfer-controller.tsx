import React, { useEffect, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
    defaultVegaTableControl,
    FileTransferCard,
    FileTransferHistoryCard,
    SnackbarErrorOutput,
    SnackBarOptions,
    vegaTableControls,
} from '@vegaplatformui/sharedcomponents';
import { Stack } from '@mui/material';
import { ICloudProviderAccount, IFile } from '@vegaplatformui/models';
import { useKeycloak } from '@react-keycloak-fork/web';
import { FileApi, FileUploadApi } from '@vegaplatformui/apis';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFileTransferControllerProps {}

const FileTransferController: React.FC<IFileTransferControllerProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [files, setFiles] = useState<File[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<IFile[]>([]);
    const [historyFiles, setHistoryFiles] = useState<IFile[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const setSnackbarOptions = useSetRecoilState(SnackBarOptions);
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<IFile>();
    const { keycloak } = useKeycloak();
    const fileApi = new FileApi();
    const [tableControls, setTableControls] = useRecoilState(vegaTableControls);

    useEffect(() => {
        setTableControls((controls) => {
            return [
                ...controls,
                {
                    key: 'file-transfer-history-table',
                    value: { ...defaultVegaTableControl },
                },
            ];
        });
        return () => {
            setTableControls((controls) => {
                return controls.filter((control) => control.key !== 'file-transfer-history-table');
            });
        };
    }, []);
    // useCommonPageHeader({ message: 'File Transfer Page header' });

    useEffect(() => {
        loadFileHistory();
    }, [keycloak.token]);

    const onClickUploadFile = (data: File[]) => {
        setIsLoading(true);
        getFileUploadUrl(data[0]);
    };

    const loadFileHistory = () => {
        fileApi.token = keycloak.token ?? '';
        fileApi
            .getFiles('true')
            .then((response) => {
                setHistoryFiles(response.data.items);
                setIsHistoryLoading(false);
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem loading file history: ${SnackbarErrorOutput(error)}`,
                });
                setIsHistoryLoading(false);
            });
    };

    const uploadFileToDatabase = (file: File) => {
        fileApi.token = keycloak.token ?? '';
        fileApi
            .putFileUpload({ fileName: file.name })
            .then((response) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: `File has been uploaded`,
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem uploading the file: ${SnackbarErrorOutput(error)}`,
                });
            })
            .finally(() => {
                setIsLoading(false);
                setFiles([]);
                loadFileHistory();
            });
    };

    const uploadFile = (file: File, fileDownloadURL: string) => {
        const fileUploadApi = new FileUploadApi(fileDownloadURL);
        fileUploadApi
            .putFileUploadUrl({ filePath: file, fileDownloadUrl: fileDownloadURL })
            .then((response) => {
                setTimeout(() => {
                    uploadFileToDatabase(file);
                }, 100);
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem uploading the file into the bucket: ${SnackbarErrorOutput(error)}`,
                });
                setIsLoading(false);
            });
    };

    const getFileUploadUrl = (data: File) => {
        fileApi.token = keycloak.token ?? '';
        fileApi
            .getFileUploadUrl({ filename: data.name })
            .then((response) => {
                uploadFile(data, response.data);
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem getting the file presigned URL: ${SnackbarErrorOutput(error)}`,
                });
            });
    };

    const onClickDeleteFile = (file: IFile) => {
        fileApi.token = keycloak.token ?? '';
        fileApi
            .deleteUploadedFile({ items: [file] })
            .then(() => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: `The uploaded file, ${file.filename}, has been deleted`,
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a deleting the file: ${SnackbarErrorOutput(error)}`,
                });
            })
            .finally(() => {
                loadFileHistory();
            });
    };

    const onClickDeleteSelectedFiles = () => {
        fileApi.token = keycloak.token ?? '';
        fileApi
            .deleteUploadedFile({ items: selectedFiles })
            .then(() => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: `${selectedFiles.length} files have been deleted`,
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a deleting the files: ${SnackbarErrorOutput(error)}`,
                });
            })
            .finally(() => {
                loadFileHistory();
            });
    };

    return (
        <Stack spacing={1}>
            <FileTransferCard setSelectedFiles={setFiles} selectedFiles={files} onClickUploadFile={onClickUploadFile} isLoading={isLoading} />
            <FileTransferHistoryCard
                historyFiles={historyFiles}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                isLoading={isHistoryLoading}
                onClickDeleteFile={onClickDeleteFile}
                onClickDeleteSelectedFiles={onClickDeleteSelectedFiles}
                confirmDeleteFile={onClickDeleteFile}
                setIsConfirmDeleteDialogOpen={setIsConfirmDeleteDialogOpen}
                isConfirmDeleteDialogOpen={isConfirmDeleteDialogOpen}
                setFileToDelete={setFileToDelete}
                fileToDelete={fileToDelete}
            />
        </Stack>
    );
};

const useStyles = makeStyles<IFileTransferControllerProps>()((theme, props) => ({}));

export { FileTransferController };
