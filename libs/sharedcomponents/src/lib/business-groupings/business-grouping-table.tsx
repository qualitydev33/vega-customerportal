import { Edit, Delete } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import {
    DataGridPremium,
    GridColDef,
    GridComparatorFn,
    GridRenderCellParams,
    GridRowSelectionModel,
    GridSortModel,
    gridStringOrNumberComparator,
    GridValueGetterParams,
} from '@mui/x-data-grid-premium';
import { IBusinessGrouping, IBusinessGroupingType } from '@vegaplatformui/models';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import React from 'react';
import { useRecoilState } from 'recoil';
import { GridBaseColDef } from '@mui/x-data-grid/internals';
import { DataGridCellTooltip, DataGridCustomToolbar, StyledToolTip, useTableUtilities, vegaTableControls } from '@vegaplatformui/sharedcomponents';

export interface IBusinessGroupingTableProps {
    setSelectedGrouping: React.Dispatch<React.SetStateAction<IBusinessGrouping[]>>;
    onClickDeleteGrouping: (grouping: IBusinessGrouping) => void;
    onClickOpenEditBusinessGroupingDialog: (grouping: IBusinessGrouping) => void;
    isLoading: boolean;
    businessGroupingTypes: IBusinessGroupingType[];
    selectedGroupings: IBusinessGrouping[];
    businessGroupings: IBusinessGrouping[];
}

const BusinessGroupingTable: React.FC<IBusinessGroupingTableProps> = (props) => {
    const localStyles = useStyles(props);
    const commonStyles = useCommonStyles();

    const businessGroupingsTableUtilities = useTableUtilities('business-groupings-table');

    const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>([]);
    const businessTypeSorter: GridComparatorFn<string> = (v1, v2, param1, param2) => {
        if (
            businessGroupingsTableUtilities.currentTableControl?.sortModel.find((model) => model.sort === 'asc' && model.field === 'type') !==
            undefined
        ) {
            //Normally this might be problem if the values could be non capitalized test verses Test
            //In this case though it's not a problem since the value being evaluated on is an enum
            return v1 < v2 ? -1 : 1;
        } else if (
            businessGroupingsTableUtilities.currentTableControl?.sortModel.find((model) => model.sort === 'desc' && model.field === 'type') !==
            undefined
        ) {
            //Normally this might be problem if the values could be non capitalized test verses Test
            //In this case though it's not a problem since the value being evaluated on is an enum
            return v1 > v2 ? 1 : -1;
        } else {
            return 0;
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
        },
        {
            field: 'type',
            headerName: 'Type',
            flex: 1,
            sortComparator: businessTypeSorter,
            valueGetter: (params: GridValueGetterParams<IBusinessGrouping>) =>
                props.businessGroupingTypes
                    .filter((type) => params.row.type === type.id)
                    //capitalize the First letter of each name
                    .map((type) => type.name.charAt(0).toUpperCase() + type.name.slice(1)),
        },
        {
            field: 'users',
            headerName: 'Users',
            flex: 1,
            valueGetter: (params: GridValueGetterParams<IBusinessGrouping>) => params.row.users.length,
        },
        {
            field: 'actions',
            filterable: false,
            sortable: false,
            flex: 1,
            align: 'center',
            headerClassName: localStyles.cx(localStyles.classes.ActionsHeader),
            renderCell: (params: GridRenderCellParams<IBusinessGrouping>) => (
                <strong>
                    <StyledToolTip arrow title='Edit'>
                        <IconButton
                            disabled={props.selectedGroupings.length > 1}
                            onClick={() => props.onClickOpenEditBusinessGroupingDialog(params.row)}
                            size='small'
                            tabIndex={params.hasFocus ? 0 : -1}
                        >
                            <Edit />
                        </IconButton>
                    </StyledToolTip>
                </strong>
            ),
        },
    ];

    columns.map((column) => {
        if (!column.renderCell) column.renderCell = DataGridCellTooltip;
        return column;
    });

    const getTogglableColumns = (columns: GridColDef[]) => {
        return columns.filter((column) => column.field !== 'actions').map((column) => column.field);
    };

    const onRowsSelectionHandler = (gridSelectionModel: GridRowSelectionModel) => {
        setSelectionModel(gridSelectionModel);
        props.setSelectedGrouping(
            gridSelectionModel.map((id) => props.businessGroupings.find((grouping: IBusinessGrouping) => grouping.id === id) as IBusinessGrouping)
        );
    };

    return (
        <Box>
            <DataGridPremium
                pagination
                disableColumnMenu
                className={commonStyles.cx(commonStyles.classes.DataGrid)}
                autoHeight={true}
                pageSizeOptions={[5, 10, 15]}
                density={'standard'}
                columns={columns}
                rows={props.businessGroupings}
                onRowSelectionModelChange={(gridSelectionModel: GridRowSelectionModel) => onRowsSelectionHandler(gridSelectionModel)}
                rowSelectionModel={selectionModel}
                checkboxSelection={false}
                disableRowSelectionOnClick={true}
                slots={{
                    toolbar: DataGridCustomToolbar,
                }}
                slotProps={{
                    columnsPanel: {
                        getTogglableColumns,
                    },
                }}
                paginationModel={businessGroupingsTableUtilities.currentTableControl?.paginationModel}
                onPaginationModelChange={businessGroupingsTableUtilities.onPaginationModelChange}
                loading={props.isLoading}
                sortModel={businessGroupingsTableUtilities.currentTableControl?.sortModel}
                onSortModelChange={businessGroupingsTableUtilities.onSortModelChange}
            />
        </Box>
    );
};

const useStyles = makeStyles<IBusinessGroupingTableProps>()((theme, props) => ({
    ActionsHeader: { fontSize: 0 },
}));

export { BusinessGroupingTable };
