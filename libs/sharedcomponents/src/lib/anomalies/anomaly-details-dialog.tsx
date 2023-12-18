import React, { Dispatch, useEffect, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Stack } from '@mui/material';
import { IAnomaly } from '@vegaplatformui/models';
import { GridFooter, GridRowId } from '@mui/x-data-grid';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid-premium';
import CloseIcon from '@mui/icons-material/Close';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { AnomaliesDetailTable } from './anomalies-detail-table';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAnomalyDetailsCardProps {
    isLoadingDetails: boolean;
    selectedAnomaly: IAnomaly;
    apiRef: React.MutableRefObject<GridApiPremium>;
    getVariance(params: GridValueGetterParams<any, IAnomaly>): string | undefined;
}
// client_name: string;
// billing_account_id: string;
// business_group: string;
// business_unit: string;
// linked_account_id: string;
// linked_account_name: string;
// product: string;
// cloud_region: string;
// cloud_zone: string;
// product_cost_detail_category: string;
// cost_category: string;
// billing_unit: string;
// average_resource_count: number;
// average_daily_usage: number;
// average_net_fiscal: number;
// average_daily_ondemand: number;
// current_resource_count: number;
// current_usage_amount: number;
// current_net_fiscal: number;
// current_ondemand_cost: number;
// usage_difference: number;
// ondemand_difference: number;
// anomaly: string;
// date_tested: number;
// id: string;
const AnomalyDetailsDialog: React.FC<IAnomalyDetailsCardProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [openDialog, setOpenDialog] = useState(true);

    const baseColumnOptions: Partial<GridColDef> = {
        align: 'left',
        headerAlign: 'left',
        minWidth: 100,
        flex: 1,
    };

    const columns: GridColDef[] = [
        {
            field: 'product_id',
            headerName: 'Product ID',
            ...baseColumnOptions,
        },
        {
            field: 'application',
            headerName: 'Application',
            ...baseColumnOptions,
        },
        {
            field: 'product_cost_detail_category',
            headerName: 'Product Detail Category',
            ...baseColumnOptions,
        },
        {
            field: 'cost_category',
            headerName: 'Cost Category',
            ...baseColumnOptions,
        },
        {
            field: 'billing_unit',
            headerName: 'Units',
            type: 'string',
            ...baseColumnOptions,
        },
        {
            field: 'technical_owner',
            headerName: 'Technical Owner',
            type: 'string',
            ...baseColumnOptions,
        },
        {
            field: 'total_overage',
            headerName: 'Total Overage',
            ...baseColumnOptions,
        },
        {
            field: 'variance',
            headerName: 'Variance',
            ...baseColumnOptions,
            valueGetter: props.getVariance,
        },
        /*{
            field: 'linked_account_id',
            headerName: 'Account ID',
            ...baseColumnOptions,
        },
        {
            field: 'cloud_provider',
            headerName: 'Cloud Provider',
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
                const row = props.apiRef.current.getRow(params.id as GridRowId);
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
                const row = props.apiRef.current.getRow(params.id as GridRowId) as IAnomaly;
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
            field: 'cloud_region',
            headerName: 'Region',
            ...baseColumnOptions,
        },*/
    ];

    const onClose = () => {
        props.apiRef.current.toggleDetailPanel(props.apiRef.current.getExpandedDetailPanels()[0]);
        setOpenDialog(false);
    };

    return (
        <Stack classes={cx(classes.Stack)} spacing={1}>
            <Dialog className={cx(classes.Dialog)} open={openDialog} fullWidth={true}>
                <Stack direction={'row'} justifyContent={'space-between'}>
                    <DialogTitle>Details</DialogTitle>
                    <IconButton onClick={onClose}>
                        <CloseIcon></CloseIcon>
                    </IconButton>
                </Stack>
                <AnomaliesDetailTable selectedAnomaly={props.selectedAnomaly} isLoading={props.isLoadingDetails} columns={columns} />
            </Dialog>
        </Stack>
    );
};

const useStyles = makeStyles<IAnomalyDetailsCardProps>()((theme, props) => ({
    Stack: {
        backgroundColor: theme.palette.grey[800],
        paddingBottom: '1rem',
    },
    ActionButtons: {
        textTransform: 'none',
    },
    Dialog: {
        '& .MuiDialog-paper': {
            maxWidth: '70vw',
        },
    },
}));

export { AnomalyDetailsDialog };
