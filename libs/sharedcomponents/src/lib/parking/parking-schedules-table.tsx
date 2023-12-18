import React from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { Box, Button } from '@mui/material';
import { DataGridPremium, GridColDef, GridRenderCellParams } from '@mui/x-data-grid-premium';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { ICloudProviderAccount, IParkingSchedule, IParkingScheduleSummary } from '@vegaplatformui/models';
import { CloudProviderIcon } from '../utilities/logo-selector';
import IconButton from '@mui/material/IconButton';
import { ArrowForwardIos, Delete, Edit } from '@mui/icons-material';
import { DataGridCellTooltip, DataGridCustomToolbar, StyledToolTip, useTableUtilities, vegaTableControls } from '@vegaplatformui/sharedcomponents';
import { useRecoilState } from 'recoil';
// @ts-ignore
import { minimalTimezoneSet } from 'compact-timezone-list';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IParkingSchedulesTableProps {
    parkingSchedules: IParkingScheduleSummary[];
    selectedSchedules: IParkingScheduleSummary[];
    setSelectedSchedules: React.Dispatch<React.SetStateAction<IParkingScheduleSummary[]>>;
    isLoading: boolean;
    onClickAction: (ScheduleId: any) => void;
    disableFilters?: boolean;
    onClickDelete?: () => void;
}

const ParkingSchedulesTable: React.FC<IParkingSchedulesTableProps> = (props) => {
    const { cx, classes } = useStyles(props);
    const commonStyles = useCommonStyles();
    const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>([]);
    const parkingScheduleTableUtilities = useTableUtilities('parking-schedules-table');

    const paginationModel = parkingScheduleTableUtilities.currentTableControl?.paginationModel;

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Parking Schedule Name',
            flex: 1,
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 1,
        },
        {
            field: 'utc_offset',
            headerName: 'Time Zone',
            flex: 1,
        },
        {
            field: 'number_of_resources',
            filterable: false,
            sortable: false,
            headerName: 'Number of Resources',
            flex: 1,
        },
        {
            field: 'updated_at',
            headerName: 'Last Updated ',
            flex: 1,
            valueFormatter: ({ value }) =>
                Intl.DateTimeFormat('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }).format(Date.parse(value)),
        },
        {
            field: 'actions',
            renderHeader: () =>
                props.selectedSchedules?.length > 0 && props.onClickDelete ? (
                    <StyledToolTip title={props.selectedSchedules.length > 1 ? 'Delete Schedules' : 'Delete Schedule'}>
                        <IconButton onClick={props.onClickDelete}>
                            <Delete />
                        </IconButton>
                    </StyledToolTip>
                ) : (
                    <></>
                ),
            filterable: false,
            sortable: false,
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params: GridRenderCellParams<any>) => (
                <strong>
                    <StyledToolTip title={'View Parking Schedule'}>
                        <IconButton
                            disabled={props.selectedSchedules.length > 1}
                            onClick={() => props.onClickAction(params.id)}
                            size='small'
                            tabIndex={params.hasFocus ? 0 : -1}
                        >
                            <ArrowForwardIos />
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
        props.setSelectedSchedules(gridSelectionModel.map((id) => props.parkingSchedules.find((schedule) => schedule.id === id) as any));
    };

    return (
        <Box>
            <DataGridPremium
                disableColumnMenu
                className={commonStyles.cx(commonStyles.classes.DataGrid)}
                autoHeight={true}
                pagination={true}
                pageSizeOptions={[5, 10, 15]}
                density={'standard'}
                columns={columns}
                paginationMode={'server'}
                rowCount={parkingScheduleTableUtilities.currentTableControl?.totalRows ?? 0}
                rows={props.parkingSchedules}
                onRowSelectionModelChange={(gridSelectionModel: GridRowSelectionModel) => onRowsSelectionHandler(gridSelectionModel)}
                rowSelectionModel={selectionModel}
                checkboxSelection={true}
                disableRowSelectionOnClick={true}
                slots={
                    props.disableFilters
                        ? {}
                        : {
                              toolbar: DataGridCustomToolbar,
                          }
                }
                slotProps={{
                    columnsPanel: {
                        getTogglableColumns,
                    },
                }}
                paginationModel={paginationModel}
                onPaginationModelChange={parkingScheduleTableUtilities.onPaginationModelChange}
                onSortModelChange={parkingScheduleTableUtilities.onSortModelChange}
                onFilterModelChange={parkingScheduleTableUtilities.onFilterModelChange}
                loading={props.isLoading}
            />
        </Box>
    );
};

const useStyles = makeStyles<IParkingSchedulesTableProps>()((theme, props) => ({}));

export { ParkingSchedulesTable };
