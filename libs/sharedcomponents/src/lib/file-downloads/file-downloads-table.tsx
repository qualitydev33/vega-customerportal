import React, { useEffect } from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { FileDownload } from '@mui/icons-material';
import { DataGrid, GridActionsCellItem, GridRowId, GridRowSelectionModel, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import { Box, Button, Card, CardContent } from '@mui/material';
import { IFile } from '@vegaplatformui/models';
import { GridColDef, GridToolbarQuickFilter } from '@mui/x-data-grid-premium';
import { useRecoilState } from 'recoil';
import { vegaTableControls } from '@vegaplatformui/sharedcomponents';

export interface IFileDownloadsTableProps {
    isLoading: boolean;
    setSelectedFiles: React.Dispatch<React.SetStateAction<IFile[]>>;
    selectedFiles: IFile[];
    availableFilesToDownload: IFile[];
    onClickDownloadFile: (data: IFile) => void;
}

const FileDownloadsTable: React.FC<IFileDownloadsTableProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();
    const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>([]);
    const [tableControls, setTableControls] = useRecoilState(vegaTableControls);
    const paginationModel = tableControls.find((control) => control.key === 'file-downloads-table')?.value.paginationModel;

    useEffect(() => {
        if (props.selectedFiles.length === 0 && selectionModel.length > 0) {
            setSelectionModel([]);
        }
    }, [props.selectedFiles, selectionModel.length]);

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarQuickFilter className={commonStyles.cx(commonStyles.classes.DataGridToolBarFilter)} />
            </GridToolbarContainer>
        );
    }

    const columns: GridColDef[] = [
        { field: 'filename', headerName: 'File Name', flex: 1 },
        {
            field: 'lastmodified',
            headerName: 'Date Added',
            flex: 1,
            valueFormatter: ({ value }) =>
                Intl.DateTimeFormat('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }).format(value * 1000),
        },
        {
            field: 'size',
            headerName: 'File Size',
            flex: 1,
            valueFormatter: ({ value }) => formatBytes(Number(value)),
        },
        {
            field: 'actions',
            type: 'actions',
            sortable: false,
            flex: 1,
            getActions: (params) => [
                <Button
                    startIcon={<FileDownload />}
                    color='primary'
                    variant='contained'
                    disabled={props.selectedFiles.length > 1}
                    onClick={() => {
                        props.onClickDownloadFile(params.row);
                    }}
                >
                    Download
                </Button>,
            ],
        },
    ];

    const onRowsSelectionHandler = (gridSelectionModel: GridRowSelectionModel) => {
        props.setSelectedFiles(
            gridSelectionModel.map((id: GridRowId) => props.availableFilesToDownload.find((row: IFile) => row.id === id)) as IFile[]
        );
        setSelectionModel(gridSelectionModel);
    };

    return (
        <Box>
            <DataGrid
                className={commonStyles.cx(commonStyles.classes.DataGrid)}
                disableColumnMenu
                autoHeight={true}
                pageSizeOptions={[5, 10, 15]}
                density={'standard'}
                columns={columns}
                rows={props.availableFilesToDownload ?? []}
                onRowSelectionModelChange={(gridSelectionModel: GridRowSelectionModel) => onRowsSelectionHandler(gridSelectionModel)}
                rowSelectionModel={selectionModel}
                checkboxSelection={true}
                disableRowSelectionOnClick={true}
                slots={{
                    toolbar: (props) => <CustomToolbar {...props} className={cx(classes.ToolBar)} />,
                }}
                paginationModel={paginationModel}
                onPaginationModelChange={(p) => {
                    setTableControls((controls) => {
                        return controls.map((control) => {
                            if (control.key === 'file-downloads-table') {
                                control.value.paginationModel = p;
                            }
                            return control;
                        });
                    });
                }}
                loading={props.isLoading}
            />
        </Box>
    );
};

//https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript

const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

function formatBytes(x: any) {
    let l = 0,
        n = parseInt(x, 10) || 0;

    while (n >= 1024 && ++l) {
        n = n / 1024;
    }

    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l];
}

const useStyles = makeStyles<IFileDownloadsTableProps>()((theme, props) => ({
    ToolBar: {
        color: theme.palette.grey[100],
        '& .MuiFormControl-root': {
            minWidth: '100%',
        },
    },
    ToolBarFilter: {
        color: theme.palette.grey[500],
        marginBottom: '1rem',
    },
    FileIcon: {
        height: '0.875rem',
        marginBottom: '-.05rem',
        marginLeft: '-.5rem',
        color: theme.palette.grey[900],
    },
}));

export { FileDownloadsTable };
