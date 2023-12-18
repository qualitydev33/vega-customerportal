import React, { useState } from 'react';
import { Stack, Typography, Button } from '@mui/material';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { DataGridPremium, GridColDef, GridPaginationModel, GridValueFormatterParams, GridRenderCellParams } from '@mui/x-data-grid-premium';
import { useRecoilState } from 'recoil';
import { FormatNumberUSDHundredth } from '../../utilities/value-formatter-methods';
import { IRecommendation } from '@vegaplatformui/models';
import { useTableUtilities } from '../../use-table-utilities/use-table-utilities';

interface ResourceRecommendationsPanelProps {
    isLoading: boolean;
    recommendations: IRecommendation[];
}

const ResourceRecommendationsPanel: React.FC<ResourceRecommendationsPanelProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();
    const resourcesDetailPanelTableUtilities = useTableUtilities('resource-recommendation-panel-table');

    const [selectedRecommendation, setSelectedRecommendation] = useState<IRecommendation>({
        rec_type: '',
        rec_savings: '',
        location: '',
        num_resources: '',
        detected_at: '',
        id: '',
    });
    const columns: GridColDef[] = [
        {
            field: 'rec_type',
            headerName: 'Recommendation',
            flex: 1,
        },
        {
            field: 'detected_at',
            headerName: 'Date',
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
            field: 'rec_savings',
            headerName: 'Potential Savings',
            flex: 1,
            valueFormatter: (params: GridValueFormatterParams) => FormatNumberUSDHundredth(params.value),
        },
        {
            field: 'rec_status',
            headerName: 'Status',
            flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params: GridRenderCellParams<IRecommendation>) => (
                <Button color='primary' variant='contained' onClick={() => clickTakeActionButton(params.row)}>
                    Go To Take Action
                </Button>
            ),
        },
    ];

    const clickTakeActionButton = (rec: IRecommendation) => {
        setSelectedRecommendation(rec);
    };
    return (
        <Stack>
            <Typography variant={'h6'}>Recommendations</Typography>
            <DataGridPremium
                className={commonStyles.cx(commonStyles.classes.DataGrid)}
                disableColumnMenu
                autoHeight={true}
                pageSizeOptions={[5, 10, 15]}
                density={'standard'}
                columns={columns}
                rows={props.recommendations}
                getRowId={(row) => row.rec_id}
                disableRowSelectionOnClick={true}
                paginationModel={resourcesDetailPanelTableUtilities.currentTableControl?.paginationModel}
                onPaginationModelChange={resourcesDetailPanelTableUtilities.onPaginationModelChange}
                loading={props.isLoading}
                pagination
            />
        </Stack>
    );
};

const useStyles = makeStyles<ResourceRecommendationsPanelProps>()((theme, props) => ({}));

export { ResourceRecommendationsPanel };
