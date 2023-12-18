import React from 'react';
import { useCommonStyles, makeStyles } from '@vegaplatformui/styling';
import {
    DataGridPremium,
    GRID_AGGREGATION_FUNCTIONS,
    GridColDef,
    GridRenderCellParams,
    GridToolbar,
    GridToolbarExport,
    GridValueFormatterParams,
    GridValueGetterParams,
    useGridApiRef,
    useGridSelector,
    GridGroupNode,
    GridColumnHeaderParams,
} from '@mui/x-data-grid-premium';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { AccountTree, AutoAwesome, AutoAwesomeMotion, Edit, FolderSharp, GroupWork, Inventory2, Storage } from '@mui/icons-material';
import { CloudProviderAggregator } from '../../utilities/cloud-provider-aggregator';
import { CloudProviderIcons } from '../../utilities/logo-selector';
import { ContainerType, IVegaContainer } from '@vegaplatformui/models';
import { ContainerTypeFormatter } from '../../utilities/container-type-formatter';
import { DataGridCustomToolbar, FormatNumberUSDHundredth, StyledToolTip, VegaInfoIcon, vegaTableControls } from '@vegaplatformui/sharedcomponents';
import { useRecoilState } from 'recoil';
import { GridRowId, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISpacesTableProps {
    spaces: IVegaContainer[];
    isLoading: boolean;
    onClickEditSpace: (space: IVegaContainer) => void;
    onClickTableItem: (container: IVegaContainer[], containerType?: ContainerType) => void;
}

const SpacesTable: React.FC<ISpacesTableProps> = (props) => {
    const localStyles = useStyles(props);
    const commonHeaderStyles = useCommonStyles();
    const apiRef = useGridApiRef();
    const [tableControls, setTableControls] = useRecoilState(vegaTableControls);
    const paginationModel = tableControls.find((control) => control.key === 'spaces-table')?.value.paginationModel;
    const expansionLookup = React.useRef<Record<GridRowId, boolean | undefined>>({});

    const GetDescendantCount = (params: GridValueFormatterParams) => {
        const rows = apiRef.current.getRowGroupChildren({ groupId: params.id! });
        return ContainerNameRender(params.id!, rows.length > 0);
    };

    function ContainerNameRender(id: GridRowId, isEnabled: boolean) {
        const currentContainer = props.spaces.find((space) => space.id === id);
        const type = currentContainer?.container_type;
        const name = currentContainer?.name;
        let container: IVegaContainer[];
        switch (type) {
            case ContainerType.Space.toLowerCase():
                container = props.spaces.filter((space) => space.path?.split('/')[0] === name);
                break;
            case ContainerType.Workload.toLowerCase():
                container = props.spaces.filter((workload) => workload.path?.split('/')[1] === name);
                break;
            case ContainerType.ResourcePool.toLowerCase():
                container = props.spaces.filter((resourcepool) => resourcepool.path?.split('/')[2] === name);
                break;
        }
        return (
            <Stack spacing={0.5} direction={'row'} alignItems={'center'}>
                {type === ContainerType.Space.toLowerCase() ? (
                    <FolderSharp />
                ) : type === ContainerType.Workload.toLowerCase() ? (
                    <AutoAwesomeMotion />
                ) : type === ContainerType.ResourcePool.toLowerCase() ? (
                    <GroupWork />
                ) : type === ContainerType.Resource.toLowerCase() ? (
                    <Inventory2 />
                ) : (
                    ''
                )}
                <Button
                    onClick={() => {
                        return props.onClickTableItem(container, type);
                    }}
                    disabled={!isEnabled && type !== ContainerType.Resource.toLowerCase()}
                    variant={'text'}
                    className={localStyles.cx(localStyles.classes.ContainerButton)}
                >
                    {name}
                </Button>
            </Stack>
        );
    }

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            disableExport: false,
        },
        {
            field: 'container_type',
            headerName: 'Type',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => ContainerTypeFormatter(params.row?.container_type),
        },
        {
            field: 'provider',
            headerName: 'Providers',
            flex: 2,
            description: 'This container level has resources from the provider(s) listed',
            headerClassName: commonHeaderStyles.cx(commonHeaderStyles.classes.AggregatedHeader),
            valueFormatter: (params: GridValueFormatterParams) => {
                return params.value.join(',');
            },
            renderCell: (params: GridRenderCellParams) => {
                if (params.aggregation && params.row?.container_type !== ContainerType.Resource) {
                    return params.formattedValue;
                } else if (params.row?.container_type === ContainerType.Resource) {
                    return <CloudProviderIcons cloudProviders={params.row?.provider} />;
                } else if (params.row?.provider === '' || params.row?.provider === null || params.row?.provider === undefined) {
                    return '';
                } else {
                    return <CloudProviderIcons cloudProviders={params.row?.provider} />;
                }
            },
        },
        /* {
            field: 'cost',
            headerName: 'Cost',
            description: 'Total cost at each container level',
            flex: 1,
            headerAlign: 'left',
            align: 'left',
            headerClassName: commonHeaderStyles.cx(commonHeaderStyles.classes.AggregatedHeader),
            valueFormatter: (params: GridValueFormatterParams) => FormatNumberUSDHundredth(params.value),
        },*/
        {
            field: 'budget',
            headerName: 'Budget',
            flex: 1,
            filterable: false,
            valueFormatter: (params: GridValueFormatterParams) => FormatNumberUSDHundredth(params.value),
        },
        /*        {
            field: 'itemsExceededBudget',
            headerName: 'Items Exceeding Budget',
            flex: 1,
        },*/
        // {
        //     field: 'nested',
        //     headerName: 'Nested',
        //     flex: 1,
        //     renderCell: (params: GridRenderCellParams<VegaSpace>) => {
        //         return RenderDescendentCount(params);
        //     },
        // },
        {
            disableExport: true,
            field: 'actions',
            filterable: false,
            sortable: false,
            flex: 1,
            headerClassName: localStyles.cx(localStyles.classes.ActionsHeader),
            align: 'right',
            renderCell: (params: GridRenderCellParams<IVegaContainer>) => (
                <strong>
                    {/*{params.row.container_type === ContainerType.Workload.toLowerCase() && (*/}
                    {/*    <IconButton onClick={() => console.log('This is actions')} size='small' tabIndex={params.hasFocus ? 0 : -1}>*/}
                    {/*        <AutoAwesome />*/}
                    {/*    </IconButton>*/}
                    {/*)}*/}
                    {/*<IconButton onClick={() => console.log('This is resources')} size='small' tabIndex={params.hasFocus ? 0 : -1}>*/}
                    {/*    <Storage />*/}
                    {/*</IconButton>*/}
                    <StyledToolTip arrow title='Edit'>
                        <IconButton onClick={() => props.onClickEditSpace(params.row)} size='small' tabIndex={params.hasFocus ? 0 : -1}>
                            <Edit />
                        </IconButton>
                    </StyledToolTip>
                </strong>
            ),
        },
    ];

    React.useEffect(() => {
        apiRef.current.subscribeEvent('rowExpansionChange', (node) => {
            expansionLookup.current[node.id] = node.childrenExpanded;
        });
    }, [apiRef]);

    const isGroupExpandedByDefault = React.useCallback(
        (node: GridGroupNode) => {
            return !!expansionLookup.current[node.id];
        },
        [expansionLookup]
    );

    const hiddenFields = ['name', 'budget', 'actions'];

    const getTogglableColumns = (columns: GridColDef[]) => {
        return columns.filter((column) => !hiddenFields.includes(column.field)).map((column) => column.field);
    };

    return (
        <Box>
            <DataGridPremium
                className={commonHeaderStyles.cx(commonHeaderStyles.classes.DataGrid)}
                apiRef={apiRef}
                columnVisibilityModel={{
                    name: false,
                    budget: false,
                }}
                slotProps={{
                    columnsPanel: { getTogglableColumns },
                    toolbar: {
                        printOptions: { fields: ['name', 'container_type', 'provider', 'cost'] },
                        csvOptions: { fields: ['name', 'container_type', 'provider', 'cost'] },
                        excelOptions: { fields: ['name', 'container_type', 'provider', 'cost'] },
                    },
                }}
                groupingColDef={{
                    headerName: 'Name',
                    hideDescendantCount: true,
                    sortable: true,
                    disableExport: true,
                    flex: 2,
                    valueGetter: (params: GridValueGetterParams) => {
                        return params.row.name;
                    },
                    valueFormatter: (params: GridValueFormatterParams) => {
                        return GetDescendantCount(params);
                    },
                }}
                treeData
                getTreeDataPath={(row) => row.path.split('/')}
                disableColumnMenu
                autoHeight={true}
                pageSizeOptions={[5, 10, 15]}
                density={'standard'}
                columns={columns}
                rows={props.spaces}
                checkboxSelection={false}
                disableRowSelectionOnClick={true}
                slots={{ toolbar: DataGridCustomToolbar }}
                paginationModel={paginationModel}
                onPaginationModelChange={(p) => {
                    setTableControls((controls) => {
                        return controls.map((control) => {
                            if (control.key === 'spaces-table') {
                                control.value.paginationModel = p;
                            }
                            return control;
                        });
                    });
                }}
                loading={props.isLoading}
                isGroupExpandedByDefault={isGroupExpandedByDefault}
            />
        </Box>
    );
};

const useStyles = makeStyles<ISpacesTableProps>()((theme, props) => ({
    ToolBar: {
        color: theme.palette.grey[100],
        '& .MuiFormControl-root': {
            minWidth: '100%',
        },
    },
    ToolBarFilter: {
        color: theme.palette.primary.main,
        marginBottom: '1rem',
    },
    ActionsHeader: { fontSize: 0 },
    CloudProviderIcon: {
        width: '1.5rem',
    },
    ContainerButton: {
        textTransform: 'none',
    },
    DataGrid: {
        '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus': {
            outline: 'none',
        },
        '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus': {
            outline: 'none',
        },
        border: 'none',
    },
}));

export { SpacesTable };
