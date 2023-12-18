import React, { useState } from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { GridFilterModel, GridRowSelectionModel, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import {
    DataGridPremium,
    GridColDef,
    GridRenderCellParams,
    GridToolbar,
    GridToolbarQuickFilter,
    GridValueFormatterParams,
} from '@mui/x-data-grid-premium';
import {
    DataGridCellTooltip,
    DataGridCustomToolbar,
    FormatNumberUSDHundredth,
    StyledToolTip,
    useTableUtilities,
    vegaTableControls,
} from '@vegaplatformui/sharedcomponents';
import IconButton from '@mui/material/IconButton';
import { ArrowForwardIos } from '@mui/icons-material';
import { Box } from '@mui/material';
import { ICloudProviderAccount, IResource } from '@vegaplatformui/models';
import { CloudProviderIcon } from '../utilities/logo-selector';
import { useRecoilState } from 'recoil';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICreateScheduleAttachedResourcesTableProps {
    resources: IResource[];
    selectedResources: IResource[];
    setSelectedResources: React.Dispatch<React.SetStateAction<IResource[]>>;
    isLoading: boolean;
    isSelectable: boolean;
    isServerPaginated?: boolean;
}

const CreateScheduleResourcesTable: React.FC<ICreateScheduleAttachedResourcesTableProps> = (props) => {
    const { cx, classes } = useStyles(props);
    const commonStyles = useCommonStyles();
    const [tableControls, setTableControls] = useRecoilState(vegaTableControls);
    const createScheduleResourceTableControls = useTableUtilities('create-schedule-resources-table');
    const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>(props.selectedResources.map((resource) => resource?.id) ?? []);

    const columns: GridColDef[] = [
        {
            field: 'resource_id',
            headerName: 'Resource ID',
            flex: 1,
        },

        {
            field: 'provider_str',
            headerName: 'Provider',
            flex: 1,
            renderCell: (params: GridRenderCellParams<ICloudProviderAccount>) => <CloudProviderIcon cloudProvider={params.row?.provider_str} />,
        },
        {
            field: 'cloud_account_id',
            headerName: 'Cloud Account',
            flex: 1,
        },
        {
            field: 'type_str',
            headerName: 'Instance Type',
            flex: 1,
        },
        /*  {
            field: 'cost',
            headerName: 'Cost/Mo',
            flex: 1,
            valueFormatter: (params: GridValueFormatterParams) => FormatNumberUSDHundredth(params.value),
        },*/
        {
            field: 'region',
            headerName: 'Region',
            flex: 1,
        },
    ];

    columns.map((column) => {
        if (!column.renderCell) column.renderCell = DataGridCellTooltip;
        return column;
    });

    const onRowsSelectionHandler = (gridSelectionModel: GridRowSelectionModel) => {
        setSelectionModel(gridSelectionModel);

        const selected = [...props.resources, ...props.selectedResources].flat().filter((resource) => gridSelectionModel.includes(resource?.id));
        let uniqueItems = [...new Set(selected)];

        props.setSelectedResources(uniqueItems);
    };

    return (
        <DataGridPremium
            disableColumnMenu
            className={commonStyles.cx(commonStyles.classes.DataGrid)}
            autoHeight={true}
            pagination={true}
            pageSizeOptions={[5, 10, 15]}
            rowCount={props.isServerPaginated ? createScheduleResourceTableControls.currentTableControl?.totalRows ?? 0 : undefined}
            paginationMode={props.isServerPaginated ? 'server' : 'client'}
            keepNonExistentRowsSelected={true}
            density={'standard'}
            columns={columns}
            rows={props.resources}
            onRowSelectionModelChange={(gridSelectionModel: GridRowSelectionModel) => onRowsSelectionHandler(gridSelectionModel)}
            rowSelectionModel={selectionModel}
            checkboxSelection={props.isSelectable}
            disableRowSelectionOnClick={true}
            slots={{ toolbar: DataGridCustomToolbar }}
            slotProps={{
                toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                },
            }}
            paginationModel={createScheduleResourceTableControls.currentTableControl?.paginationModel}
            filterMode={'server'}
            sortingMode={'server'}
            onSortModelChange={createScheduleResourceTableControls.onSortModelChange}
            onPaginationModelChange={createScheduleResourceTableControls.onPaginationModelChange}
            loading={props.isLoading}
            onFilterModelChange={createScheduleResourceTableControls.onFilterModelChange}
        />
    );
};

const useStyles = makeStyles<ICreateScheduleAttachedResourcesTableProps>()((theme, props) => ({}));

export { CreateScheduleResourcesTable };
