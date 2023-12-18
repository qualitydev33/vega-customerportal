import React, { useEffect } from 'react';
import { DataGrid, GridRowSelectionModel, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import { Box, Button, IconButton } from '@mui/material';
import { makeStyles } from '@vegaplatformui/styling';
import { GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid-premium';
import { Delete, Edit } from '@mui/icons-material';
import { useRecoilState } from 'recoil';
import { vegaTableControls } from '../recoil/atom';

export type VegaTag = { id: string; key: string; values: string[]; resources: string; required: boolean; description: string; createdAt: string };

export interface ITagManagerTableProps {
    tags: VegaTag[];
    setSelectedTags: React.Dispatch<React.SetStateAction<VegaTag[]>>;
    selectedTags: VegaTag[];
    isLoading: boolean;
    onClickEditTag: (tag: VegaTag) => void;
    onClickDeleteTag: (tag: VegaTag) => void;
}

const TagManagerTable: React.FC<ITagManagerTableProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>([]);
    const [tableControls, setTableControls] = useRecoilState(vegaTableControls);
    const paginationModel = tableControls.find((control) => control.key === 'tag-manager-table')?.value.paginationModel;

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarFilterButton className={cx(classes.ToolBarFilter)} />
            </GridToolbarContainer>
        );
    }

    const columns: GridColDef[] = [
        { field: 'key', headerName: 'Tag', flex: 1 },
        {
            field: 'values',
            headerName: 'Values',
            flex: 1,
        },
        {
            field: 'resources',
            headerName: 'Resources',
            flex: 1,
        },
        {
            field: 'required',
            headerName: 'Required',
            flex: 1,
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 1,
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            flex: 1,
        },
        {
            field: 'actions',
            /*
            type: 'actions',
*/
            filterable: false,
            sortable: false,
            flex: 1,
            headerClassName: cx(classes.ActionsHeader),
            renderCell: (params: GridRenderCellParams<VegaTag>) => (
                <strong>
                    <IconButton onClick={() => props.onClickEditTag(params.row)} size='small' tabIndex={params.hasFocus ? 0 : -1}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => props.onClickDeleteTag(params.row)} size='small' tabIndex={params.hasFocus ? 0 : -1}>
                        <Delete />
                    </IconButton>
                </strong>
            ),
        },
    ];

    const onRowsSelectionHandler = (gridSelectionModel: GridRowSelectionModel) => {
        setSelectionModel(gridSelectionModel);
        props.setSelectedTags(gridSelectionModel.map((id) => props.tags.find((tag) => tag.id === id) as VegaTag));
    };

    return (
        <Box>
            <DataGrid
                disableColumnMenu
                autoHeight={true}
                pageSizeOptions={[5, 10, 15]}
                density={'standard'}
                columns={columns}
                rows={props.tags}
                onRowSelectionModelChange={(gridSelectionModel: GridRowSelectionModel) => onRowsSelectionHandler(gridSelectionModel)}
                rowSelectionModel={selectionModel}
                checkboxSelection={true}
                disableRowSelectionOnClick={true}
                slots={{
                    toolbar: GridToolbar,
                }}
                paginationModel={paginationModel}
                onPaginationModelChange={(p) => {
                    setTableControls((controls) => {
                        return controls.map((control) => {
                            if (control.key === 'tag-manager-table') {
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

const useStyles = makeStyles<ITagManagerTableProps>()((theme, props) => ({
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
    ActionsHeader: { fontSize: 0 },
}));

export { TagManagerTable };
