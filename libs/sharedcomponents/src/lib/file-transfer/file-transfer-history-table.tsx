import React from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { GridRowSelectionModel, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import { DataGridPremium, GridColDef, GridRenderCellParams, GridToolbarQuickFilter } from '@mui/x-data-grid-premium';
import { ICloudProviderAccount, IFile } from '@vegaplatformui/models';
import { CloudProviderIcon } from '../utilities/logo-selector';
import IconButton from '@mui/material/IconButton';
import { Delete, Edit } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useRecoilState } from 'recoil';
import { StyledToolTip, vegaTableControls } from '@vegaplatformui/sharedcomponents';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFileTransferHistoryTableProps {
    selectedFiles: IFile[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<IFile[]>>;
    isLoading: boolean;
    onOpenDeleteFileDialog(file: IFile): void;
    historyFiles: IFile[];
}

const FileTransferHistoryTable: React.FC<IFileTransferHistoryTableProps> = (props) => {
    const localStyles = useStyles(props);
    const commonStyles = useCommonStyles();

    const [tableControls, setTableControls] = useRecoilState(vegaTableControls);
    const paginationModel = tableControls.find((control) => control.key === 'file-transfer-history-table')?.value.paginationModel;
    const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>([]);

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarQuickFilter className={commonStyles.cx(commonStyles.classes.DataGridToolBarFilter)} />
            </GridToolbarContainer>
        );
    }

    const columns: GridColDef[] = [
        {
            field: 'filename',
            headerName: 'File Name',
            flex: 1,
            renderCell: (params: GridRenderCellParams<IFile>) => params.row.filename.split('/')[1],
        },
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
            filterable: false,
            sortable: false,
            flex: 1,
            align: 'center',
            headerClassName: localStyles.cx(localStyles.classes.ActionsHeader),
            renderCell: (params: GridRenderCellParams<IFile>) => (
                <StyledToolTip arrow title='Delete'>
                    <IconButton
                        disabled={props.selectedFiles.length > 1}
                        onClick={() => props.onOpenDeleteFileDialog(params.row)}
                        size='small'
                        tabIndex={params.hasFocus ? 0 : -1}
                    >
                        <Delete />
                    </IconButton>
                </StyledToolTip>
            ),
        },
    ];

    const onRowsSelectionHandler = (gridSelectionModel: GridRowSelectionModel) => {
        setSelectionModel(gridSelectionModel);
        props.setSelectedFiles(gridSelectionModel.map((id) => props.historyFiles.find((file) => file.id === id) as IFile));
    };

    return (
        <Box>
            <DataGridPremium
                className={commonStyles.cx(commonStyles.classes.DataGrid)}
                disableColumnMenu
                autoHeight={true}
                pagination={true}
                pageSizeOptions={[5, 10, 15]}
                density={'standard'}
                columns={columns}
                rows={props.historyFiles ?? []}
                onRowSelectionModelChange={(gridSelectionModel: GridRowSelectionModel) => onRowsSelectionHandler(gridSelectionModel)}
                rowSelectionModel={selectionModel}
                checkboxSelection={true}
                disableRowSelectionOnClick={true}
                slots={{
                    toolbar: (props) => <CustomToolbar {...props} className={commonStyles.cx(commonStyles.classes.DataGridToolBar)} />,
                }}
                paginationModel={paginationModel}
                onPaginationModelChange={(p) => {
                    setTableControls((controls) => {
                        return controls.map((control) => {
                            if (control.key === 'file-transfer-history-table') {
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

const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

function formatBytes(x: any) {
    let l = 0,
        n = parseInt(x, 10) || 0;

    while (n >= 1024 && ++l) {
        n = n / 1024;
    }

    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l];
}

const useStyles = makeStyles<IFileTransferHistoryTableProps>()((theme, props) => ({ ActionsHeader: { fontSize: 0 } }));

export { FileTransferHistoryTable };
