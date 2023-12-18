import React from 'react';
import { CustomSnackBarOptions, FrontendFileDownloadBlob } from '@vegaplatformui/sharedcomponents';
import { SetterOrUpdater, useSetRecoilState } from 'recoil';

//Only for local files (right now)
//The main intention is that the file is never going to change so its stored locally (in the frontend directories) like {root}/libs/sharedassets/src/files
const useFetchFileBlobAndDownload = (fileName: string, fileToDownload: string, setSnackbarOptions: SetterOrUpdater<CustomSnackBarOptions>) => {
    fetch(fileToDownload).then((response) => {
        response
            .blob()
            .then((blob) => {
                FrontendFileDownloadBlob(blob, fileName);
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: 'There was a problem downloading the file',
                });
            })
            .finally(() => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: 'File downloaded',
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: 'There was a problem fetching the file',
                });
            });
    });
};

export { useFetchFileBlobAndDownload };
