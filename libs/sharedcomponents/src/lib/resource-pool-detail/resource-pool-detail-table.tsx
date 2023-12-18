import React from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import {
    DataGridPremium,
    GRID_AGGREGATION_FUNCTIONS,
    GridColDef,
    GridGroupNode,
    GridRenderCellParams,
    GridValueFormatterParams,
    GridValueGetterParams,
    useGridApiRef,
    useGridSelector,
} from '@mui/x-data-grid-premium';
import { gridFilteredDescendantCountLookupSelector, GridRowId, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import { Box, Button, IconButton, Stack } from '@mui/material';
import { AccountTree, AutoAwesome, AutoAwesomeMotion, Edit, FolderSharp, GroupWork, Inventory2, Storage } from '@mui/icons-material';
import { CloudProviderAggregator } from '../utilities/cloud-provider-aggregator';
import { CloudProviderIcons } from '../utilities/logo-selector';
import { ContainerType, IVegaContainer } from '@vegaplatformui/models';
import { ContainerTypeFormatter } from '../utilities/container-type-formatter';
import { DataGridCustomToolbar, FormatNumberUSDHundredth } from '@vegaplatformui/sharedcomponents';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IResourcePoolDetailTableProps {
    spaces: IVegaContainer[];
    onClickEdit: (space: IVegaContainer) => void;
    isLoading: boolean;
    onClickTableItem: (container: IVegaContainer[], containerType?: ContainerType) => void;
}

//ToDo pretty sure this can be a common table for all entities with some more logic added
const ResourcePoolDetailTable: React.FC<IResourcePoolDetailTableProps> = (props) => {
    const localStyles = useStyles(props);
    const commonHeaderStyles = useCommonStyles();
    const apiRef = useGridApiRef();
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 5,
        page: 0,
    });
    const expansionLookup = React.useRef<Record<GridRowId, boolean | undefined>>({});

    const GetDescendantCount = (params: GridValueFormatterParams) => {
        const rows = apiRef.current.getRowGroupChildren({ groupId: params.id! });
        return ContainerNameRender(params.id!, rows.length > 0);
    };

    const RenderDescendentCount = (props: GridRenderCellParams<IVegaContainer>) => {
        const { id, field, rowNode } = props;

        const filteredDescendantCountLookup = useGridSelector(apiRef, gridFilteredDescendantCountLookupSelector);
        const filteredDescendantCount = filteredDescendantCountLookup[rowNode.id] ?? 0;
        return filteredDescendantCount !== 0 ? filteredDescendantCount : '';
    };

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarFilterButton className={localStyles.cx(localStyles.classes.ToolBarFilter)} />
            </GridToolbarContainer>
        );
    }

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
                    disabled={!isEnabled && type !== ContainerType.Resource.toLowerCase()}
                    onClick={() => {
                        props.onClickTableItem(container, type);
                    }}
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
        },
        {
            field: 'container_type',
            headerName: 'Type',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => ContainerTypeFormatter(params.row?.container_type),
        },
        {
            field: 'provider',
            headerName: 'Providers With Resources',
            flex: 1,
            headerClassName: commonHeaderStyles.cx(commonHeaderStyles.classes.AggregatedHeader),
            valueFormatter: (params: GridValueFormatterParams) => {
                return params.value.join(',');
            },
            renderCell: (params: GridRenderCellParams) => {
                if (params.aggregation && params.row?.container_type !== ContainerType.Resource) {
                    return params.formattedValue;
                } else {
                    return <CloudProviderIcons cloudProviders={params.row?.provider} />;
                }
            },
        },
        /*        {
            field: 'cost',
            headerName: 'Cost',
            flex: 1,
            headerAlign: 'left',
            align: 'left',
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
        //     renderCell: (params: GridRenderCellParams<IVegaContainer>) => {
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
                    {/*{params.row.container_type === ContainerType.Workload && (*/}
                    {/*    <IconButton onClick={() => console.log('This is actions')} size='small' tabIndex={params.hasFocus ? 0 : -1}>*/}
                    {/*        <AutoAwesome />*/}
                    {/*    </IconButton>*/}
                    {/*)}*/}
                    {/*<IconButton onClick={() => console.log('This is resources')} size='small' tabIndex={params.hasFocus ? 0 : -1}>*/}
                    {/*    <Storage />*/}
                    {/*</IconButton>*/}
                    <IconButton onClick={() => props.onClickEdit(params.row)} size='small' tabIndex={params.hasFocus ? 0 : -1}>
                        <Edit />
                    </IconButton>
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
                className={localStyles.cx(localStyles.classes.DataGrid)}
                defaultGroupingExpansionDepth={1}
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
                    disableExport: true,
                    hideDescendantCount: true,
                    sortable: true,
                    flex: 2,
                    valueGetter: (params: GridValueGetterParams) => {
                        return params.row.name;
                    },
                    valueFormatter: (params: GridValueFormatterParams) => {
                        return GetDescendantCount(params);
                    },
                }}
                treeData
                getTreeDataPath={(row) => {
                    const [, , ...excludeRoot] = row.path.split('/');
                    return excludeRoot;
                }}
                disableColumnMenu
                autoHeight={true}
                pageSizeOptions={[5, 10, 15]}
                density={'standard'}
                columns={columns}
                rows={props.spaces}
                checkboxSelection={false}
                disableRowSelectionOnClick={true}
                slots={{
                    toolbar: DataGridCustomToolbar,
                }}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                loading={props.isLoading}
                isGroupExpandedByDefault={isGroupExpandedByDefault}
            />
        </Box>
    );
};

const useStyles = makeStyles<IResourcePoolDetailTableProps>()((theme, props) => ({
    ToolBar: {
        color: theme.palette.grey[100],
        '& .MuiFormControl-root': {
            minWidth: '100%',
        },
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
    ToolBarFilter: {
        color: theme.palette.grey[500],
        marginBottom: '1rem',
    },
    ActionsHeader: { fontSize: 0 },
    CloudProviderIcon: {
        width: '1.5rem',
    },
    ContainerButton: {
        textTransform: 'none',
    },
}));

export { ResourcePoolDetailTable };
