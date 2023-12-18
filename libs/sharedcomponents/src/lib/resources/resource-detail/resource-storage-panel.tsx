import React from 'react';
import {
    DataGridPremium,
    GridColDef,
    GridRenderCellParams,
    GridToolbarContainer,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
    GridToolbarColumnsButton,
    GridToolbarExport,
    GridToolbar,
    GridValueGetterParams,
    GridValueFormatterParams,
    GridPaginationModel,
} from '@mui/x-data-grid-premium';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { Stack, Typography } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ResourceStoragePanelProps {
    isLoadingDiskDataGrid: boolean,
    isLoadingSnapshotsDataGrid: boolean,
}

const ResourceStoragePanel: React.FC<ResourceStoragePanelProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();
    const diskDataGridColumns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            valueFormatter: () => '###########',
        },
        {
            field: 'date_created',
            headerName: 'Date Created',
            flex: 1,
            valueFormatter: () => '###########',
        },
        {
            field: 'size',
            headerName: 'Size',
            flex: 1,
            valueFormatter: () => '###########',
        },
    ];
    const snapshotDataGridColumns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            valueFormatter: () => '###########',
        },
        {
            field: 'source_resource_id',
            headerName: 'Source Resource ID',
            flex: 1,
            valueFormatter: () => '###########',
        },
        {
            field: 'date_created',
            headerName: 'Date Created',
            flex: 1,
            valueFormatter: () => '###########',
        },
        {
            field: 'type',
            headerName: 'Type',
            flex: 1,
            valueFormatter: () => '###########',
        },
        {
            field: 'size',
            headerName: 'Size',
            flex: 1,
            valueFormatter: () => '###########',
        },
    ];
    return (
        <>
            <Stack>
                <Typography variant={'h6'}>Disks</Typography>
                <DataGridPremium
                    className={commonStyles.cx(commonStyles.classes.DataGrid)}
                    disableColumnMenu
                    autoHeight={true}
                    density={'standard'}
                    columns={diskDataGridColumns}
                    rows={[]}
                    disableRowSelectionOnClick={true}
                    loading={props.isLoadingDiskDataGrid}
                />
            </Stack>

            <Stack marginTop={3}>
                <Typography variant={'h6'}>Snapshots</Typography>
                <DataGridPremium
                    className={commonStyles.cx(commonStyles.classes.DataGrid)}
                    disableColumnMenu
                    autoHeight={true}
                    density={'standard'}
                    columns={snapshotDataGridColumns}
                    rows={[]}
                    disableRowSelectionOnClick={true}
                    loading={props.isLoadingDiskDataGrid}
                />
            </Stack>
        </>
    );
};


const useStyles = makeStyles<ResourceStoragePanelProps>()((theme, props) => ({}));

export { ResourceStoragePanel };