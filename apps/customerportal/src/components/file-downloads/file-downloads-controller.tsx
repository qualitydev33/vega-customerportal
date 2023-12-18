import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import {
    defaultVegaTableControl,
    FileDownloadsCard,
    SnackbarErrorOutput,
    SnackBarOptions,
    useCommonPageHeader,
    vegaTableControls,
} from '@vegaplatformui/sharedcomponents';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Card, CardContent } from '@mui/material';
import { useKeycloak } from '@react-keycloak-fork/web';
import { FileApi } from '@vegaplatformui/apis';
import { IFile, IGetFileDownloadUrlsResponse } from '@vegaplatformui/models';
import { downloadZip } from 'client-zip';
import streamSaver from 'streamsaver';
import { GenerateRandomString } from '@vegaplatformui/utils';
import * as url from 'url';

export type IFileDownloadsContainerProps = React.PropsWithChildren;

const FileDownloadsController: React.FC<IFileDownloadsContainerProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [availableFilesToDownload, setAvailableFilesToDownload] = useState<IFile[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<IFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const setSnackbarOptions = useSetRecoilState(SnackBarOptions);
    const { keycloak } = useKeycloak();
    const [tableControls, setTableControls] = useRecoilState(vegaTableControls);

    useEffect(() => {
        setTableControls((controls) => {
            return [
                ...controls,
                {
                    key: 'file-downloads-table',
                    value: { ...defaultVegaTableControl },
                },
            ];
        });
        return () => {
            setTableControls((controls) => {
                return controls.filter((control) => control.key !== 'file-downloads-table');
            });
        };
    }, []);

    useEffect(() => {
        const fileApi = new FileApi();
        fileApi.token = keycloak.token ?? '';

        fileApi
            .getFiles('false')
            .then((response) => {
                setAvailableFilesToDownload(response.data.items);
                setIsLoading(false);
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem loading files: ${error}`,
                });
                setIsLoading(false);
            });
    }, [keycloak.token, setSnackbarOptions]);

    const createFileArchiveName = () => {
        return `vega-file-download-${Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(Date.now())}-${GenerateRandomString(5)}.zip`;
    };
    const onClickDownloadSelectedFiles = () => {
        const fileApi = new FileApi();
        fileApi.token = keycloak.token ?? '';

        fileApi
            .getFileDownloadUrls({ items: selectedFiles })
            .then(async (response) => {
                await onDownloadFiles(response.data, createFileArchiveName()).then(() => {
                    setSnackbarOptions({
                        snackBarProps: { open: true, autoHideDuration: 6000 },
                        alertProps: { severity: 'info' },
                        message: `Downloading ${selectedFiles.length} files.`,
                    });
                    setSelectedFiles([]);
                });
            })
            .catch((error) => {
                onErrorDownloadingFiles(error);
            });
    };

    const onClickDownloadFile = (data: IFile) => {
        const fileApi = new FileApi();
        fileApi.token = keycloak.token ?? '';

        fileApi
            .getFileDownloadUrls({ items: [data] })
            .then(async (response) => {
                await onDownloadFiles(response.data, createFileArchiveName()).then(() => {
                    setSnackbarOptions({
                        snackBarProps: { open: true, autoHideDuration: 6000 },
                        alertProps: { severity: 'info' },
                        message: `Downloading ${data.filename}`,
                    });
                    setSelectedFiles([]);
                });
            })
            .catch((error) => {
                onErrorDownloadingFiles(error);
            });
    };

    const onDownloadFiles = async (fileDownloadResponse: IGetFileDownloadUrlsResponse, archiveName: string) => {
        const files = await Promise.all(
            fileDownloadResponse.items.map(async (file) => {
                return {
                    name: file.filename,
                    input: await fetch(decodeURI(file.url)),
                };
            })
        );
        await downloadZip(files).body?.pipeTo(streamSaver.createWriteStream(archiveName));
    };

    const onErrorDownloadingFiles = (error: any) => {
        setSnackbarOptions({
            snackBarProps: { open: true, autoHideDuration: 6000 },
            alertProps: { severity: 'error' },
            message: `${
                selectedFiles.length > 1 ? 'There was a problem downloading your files: ' : 'There was a problem downloading your file: '
            }${SnackbarErrorOutput(error)}`,
        });
    };

    return (
        <FileDownloadsCard
            selectedFiles={selectedFiles}
            availableFilesToDownload={availableFilesToDownload}
            onClickDownloadSelectedFiles={onClickDownloadSelectedFiles}
            onClickDownloadFile={onClickDownloadFile}
            setSelectedFiles={setSelectedFiles}
            isLoading={isLoading}
        />
    );
};

const useStyles = makeStyles<IFileDownloadsContainerProps>()((theme, props) => ({}));

export { FileDownloadsController };
