import React, { useEffect, useMemo } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { IconButton, LinearProgress, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { CloudUploadOutlined, FilePresent, Cancel } from '@mui/icons-material';

export interface IFileDropZoneProps extends DropzoneOptions {
    selectedFiles: File[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
    isLoading: boolean;
    inputOptions?: DropzoneOptions;
    acceptedFileList?: string[];
    onClickRemoveFile?: () => void;
}

const FileDropZone: React.FC<IFileDropZoneProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject, acceptedFiles } = useDropzone({
        ...props.inputOptions,
    });

    useEffect(() => {
        //Handle updating collection and navigating when menu selection changes
        props.setSelectedFiles(acceptedFiles);
    }, [acceptedFiles]);

    const files = props.selectedFiles.map((file) => (
        <Stack key={file.name} direction={'row'} alignItems={'center'} justifyContent={'flex-start'}>
            <ListItem key={file.name}>
                <ListItemIcon>
                    <FilePresent />
                </ListItemIcon>
                <ListItemText>
                    {file.name} - {file.size} bytes
                </ListItemText>
                {props.onClickRemoveFile && (
                    <IconButton onClick={props.onClickRemoveFile} className={cx(classes.RemoveFileButton)}>
                        <Cancel />
                    </IconButton>
                )}
            </ListItem>
            {props.isLoading && <LinearProgress className={cx(classes.LinearProgressBar)} />}
        </Stack>
    ));

    return (
        <section className={cx(classes.Section)}>
            <div {...getRootProps()} className={cx(classes.DropzoneContainer)}>
                <input {...getInputProps()} />
                <Stack className={cx(classes.Stack)} direction='column' justifyContent='center' alignItems='center' spacing={2}>
                    <CloudUploadOutlined className={cx(classes.UploadIcon)} />
                    <Typography variant={'body1'} color={'black'}>
                        Drag & drop a file here, or click to Browse
                    </Typography>
                    {props.acceptedFileList && (
                        <Typography variant={'subtitle2'} color={'grey'}>
                            {props.acceptedFileList.length > 1 ? 'Supported Formats: ' : 'Supported Format: '} {props.acceptedFileList.join(',')}
                        </Typography>
                    )}
                </Stack>
            </div>
            <aside>
                <List>{files}</List>
            </aside>
        </section>
    );
};

const useStyles = makeStyles<IFileDropZoneProps>()((theme, props) => ({
    DropzoneContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderWidth: '2px',
        borderRadius: '6px',
        borderColor: `${theme.palette.primary.light}60`,
        borderStyle: 'dashed',
        backgroundColor: `${theme.palette.primary.light}20`,
        color: '#BDBDBD',
        outline: 'none',
        transition: 'border .24s ease-in-out',
    },
    UploadIcon: {
        fontSize: '3rem',
        fill: theme.palette.primary.light,
    },
    Stack: { marginTop: '5rem', marginBottom: '5rem' },
    Section: {
        width: '100%',
    },
    LinearProgressBar: {
        width: '100%',
    },
    RemoveFileButton: {
        justifyContent: 'flex-end',
    },
}));

export { FileDropZone };
