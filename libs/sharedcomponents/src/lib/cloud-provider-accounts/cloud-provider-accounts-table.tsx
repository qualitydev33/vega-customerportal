import React, { useEffect } from 'react';
import { useCommonStyles, makeStyles } from '@vegaplatformui/styling';
import {
    GridColDef,
    GridRenderCellParams,
    DataGridPremium,
    useGridApiRef,
    GridValueGetterParams,
    GridValueFormatterParams,
} from '@mui/x-data-grid-premium';
import { Box, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Edit, Refresh, Error, PriorityHigh, Announcement, Check } from '@mui/icons-material';
import { FilterTableByProvider, ICloudProviderAccount } from '@vegaplatformui/models';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { CloudProviderIcon } from '../utilities/logo-selector';
import {
    DataGridCellTooltip,
    DataGridCustomToolbar,
    DiscoveryDetails,
    StyledToolTip,
    useTableUtilities,
    vegaTableControls,
} from '@vegaplatformui/sharedcomponents';
import { useRecoilState } from 'recoil';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICloudProviderAccountsTableProps {
    cloudProviderAccounts: ICloudProviderAccount[];
    setSelectedAccounts: React.Dispatch<React.SetStateAction<ICloudProviderAccount[]>>;
    selectedAccounts: ICloudProviderAccount[];
    isLoading: boolean;
    onClickEditAccount: (account: ICloudProviderAccount) => void;
    onOpenDeleteAccountDialog(account: ICloudProviderAccount): void;
    tableFilterByProvider: FilterTableByProvider;
    setTableFilterByProvider: React.Dispatch<React.SetStateAction<FilterTableByProvider>>;
    handleClickSendDiscoveryRequest: (accounts: string[]) => void;
    onClickShowDiscoveryErrorDetails: (account: ICloudProviderAccount) => void;
}

const CloudProviderAccountsTable: React.FC<ICloudProviderAccountsTableProps> = (props) => {
    const localStyles = useStyles(props);
    const commonStyles = useCommonStyles();
    const apiRef = useGridApiRef();
    const [discoveryDetails] = useRecoilState(DiscoveryDetails);
    // const [paginationModel, setPaginationModel] = useRecoilState(defaultPaginationModel);
    const [tableControls, setTableControls] = useRecoilState(vegaTableControls);
    const cloudProviderAccountsTableUtilities = useTableUtilities('cloud-provider-accounts-table');

    const paginationModel = cloudProviderAccountsTableUtilities.currentTableControl?.paginationModel;
    const filterModel = cloudProviderAccountsTableUtilities.currentTableControl?.filterModel;

    const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>([]);

    // const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    //     items: [],
    // });
    useEffect(() => {
        switch (props.tableFilterByProvider) {
            case FilterTableByProvider.All:
                apiRef.current.deleteFilterItem({ field: 'provider_str', operator: 'equals', id: 'provider' });
                break;
            case FilterTableByProvider.Aws:
                apiRef.current.upsertFilterItem({ field: 'provider_str', operator: 'equals', value: 'aws', id: 'provider' });
                break;
            case FilterTableByProvider.Azure:
                apiRef.current.upsertFilterItem({ field: 'provider_str', operator: 'equals', value: 'azure', id: 'provider' });
                break;
            case FilterTableByProvider.Gcp:
                apiRef.current.upsertFilterItem({ field: 'provider_str', operator: 'equals', value: 'gcp', id: 'provider' });
                break;
        }
    }, [props.tableFilterByProvider]);

    const columns: GridColDef[] = [
        {
            field: 'account_id',
            headerName: 'Account ID',
            flex: 1,
        },
        {
            field: 'account_name',
            headerName: 'Account Name',
            flex: 1,
        },
        {
            field: 'provider_str',
            headerName: 'Provider',
            flex: 1,
            renderCell: (params: GridRenderCellParams<ICloudProviderAccount>) => <CloudProviderIcon cloudProvider={params.row?.provider_str} />,
        },
        {
            field: 'parent_account_id',
            headerName: 'Parent Account',
            flex: 1,
            // valueGetter: (params: GridValueGetterParams<ICloudProviderAccount>) => {
            //     switch (params.value) {
            //         case undefined:
            //             return 'Yes';
            //         case null:
            //             return 'Yes';
            //         default:
            //             return params.value;
            //     }
            // },
        },
        {
            field: 'enabled',
            headerName: 'Status',
            flex: 1,
            valueGetter: (params: GridValueGetterParams<ICloudProviderAccount>) => {
                switch (params.value) {
                    case true:
                        return 'Enabled';
                    case false:
                        return 'Disabled';
                    default:
                        return 'Unknown';
                }
            },
            renderCell: (params: GridRenderCellParams<ICloudProviderAccount>) => {
                switch (params.value) {
                    case 'Enabled':
                        return 'Enabled';
                    // return (
                    //     <Stack direction='row' justifyContent='space-around' alignItems='center' spacing={1}>
                    //         <Typography fontWeight={600} color={'success'} variant={'body2'}>
                    //             Enabled
                    //         </Typography>
                    //         <CheckCircle color={'success'} />
                    //     </Stack>
                    // );

                    case 'Disabled':
                        return (
                            <Stack direction='row' justifyContent='flex-start' alignItems='center' spacing={1}>
                                <Typography color={'error'} variant={'body2'}>
                                    Disabled
                                </Typography>
                                <Error color={'error'} />
                            </Stack>
                        );

                    default:
                        return 'Unknown';
                }
            },
        },
        {
            field: 'discovered_at',
            headerName: 'Last Discovered',
            flex: 1,
            valueFormatter: (params: GridValueFormatterParams) => {
                const account = props.cloudProviderAccounts.find((account) => account.id === params.id);
                switch (account?.discovered_status) {
                    case undefined:
                        return '';
                    case null:
                        return '';
                    case 0:
                        return 'In Progress';
                    default:
                        switch (params.value) {
                            case undefined:
                                return '';
                            case null:
                                return '';
                            default:
                                return Intl.DateTimeFormat('en-US', {
                                    month: '2-digit',
                                    day: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }).format(Date.parse(params.value));
                        }
                }
            },
            renderCell: (params: GridRenderCellParams<ICloudProviderAccount>) => {
                switch (params.row.discovered_status) {
                    case 0:
                        return params.row.discovered_at;
                    case 1:
                        return (
                            <StyledToolTip title={params.formattedValue}>
                                <Stack direction='row' justifyContent='flex-start' alignItems='center' spacing={1}>
                                    {params.formattedValue}
                                    <Check color={'success'} />
                                </Stack>
                            </StyledToolTip>
                        );
                    case 2:
                        return (
                            <StyledToolTip title={params.formattedValue}>
                                <Stack direction='row' justifyContent='flex-start' alignItems='center' spacing={1}>
                                    {params.formattedValue}
                                    <PriorityHigh color={'error'} />
                                </Stack>
                            </StyledToolTip>
                        );
                    default:
                        return '';
                }
            },
        },
        {
            field: 'discovery_message',
            headerName: 'Discovery Messages',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => {
                switch (params.value) {
                    case undefined:
                        return '';
                    case null:
                        return '';
                    default:
                        return params.value;
                }
            },
            renderCell: (params: GridRenderCellParams<ICloudProviderAccount>) => {
                if (params.row.discovered_message) {
                    return (
                        <StyledToolTip title={'Click to view messages'}>
                            <IconButton
                                disabled={props.selectedAccounts.length > 0}
                                onClick={() => {
                                    props.onClickShowDiscoveryErrorDetails(params.row);
                                }}
                            >
                                <Announcement />
                            </IconButton>
                        </StyledToolTip>
                    );
                } else {
                    return '';
                    // return (
                    //     <StyledToolTip title={'Click to view messages'}>
                    //         <IconButton
                    //             disabled={props.selectedAccounts.length > 0}
                    //             onClick={() => {
                    //                 props.onClickShowDiscoveryErrorDetails(params.row);
                    //             }}
                    //         >
                    //             <Announcement />
                    //         </IconButton>
                    //     </StyledToolTip>
                    // );
                }
            },
        },
        // {
        //     field: 'business_unit_id',
        //     headerName: 'Business Units',
        //     flex: 1,
        // },
        // {
        //     field: 'resources',
        //     headerName: 'Resources',
        //     flex: 1,
        // },
        // {
        //     field: 'expensesMtd',
        //     headerName: 'Expenses MTD',
        //     flex: 1,
        // },
        // {
        //     field: 'currentMonthForecast',
        //     headerName: 'Current Month Forecast',
        //     flex: 1.2,
        // },
        {
            field: 'actions',
            filterable: false,
            sortable: false,
            flex: 1,
            align: 'center',
            headerClassName: localStyles.cx(localStyles.classes.ActionsHeader),
            renderCell: (params: GridRenderCellParams<ICloudProviderAccount>) => (
                <Stack direction={'row'}>
                    <StyledToolTip
                        arrow
                        title={
                            discoveryDetails.is_discovery ? 'Running Discovery' : discoveryDetails.in_cooldown ? 'Discovery on Cooldown' : 'Refresh'
                        }
                    >
                        <Stack>
                            <IconButton
                                disabled={props.selectedAccounts.length > 0 || discoveryDetails.is_discovery || discoveryDetails.in_cooldown}
                                onClick={() => {
                                    return props.handleClickSendDiscoveryRequest([params.row.id]);
                                }}
                                size='small'
                                tabIndex={params.hasFocus ? 0 : -1}
                            >
                                <Refresh />
                            </IconButton>
                        </Stack>
                    </StyledToolTip>
                    <StyledToolTip arrow title={'Edit'}>
                        <IconButton
                            disabled={props.selectedAccounts.length > 0 || discoveryDetails.is_discovery}
                            onClick={() => props.onClickEditAccount(params.row)}
                            size='small'
                            tabIndex={params.hasFocus ? 0 : -1}
                        >
                            <Edit />
                        </IconButton>
                    </StyledToolTip>
                    {/*<StyledToolTip arrow title={'Delete'}>*/}
                    {/*    <IconButton*/}
                    {/*        disabled={props.selectedAccounts.length > 0}*/}
                    {/*        onClick={() => props.onOpenDeleteAccountDialog(params.row)}*/}
                    {/*        size='small'*/}
                    {/*        tabIndex={params.hasFocus ? 0 : -1}*/}
                    {/*    >*/}
                    {/*        <Delete />*/}
                    {/*    </IconButton>*/}
                    {/*</StyledToolTip>*/}
                </Stack>
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
        props.setSelectedAccounts(
            gridSelectionModel.map((id) => props.cloudProviderAccounts.find((account) => account.id === id) as ICloudProviderAccount)
        );
    };

    return (
        <Box>
            <DataGridPremium
                apiRef={apiRef}
                filterModel={cloudProviderAccountsTableUtilities.currentTableControl?.filterModel}
                onFilterModelChange={cloudProviderAccountsTableUtilities.onFilterModelChange}
                disableColumnMenu
                className={commonStyles.cx(commonStyles.classes.DataGrid)}
                autoHeight={true}
                pagination={true}
                pageSizeOptions={[5, 10, 15]}
                density={'standard'}
                columns={columns}
                rows={props.cloudProviderAccounts}
                onRowSelectionModelChange={(gridSelectionModel: GridRowSelectionModel) => onRowsSelectionHandler(gridSelectionModel)}
                rowSelectionModel={selectionModel}
                checkboxSelection={true}
                disableRowSelectionOnClick={true}
                slots={{
                    toolbar: DataGridCustomToolbar,
                }}
                slotProps={{
                    columnsPanel: {
                        getTogglableColumns,
                    },
                }}
                paginationModel={paginationModel}
                onPaginationModelChange={cloudProviderAccountsTableUtilities.onPaginationModelChange}
                sortModel={cloudProviderAccountsTableUtilities.currentTableControl?.sortModel}
                onSortModelChange={cloudProviderAccountsTableUtilities.onSortModelChange}
                loading={props.isLoading}
            />
        </Box>
    );
};

const useStyles = makeStyles<ICloudProviderAccountsTableProps>()((theme, props) => ({
    ActionsHeader: { fontSize: 0 },
}));

export { CloudProviderAccountsTable };
