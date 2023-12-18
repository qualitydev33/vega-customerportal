import React, { useEffect } from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import {
    DataGridPremium,
    GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
    GridCallbackDetails,
    GridColDef,
    GridRenderCellParams,
    GridRowParams,
    GridToolbar,
} from '@mui/x-data-grid-premium';
import { GridActionsCellItem, GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';
import { MoreHoriz, MoreVert, TrafficSharp } from '@mui/icons-material';
import { Button, Grid, IconButton } from '@mui/material';
import { RecommendationDetailsContentTableMenu } from './recommendation-details-content-table-menu';
import { IFile, IGetRecommendationResponse, IRecommendation, IResource, ResourcesEntity } from '@vegaplatformui/models';
import { RecommendationsApi } from '@vegaplatformui/apis';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRecommendationsDetailsContentTableProps {
    recommendation: IGetRecommendationResponse;
    recommendationsApi: RecommendationsApi;
    loadRecommendation: () => void;
}

const RecommendationDetailsContentTable: React.FC<IRecommendationsDetailsContentTableProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [selectedResources, setSelectedResources] = React.useState<IResource[]>([]);
    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);

    const commonStyles = useCommonStyles();

    const baseColumnOptions: Partial<GridColDef> = {
        align: 'left',
        headerAlign: 'left',
        flex: 1,
    };

    const columns: GridColDef[] = [
        {
            field: 'resource_id',
            headerName: 'Resource',
            ...baseColumnOptions,
        },
        {
            field: 'region',
            headerName: 'Location',
            ...baseColumnOptions,
        },
        {
            field: 'date_detected',
            headerName: 'Date Detected',
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
            field: 'usage',
            headerName: 'Usage',
            ...baseColumnOptions,
        },
        {
            field: 'individual_vega_savings',
            headerName: 'Individual Vega Savings',
            ...baseColumnOptions,
        },
        {
            field: 'Actions',
            ...baseColumnOptions,
            renderHeader: () =>
                selectedResources.length > 1 && (
                    <RecommendationDetailsContentTableMenu
                        selectedResources={selectedResources}
                        setSelectedResources={setSelectedResources}
                        recommendationResources={selectedResources}
                        loadRecommendation={props.loadRecommendation}
                        recommendation={props.recommendation}
                        onClearResources={setRowSelectionModel}
                        recommendationsApi={props.recommendationsApi}
                    />
                ),
            filterable: false,
            sortable: false,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params: GridRenderCellParams<IResource>) => (
                <strong>
                    <RecommendationDetailsContentTableMenu
                        setSelectedResources={setSelectedResources}
                        selectedResources={selectedResources}
                        recommendationResources={[params.row]}
                        loadRecommendation={props.loadRecommendation}
                        recommendation={props.recommendation}
                        onClearResources={setRowSelectionModel}
                        recommendationsApi={props.recommendationsApi}
                        isDisabled={selectedResources.length > 1}
                    />
                </strong>
            ),
        },
    ];

    const onRowSelectionModelChange = (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => {
        setSelectedResources(rowSelectionModel.map((id: GridRowId) => props.recommendation.resources.find((row: any) => row.id === id)) as any);
        setRowSelectionModel(rowSelectionModel);
    };

    return (
        <DataGridPremium
            rowThreshold={0}
            className={cx(commonStyles.classes.DataGrid)}
            disableColumnMenu
            autoHeight={true}
            pageSizeOptions={[5, 10, 15]}
            density={'standard'}
            columns={columns}
            rows={props.recommendation.resources.filter((resource) => {
                if (!resource.is_actioned) {
                    return resource;
                }
            })}
            checkboxSelection
            onRowSelectionModelChange={onRowSelectionModelChange}
            rowSelectionModel={rowSelectionModel}
            disableRowSelectionOnClick={true}
        />
    );
};

const useStyles = makeStyles<IRecommendationsDetailsContentTableProps>()((theme, props) => ({
    MultiResourceButton: {
        width: 40,
        height: 40,
        borderRadius: '8px',
        backgroundColor: theme.palette.grey[100],
    },
}));

export { RecommendationDetailsContentTable };
