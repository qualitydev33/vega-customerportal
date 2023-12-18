import React from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import {
    DataGridPremium,
    GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
    GridColDef,
    gridDetailPanelExpandedRowsContentCacheSelector,
    GridRenderCellParams,
    GridRowId,
    GridRowParams,
    GridValueFormatterParams,
    useGridApiContext,
    useGridApiRef,
    useGridSelector,
} from '@mui/x-data-grid-premium';
import { IconButton } from '@mui/material';
import { IRecommendation } from '@vegaplatformui/models';
import { ExpandMore } from '@mui/icons-material';
import { RecommendationDetailsContent } from './recommendation-details-content/recommendation-details-content';
import { RecommendationsApi } from '@vegaplatformui/apis';
import { DataGridCellTooltip, DataGridCustomToolbar, useTableUtilities } from '@vegaplatformui/sharedcomponents';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRecommendationsTableProps {
    rows: IRecommendation[];
    recommendationApi: RecommendationsApi;
    isLoading: boolean;
}

const RecommendationsTable: React.FC<IRecommendationsTableProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();
    const recommendationsTableUtilities = useTableUtilities('recommendations-table');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const apiRef = useGridApiRef();

    const getDetailPanelContent = React.useCallback((params: GridRowParams<IRecommendation>) => {
        return <RecommendationDetailsContent onLoadingCallback={setIsLoading} recommendationApi={props.recommendationApi} gridRowParams={params} />;
    }, []);

    const baseColumnOptions: Partial<GridColDef> = {
        align: 'left',
        headerAlign: 'left',
        flex: 1,
    };

    const columns: GridColDef[] = [
        {
            field: 'rec_name',
            headerName: 'Recommendation',
            ...baseColumnOptions,
        },
        {
            field: 'rec_savings',
            headerName: 'Possible Savings (per mo)',
            ...baseColumnOptions,
            valueFormatter: (params: GridValueFormatterParams) =>
                new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(params.value),
        },
        {
            field: 'location',
            headerName: 'Location',
            ...baseColumnOptions,
        },
        {
            field: 'detected_at',
            headerName: 'Detected At',
            ...baseColumnOptions,
            //Since the date is coming in as a string value like yyyy-mm-dd, etc instead of a timestamp we need to parse it first to use the formatter
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
            field: 'num_resources',
            headerName: 'Affected Resources',
            ...baseColumnOptions,
        },
        {
            headerName: 'Details',
            ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
            renderCell: (params) => <CustomDetailPanelToggle id={params.id} value={params.value} />,
        },
    ];

    columns.map((column) => {
        if (!column.renderCell) column.renderCell = DataGridCellTooltip;
        return column;
    });

    const getTogglableColumns = (columns: GridColDef[]) => {
        return columns.filter((column) => column.headerName !== 'Details').map((column) => column.field);
    };

    function CustomDetailPanelToggle(props: Pick<GridRenderCellParams, 'id' | 'value'>) {
        const { id, value: isExpanded } = props;
        const apiRef = useGridApiContext();

        // To avoid calling ´getDetailPanelContent` all the time, the following selector
        // gives an object with the detail panel content for each row id.
        const contentCache = useGridSelector(apiRef, gridDetailPanelExpandedRowsContentCacheSelector);

        // If the value is not a valid React element, it means that the row has no detail panel.
        const hasDetail = React.isValidElement(contentCache[id]);

        return (
            <IconButton size='small' tabIndex={-1} disabled={!hasDetail} aria-label={isExpanded ? 'Close' : 'Open'}>
                <ExpandMore
                    sx={{
                        transform: `rotateZ(${isExpanded ? 180 : 0}deg)`,
                        transition: (theme) =>
                            theme.transitions.create('transform', {
                                duration: theme.transitions.duration.shortest,
                            }),
                    }}
                    fontSize='inherit'
                />
            </IconButton>
        );
    }

    return (
        <DataGridPremium
            slots={{
                toolbar: DataGridCustomToolbar,
            }}
            slotProps={{
                columnsPanel: {
                    getTogglableColumns,
                },
            }}
            rowThreshold={0}
            className={cx(commonStyles.classes.DataGrid)}
            getDetailPanelContent={getDetailPanelContent}
            getDetailPanelHeight={() => 'auto'}
            disableColumnMenu
            autoHeight={true}
            apiRef={apiRef}
            pageSizeOptions={[5, 10, 15]}
            density={'standard'}
            columns={columns}
            rows={props.rows}
            disableRowSelectionOnClick={true}
            paginationModel={recommendationsTableUtilities.currentTableControl?.paginationModel}
            onPaginationModelChange={recommendationsTableUtilities.onPaginationModelChange}
            loading={props.isLoading || isLoading}
            paginationMode={'server'}
            rowCount={recommendationsTableUtilities.currentTableControl?.totalRows ?? 0}
        />
    );
};

const useStyles = makeStyles<IRecommendationsTableProps>()((theme, props) => ({}));

export { RecommendationsTable };
