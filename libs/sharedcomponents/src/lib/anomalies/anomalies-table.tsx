import React, { useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import {
    DataGridPremium,
    GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
    GridColDef,
    gridDetailPanelExpandedRowsContentCacheSelector,
    GridRenderCellParams,
    GridRowGroupingModel,
    GridRowId,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton,
    GridValueFormatterParams,
    GridValueGetterParams,
    useGridApiRef,
    useGridSelector,
    useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { Box, IconButton, LinearProgress, Link } from '@mui/material';
import { AnomalyCategory, IAnomaly } from '@vegaplatformui/models';
import { AnomalyDetailsDialog } from './anomaly-details-dialog';
import { useRecoilState } from 'recoil';
import { vegaTableControls } from '@vegaplatformui/sharedcomponents';

export interface IAnomaliesTableProps {
    isLoading: boolean;
    anomalies: IAnomaly[];
    anomalyCategory: AnomalyCategory;
    category: string;
    selectedAnomaly?: IAnomaly;
    rowGroupingModel: GridRowGroupingModel;
    setRowGroupingModel: React.Dispatch<React.SetStateAction<GridRowGroupingModel>>;
    getVariance(params: GridValueGetterParams<any, IAnomaly>): string | undefined;
    getDifference(params: GridValueGetterParams<any, IAnomaly>): number | undefined;
    getAnomaliesSpike(params: GridValueGetterParams<any, IAnomaly>): string | undefined;
}
const AnomaliesTable: React.FC<IAnomaliesTableProps> = (props) => {
    const apiRef = useGridApiRef();
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [isGroupExpanded, setIsGroupExpanded] = React.useState(false);
    const { classes, cx } = useStyles({ props, isExpanded, isGroupExpanded });
    const [tableControls, setTableControls] = useRecoilState(vegaTableControls);
    const paginationModel = tableControls.find((control) => control.key === 'anomalies-table')?.value.paginationModel;
    const [rowGroupingModel, setRowGroupingModel] = React.useState<GridRowGroupingModel>(
        props.category === 'account' ? ['linked_account_id'] : ['product']
    );
    const baseColumnOptions: Partial<GridColDef> = {
        align: 'left',
        headerAlign: 'left',
        minWidth: 100,
        flex: 1,
    };

    const getCurrentAverage = (params: GridValueGetterParams<any, IAnomaly>) => {
        if (params.row.anomaly === 'Usage Spike') {
            return Math.ceil(params.row.current_usage_amount);
        }
        if (params.row.anomaly === 'OnDemand Spike') {
            return Math.ceil(params.row.current_ondemand_cost);
        }
        if (params.row.anomaly === 'Net Fiscal Spike') {
            return Math.ceil(params.row.current_net_fiscal);
        } else {
            return undefined;
        }
    };

    const getHistoricAverage = (params: GridValueGetterParams<any, IAnomaly>) => {
        if (params.row.anomaly === 'Usage Spike') {
            return Math.ceil(params.row.average_daily_usage);
        }
        if (params.row.anomaly === 'OnDemand Spike') {
            return Math.ceil(params.row.average_daily_ondemand);
        }
        if (params.row.anomaly === 'Net Fiscal Spike') {
            return Math.ceil(params.row.average_net_fiscal);
        } else {
            return undefined;
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'cloud_provider',
            headerName: 'Provider',
            hideable: false,
            ...baseColumnOptions,
            type: 'string',
        },
        {
            field: 'cloud_provider_identifier',
            headerName: 'Identifier',
            ...baseColumnOptions,
            type: 'string',
        },
        {
            field: 'business_group',
            headerName: 'Business Group',
            ...baseColumnOptions,
        },
        {
            field: 'business_unit',
            headerName: 'Business Unit',
            ...baseColumnOptions,
            type: 'string',
        },
        props.category === 'account'
            ? {
                  field: 'linked_account_id',
                  headerName: 'Account',
                  hideable: false,
                  type: 'number',
                  ...baseColumnOptions,
              }
            : {
                  field: 'product',
                  headerName: 'Product',
                  hideable: false,
                  type: 'string',
                  ...baseColumnOptions,
              },

        {
            field: 'cloud_region',
            headerName: 'Region',
            ...baseColumnOptions,
        },
        {
            field: 'average_daily_usage',
            headerName: 'Historic Avg',
            type: 'number',
            ...baseColumnOptions,
            valueGetter: getHistoricAverage,
        },
        {
            field: 'current_average',
            headerName: 'Current Avg',
            type: 'number',
            ...baseColumnOptions,
            valueGetter: getCurrentAverage,
        },
        {
            field: 'difference',
            headerName: 'Difference',
            type: 'number',
            ...baseColumnOptions,
            valueGetter: props.getDifference,
        },

        {
            field: 'anomaly_spike',
            headerName: 'Anomaly Spike',
            type: 'number',
            ...baseColumnOptions,
            valueGetter: props.getAnomaliesSpike,
        },
        /*{
            field: 'product_cost_detail_category',
            hideable: false,
            headerName: 'Product Detail Category',
            ...baseColumnOptions,
        },
        {
            field: 'date_tested',
            headerName: 'Date Tested',
            type: 'number',
            ...baseColumnOptions,
        },
        {
            field: 'average_daily_ondemand',
            headerName: 'Average Spend',
            type: 'number',
            ...baseColumnOptions,
            valueFormatter: ({ value }) => {
                if (isNaN(value)) {
                    return;
                } else {
                    return new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumSignificantDigits: 3,
                        minimumFractionDigits: 3,
                    }).format(value);
                }
            },
        },
        {
            field: 'current_ondemand_cost',
            headerName: 'Current Spend',
            type: 'number',
            ...baseColumnOptions,
            valueFormatter: ({ value }) => {
                if (isNaN(value)) {
                    return;
                } else {
                    return new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumSignificantDigits: 3,
                        minimumFractionDigits: 3,
                    }).format(value);
                }
            },
        },
        {
            field: 'average_daily_usage',
            headerName: 'Average Usage',
            type: 'number',
            ...baseColumnOptions,
            valueFormatter: (params: GridValueFormatterParams) => {
                const row = apiRef.current.getRow(params.id as GridRowId);
                if (row.billing_unit === 'Dollar') {
                    return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 3 }).format(
                        row.average_daily_usage
                    );
                } else {
                    return row.average_daily_usage;
                }
            },
        },
        {
            field: 'current_usage_amount',
            headerName: 'Current Usage',
            type: 'number',
            ...baseColumnOptions,
            valueFormatter: (params: GridValueFormatterParams) => {
                const row = apiRef.current.getRow(params.id as GridRowId) as IAnomaly;
                if (row.billing_unit === 'Dollar') {
                    return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 3 }).format(
                        row.current_usage_amount
                    );
                } else {
                    return row.current_usage_amount;
                }
            },
        },
        {
            field: 'application',
            headerName: 'Application',
            ...baseColumnOptions,
        },
        {
            field: 'cost_category',
            headerName: 'Cost Category',
            ...baseColumnOptions,
        },

        {
            field: 'total_overage',
            headerName: 'Total Overage',
            ...baseColumnOptions,
        },*/
        {
            ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF, // Already contains the right field
            width: 100,
            renderCell: (params) => {
                const row = apiRef.current.getRow(params.id as GridRowId) as IAnomaly;
                if (row.id !== undefined) {
                    return <CustomIconButton id={params.id} value={params.value} />;
                } else {
                    return <></>;
                }
            },
        },
    ];

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton className={cx(classes.ToolBarFilter)} />
                <GridToolbarFilterButton className={cx(classes.ToolBarFilter)} />
                <GridToolbarDensitySelector className={cx(classes.ToolBarFilter)} />
                <GridToolbarExport className={cx(classes.ToolBarFilter)} printOptions={{ disableToolbarButton: true }} />
            </GridToolbarContainer>
        );
    }
    function CustomIconButton(props: Pick<GridRenderCellParams, 'id' | 'value'>) {
        const { id, value: isExpanded } = props;

        const contentCache = useGridSelector(apiRef, gridDetailPanelExpandedRowsContentCacheSelector);
        const hasDetail = React.isValidElement(contentCache[id]);

        return (
            <Link variant={'subtitle1'} className={cx(classes.Link)} underline={'none'}>
                Details
            </Link>
        );
    }

    const initialState = useKeepGroupedColumnsHidden({
        apiRef,
        rowGroupingModel,
        initialState: {
            columns: {
                columnVisibilityModel: {
                    // Hide the column used for leaves
                    product: false,
                    cloud_provider: false,
                    /*product_cost_detail_category: false,
                    linked_account_id: false,
                    anomaly: false,
                    average_daily_ondemand: false,
                    current_ondemand_cost: false,
                    average_daily_usage: false,
                    current_usage_amount: false,
                    billing_unit: false,
                    cost_category: false,
                    cloud_region: false,
                    total_overage: false,
                    variance: false,*/
                },
            },
        },
    });

    return (
        <Box>
            <DataGridPremium
                className={cx(classes.DataGrid)}
                defaultGroupingExpansionDepth={0}
                groupingColDef={{
                    hideDescendantCount: true,
                    headerClassName: cx(classes.GroupedColumn),
                    cellClassName: cx(classes.GroupedColumn),
                    leafField: 'cloud_provider',
                    width: 300,
                }}
                getDetailPanelContent={(params) => (
                    <AnomalyDetailsDialog
                        apiRef={apiRef}
                        selectedAnomaly={params.row}
                        isLoadingDetails={props.isLoading}
                        getVariance={props.getVariance}
                    />
                )}
                getDetailPanelHeight={() => 'auto'}
                rowGroupingColumnMode={'single'}
                initialState={initialState}
                getRowId={(row: IAnomaly) => row.id}
                disableColumnMenu
                autoHeight={true}
                apiRef={apiRef}
                pageSizeOptions={[5, 10, 15]}
                density={'standard'}
                columns={columns}
                rows={props.anomalies}
                disableRowSelectionOnClick={true}
                slots={{
                    loadingOverlay: LinearProgress,
                    toolbar: (props) => <CustomToolbar {...props} className={cx(classes.ToolBar)} />,
                }}
                paginationModel={paginationModel}
                onPaginationModelChange={(p) => {
                    setTableControls((controls) => {
                        return controls.map((control) => {
                            if (control.key === 'anomalies-table') {
                                control.value.paginationModel = p;
                            }
                            return control;
                        });
                    });
                }}
                loading={props.isLoading}
                rowGroupingModel={props.rowGroupingModel}
                onRowGroupingModelChange={props.setRowGroupingModel}
            />
        </Box>
    );
};
interface IAnomaliesTableStyles {
    props: IAnomaliesTableProps;
    isExpanded: boolean;
    isGroupExpanded: boolean;
}
//https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript

const useStyles = makeStyles<IAnomaliesTableStyles>()((theme, input) => ({
    DataGrid: {
        '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus': {
            outline: 'none',
        },
        '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus': {
            outline: 'none',
        },
        border: 'none',
    },
    GroupedColumn: {
        width: input.isGroupExpanded ? 50 : 250,
    },
    ToolBar: {
        color: theme.palette.grey[100],
        '& .MuiFormControl-root': {
            minWidth: '100%',
        },
    },
    ToolBarFilter: {
        /*color: theme.palette.grey[500]*/
        marginBottom: '1rem',
    },
    Link: {
        cursor: 'pointer',
        fontWeight: '600',
    },
}));

export { AnomaliesTable };
