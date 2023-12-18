import { Edit, Delete } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { GridColDef, GridRenderCellParams, GridRowSelectionModel, GridToolbarQuickFilter } from '@mui/x-data-grid-premium';
import { IBusinessGrouping } from '@vegaplatformui/models';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import React from 'react';
import { CloudProviderIcon } from '../utilities/logo-selector';
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import { Unit } from 'react-js-cron';

export interface IBusinessUnitsTableProps {
    setSelectedUnit: React.Dispatch<React.SetStateAction<IBusinessGrouping[]>>;
    onClickDeleteUnit: (unit: IBusinessGrouping) => void;
    onClickEditUnit: (unit: IBusinessGrouping) => void;
    isLoading: boolean;
    selectedUnits: IBusinessGrouping[];

    businessUnits: IBusinessGrouping[];
}

const BusinessUnitsTableOld: React.FC<IBusinessUnitsTableProps> = (props) => {
    const localStyles = useStyles(props);
    const commonStyles = useCommonStyles();

    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 5,
        page: 0,
    });
    const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>([]);

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
        },
        {
            field: 'members',
            headerName: 'Members',
            flex: 1,
        },
        {
            field: 'cloudAccounts',
            headerName: 'Cloud Accounts',
            flex: 1,
        },
        {
            field: 'resources',
            headerName: 'Resources',
            flex: 1,
        },
        {
            field: 'expensesMTD',
            headerName: 'Expenses MTD',
            flex: 1,
        },
        {
            field: 'currentMonthForecast',
            headerName: 'Current Month Forecast',
            flex: 1.2,
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
                    <IconButton
                        disabled={props.selectedUnits.length > 1}
                        onClick={() => props.onClickEditUnit(params.row as IBusinessGrouping)}
                        size='small'
                        tabIndex={params.hasFocus ? 0 : -1}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton
                        disabled={props.selectedUnits.length > 1}
                        onClick={() => props.onClickDeleteUnit(params.row)}
                        size='small'
                        tabIndex={params.hasFocus ? 0 : -1}
                    >
                        <Delete />
                    </IconButton>
                </strong>
            ),
        },
    ];

    const onRowsSelectionHandler = (gridSelectionModel: GridRowSelectionModel) => {
        setSelectionModel(gridSelectionModel);
        props.setSelectedUnit(
            gridSelectionModel.map((id) => props.businessUnits.find((unit: IBusinessGrouping) => unit.id === id) as unknown as IBusinessGrouping)
        );
    };

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarQuickFilter className={commonStyles.cx(commonStyles.classes.DataGridToolBarFilter)} />
            </GridToolbarContainer>
        );
    }
    return (
        <Box>
            <DataGrid
                disableColumnMenu
                autoHeight={true}
                pageSizeOptions={[5, 10, 15]}
                density={'standard'}
                columns={columns}
                rows={props.businessUnits}
                onRowSelectionModelChange={(gridSelectionModel: GridRowSelectionModel) => onRowsSelectionHandler(gridSelectionModel)}
                rowSelectionModel={selectionModel}
                checkboxSelection={true}
                disableRowSelectionOnClick={true}
                slots={{
                    toolbar: (props) => <CustomToolbar {...props} className={commonStyles.cx(commonStyles.classes.DataGridToolBar)} />,
                }}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                loading={false}
            />
        </Box>
    );
};

const useStyles = makeStyles<IBusinessUnitsTableProps>()((theme, props) => ({
    ActionsHeader: { fontSize: 0 },
}));

export { BusinessUnitsTableOld };
