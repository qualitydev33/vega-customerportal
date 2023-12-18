import React, { useEffect } from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { FileDropZone } from '../file-drop-zone/file-drop-zone';
import { Button, Card, CardContent, DialogContent, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import { BulkProviderAccountsTable } from './bulk-provider-accounts-table';
import { StringLowerCaseAndUnderscore } from '../utilities/string-formatter';
import { v4 as uuidv4 } from 'uuid';
import { CustomSnackBarOptions, StyledToolTip, useFetchFileBlobAndDownload } from '@vegaplatformui/sharedcomponents';
import { AwsLogo, AwsTemplate, AzureLogo, AzureTemplate, GcpLogo, GcpTemplate } from '@vegaplatformui/sharedassets';
import { Download } from '@mui/icons-material';
import { SetterOrUpdater } from 'recoil';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBulkProviderAccountCardProps {
    selectedFiles: File[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
    isFilesLoading: boolean;
    setSnackbarOptions: SetterOrUpdater<CustomSnackBarOptions>;
}

const BulkProviderAccountCard: React.FC<IBulkProviderAccountCardProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();
    const [fileRows, setFileRows] = React.useState([]);
    const [headerKeys, setHeaderKeys] = React.useState<string[]>([]);
    const fileReader = new FileReader();

    //sourced from https://refine.dev/blog/how-to-import-csv/
    const csvFileToArray = (fileData: any) => {
        const csvHeader = fileData.slice(0, fileData.indexOf('\n')).split(',');
        const csvRows = fileData.slice(fileData.indexOf('\n') + 1).split('\n');
        const tempArray = csvRows.map((row: string) => {
            const values = row.split(',');
            const obj = csvHeader.reduce((object: any[], header: string, index: number) => {
                object[StringLowerCaseAndUnderscore(header.replace(/[\n\r]/g, '')) as any] = values[index].replace(/[\n\r]/g, '');
                return object;
            }, {});
            return obj;
        });
        setFileRows(
            tempArray.map((row: any) => {
                return {
                    ...row,
                    id: uuidv4(),
                };
            })
        );
    };

    const handleOnSubmit = () => {
        //e.preventDefault();
        if (props.selectedFiles[0]) {
            fileReader.onload = function (event) {
                const text = event.target?.result;
                csvFileToArray(text);
            };

            fileReader.readAsText(props.selectedFiles[0]);
        }
    };

    const handleHeaderKeys = () => {
        if (props.selectedFiles.length > 0 && fileRows) {
            setHeaderKeys(
                (Object.keys(Object.assign({}, ...fileRows)) as string[]).map((headerKey: string) => {
                    return headerKey.replace(/[\n\r]/g, '');
                })
            );
        } else {
            setHeaderKeys([]);
        }
    };

    useEffect(() => {
        handleOnSubmit();
    }, [props.selectedFiles]);

    useEffect(() => {
        handleHeaderKeys();
    }, [fileRows]);

    return (
        <Stack className={cx(classes.DrawerContainer)} direction='column' justifyContent='flex-start' alignItems='flex-start' spacing={2}>
            <Stack direction='column' justifyContent='center' alignItems='flex-start' spacing={2}>
                <Button
                    className={commonStyles.cx(commonStyles.classes.LowercaseTextButton)}
                    variant={'outlined'}
                    onClick={() => {
                        useFetchFileBlobAndDownload('aws_template.csv', AwsTemplate, props.setSnackbarOptions);
                    }}
                    startIcon={<Download />}
                    endIcon={<AwsLogo className={cx(classes.CloudProviderIcon)} />}
                >
                    CSV Template
                </Button>
                <Button
                    className={commonStyles.cx(commonStyles.classes.LowercaseTextButton)}
                    variant={'outlined'}
                    onClick={() => {
                        useFetchFileBlobAndDownload('azure_template.csv', AzureTemplate, props.setSnackbarOptions);
                    }}
                    startIcon={<Download />}
                    endIcon={<AzureLogo className={cx(classes.CloudProviderIcon)} />}
                >
                    CSV Template
                </Button>
                <Button
                    className={commonStyles.cx(commonStyles.classes.LowercaseTextButton)}
                    variant={'outlined'}
                    onClick={() => {
                        useFetchFileBlobAndDownload('gcp_template.csv', GcpTemplate, props.setSnackbarOptions);
                    }}
                    startIcon={<Download />}
                    endIcon={<GcpLogo className={cx(classes.CloudProviderIcon)} />}
                >
                    CSV Template
                </Button>
            </Stack>
            <FileDropZone
                onClickRemoveFile={() => {
                    props.setSelectedFiles([]);
                }}
                selectedFiles={props.selectedFiles}
                setSelectedFiles={props.setSelectedFiles}
                isLoading={props.isFilesLoading}
                inputOptions={{
                    maxFiles: 1,
                    multiple: false,
                    accept: {
                        'text/csv': ['.csv'],
                    },
                }}
                acceptedFileList={['CSV']}
            />
            {props.selectedFiles.length > 0 && (
                <>
                    <BulkProviderAccountsTable
                        selectedFiles={props.selectedFiles}
                        setSelectedFiles={props.setSelectedFiles}
                        fileRows={fileRows}
                        headerKeys={headerKeys}
                    />
                </>
            )}
        </Stack>
    );
};

const useStyles = makeStyles<IBulkProviderAccountCardProps>()((theme, props) => ({
    ClearButton: {
        textTransform: 'none',
    },
    BulkProviderSelect: {
        //alignItems: 'flex-end',
        justifyContent: 'flex-end',
        // alignSelf: 'flex-end',
    },
    DrawerContainer: {
        marginLeft: '3rem',
    },
    CloudProviderIcon: {
        width: '1.5rem',
    },
}));

export { BulkProviderAccountCard };
