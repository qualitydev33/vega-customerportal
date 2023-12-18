import React, { useEffect } from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { Box, Button, Stack, Typography, IconButton, Switch, FormControlLabel, Collapse, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import {
    DataGridPremium,
    GridColDef,
    GridRenderCellParams,
    GridToolbar,
    GridValueFormatterParams,
    GridPaginationModel,
} from '@mui/x-data-grid-premium';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { CloudProviderIcon } from '../utilities/logo-selector';
import { useNavigate } from 'react-router-dom';
import { IResource } from '@vegaplatformui/models';
import { FormatNumberUSDHundredth } from '../utilities/value-formatter-methods';
import { useRecoilState } from 'recoil';
import { AccountTree, CalendarToday, Description, FormatListBulleted, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { alpha, styled } from '@mui/material/styles';
import { pink, green } from '@mui/material/colors';
import { vegaTableControls } from '../recoil/atom';
import { useTableUtilities } from '../use-table-utilities/use-table-utilities';
import { DataGridCustomToolbar } from '../utilities/datagrid-custom-toolbar';
import { DataGridCellTooltip } from '../utilities/datagrid-cell-tooltip';
import { StyledToolTip } from '../utilities/styled-tooltip';
import { ParkingToggle } from '../parking/parking-toggle';
import { RecommendationsApi } from '@vegaplatformui/apis';
import { getDetailsFromAzureId } from '@vegaplatformui/utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IResourcePoolsTableProps {
    resources: IResource[];
    setSelectedResources: React.Dispatch<React.SetStateAction<IResource[]>>;
    selectedResources: IResource[];
    isLoading: boolean;
    activeFields?: string[];
    checkBoxSelection?: boolean;
    isServerPaginated: boolean;
    recommendationsApi: RecommendationsApi;
}

const ParkSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase': {
        color: pink[600],
    },
    '& .MuiSwitch-switchBase + .MuiSwitch-track': {
        backgroundColor: pink[600],
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: green[600],
        '&:hover': {
            backgroundColor: alpha(green[600], theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: green[600],
    },
}));

const ActionButtonTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} arrow classes={{ popper: className }} />)(
    ({ theme }) => ({
        [`& .${tooltipClasses.arrow}`]: {
            color: theme.palette.common.black,
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: theme.palette.common.black,
        },
    })
);

const ResourcesTable: React.FC<IResourcePoolsTableProps> = (props) => {
    const commonStyles = useCommonStyles();
    const navigate = useNavigate();
    const { classes, cx } = useStyles(props);
    const [tableControls, setTableControls] = useRecoilState(vegaTableControls);
    const paginationModel = tableControls.find((control) => control.key === 'resource-table')?.value.paginationModel;
    const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>([]);
    const [open, setOpen] = React.useState(false);
    const resourcesTableUtilities = useTableUtilities('resources-table');

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setOpen(!open);
    };

    function ResourceIdRender(resource: IResource) {
        return (
            <Stack spacing={0.5} direction={'row'} alignItems={'center'}>
                <StyledToolTip arrow title={resource.resource_id}>
                    <Button onClick={() => navigate(`/resource/${resource.id}`)} variant={'text'} className={cx(classes.ContainerButton)}>
                        {resource.provider_str === 'AZURE' ? getDetailsFromAzureId(resource.resource_id).name : resource.resource_id}
                    </Button>
                </StyledToolTip>
            </Stack>
        );
    }

    function ResouceParkingStatusRender(isParked: boolean) {
        return (
            <FormControlLabel
                control={<ParkSwitch disabled={props.selectedResources.length > 0} checked={isParked} />}
                label={isParked ? 'Running' : 'Stopped'}
                labelPlacement='end'
            />
        );
    }

    function ResourceCloudAccountRender(cloudAccountID: string) {
        if (cloudAccountID) return <Typography className={cx(classes.CloudProviderIcon)}> {cloudAccountID}</Typography>;
    }

    let columns: GridColDef[] = [
        {
            field: 'resource_id',
            headerName: 'Resource ID',
            flex: 2,
            renderCell: (params: GridRenderCellParams<IResource>) => ResourceIdRender(params.row),
        },
        // {
        //     field: 'is_parking_capable',
        //     headerName: 'Parking Status',
        //     flex: 1,
        //     renderCell: (params: GridRenderCellParams<IResource>) => ResouceParkingStatusRender(params.row?.is_parking_capable),
        // },
        {
            field: 'provider_str',
            headerName: 'Provider',
            flex: 0.7,
            renderCell: (params: GridRenderCellParams<IResource>) => <CloudProviderIcon cloudProvider={params.value} />,
        },
        {
            field: 'cloud_account_id',
            headerName: 'Cloud Account',
            flex: 1,
            renderCell: (params: GridRenderCellParams<IResource>) => ResourceCloudAccountRender(params.row.cloud_account_id),
        },
        {
            field: 'type_str',
            headerName: 'Resource Type',
            flex: 1,
        },
        /*        {
            field: 'cost',
            headerName: 'Cost/Mo',
            flex: 1,
            valueGetter: (params) => FormatNumberUSDHundredth(params.value),
        },*/
        {
            field: 'region',
            headerName: 'Region',
            flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 2,
            filterable: false,
            sortable: false,
            renderCell: (params: GridRenderCellParams<IResource>) => (
                <Stack direction={'row'} gap={1}>
                    {/*<ActionButtonTooltip title='Schedule'>*/}
                    {/*    <IconButton*/}
                    {/*        // disabled={selectedUsers.length > 1}*/}
                    {/*        // onClick={() => {*/}
                    {/*        //     setIsFormOpen(true);*/}
                    {/*        //     setUserToEdit(params.row);*/}
                    {/*        // }}*/}
                    {/*        size='small'*/}
                    {/*        // tabIndex={params.hasFocus ? 0 : -1}*/}
                    {/*    >*/}
                    {/*        <CalendarToday />*/}
                    {/*    </IconButton>*/}
                    {/*</ActionButtonTooltip>*/}

                    {/*<ActionButtonTooltip title='Recommendations'>*/}
                    {/*    <IconButton size='small' onClick={() => navigate(`/resource/${params.row?.id}`, { state: { tab: 'recommendations' } })}>*/}
                    {/*        <FormatListBulleted />*/}
                    {/*    </IconButton>*/}
                    {/*</ActionButtonTooltip>*/}

                    {/*<ActionButtonTooltip title='Reports'>*/}
                    {/*    <IconButton size='small' onClick={() => navigate(`/resource/${params.row?.id}`, { state: { tab: 'reports' } })}>*/}
                    {/*        <Description />*/}
                    {/*    </IconButton>*/}
                    {/*</ActionButtonTooltip>*/}

                    {/*<ActionButtonTooltip title='Family Accounts'>*/}
                    {/*    <IconButton size='small' onClick={() => navigate(`/resource/${params.row?.id}`, { state: { tab: 'containers' } })}>*/}
                    {/*        <AccountTree />*/}
                    {/*    </IconButton>*/}
                    {/*</ActionButtonTooltip>*/}

                    {/*                    <Button
                        className={commonStyles.cx(commonStyles.classes.GreyButton, commonStyles.classes.LowercaseTextButton)}
                        variant='contained'
                        onClick={() => navigate(`/resource/${params.row?.id}`)}
                    >
                        Details
                    </Button>*/}
                    {params.row.type_str === 'Virtual Machine' && (
                        <ParkingToggle resource={params.row} isLoading={props.isLoading} recommendationsApi={props.recommendationsApi} />
                    )}
                </Stack>
            ),
        },
    ];
    columns = props.activeFields ? columns.filter((column) => props.activeFields?.includes(column.field)) : columns;
    columns.map((column) => {
        if (!column.renderCell) column.renderCell = DataGridCellTooltip;
        return column;
    });

    const getTogglableColumns = (columns: GridColDef[]) => {
        return columns.filter((column) => column.field !== 'actions').map((column) => column.field);
    };

    const onRowsSelectionHandler = (gridSelectionModel: GridRowSelectionModel) => {
        setSelectionModel(gridSelectionModel);
        props.setSelectedResources(gridSelectionModel.map((id) => props.resources.find((resource) => resource.id === id) as IResource));
    };

    useEffect(() => {
        const selectedResourceIDs = props.selectedResources.map((x) => x.id);
        setSelectionModel(selectedResourceIDs);
    }, [props.selectedResources]);

    return (
        <Box>
            <DataGridPremium
                className={commonStyles.cx(commonStyles.classes.DataGrid)}
                disableColumnMenu
                autoHeight={true}
                pageSizeOptions={[5, 10, 15]}
                density={'standard'}
                columns={columns}
                rowCount={props.isServerPaginated ? resourcesTableUtilities.currentTableControl?.totalRows ?? 0 : undefined}
                paginationMode={props.isServerPaginated ? 'server' : 'client'}
                checkboxSelection={true}
                rows={props.resources}
                onRowSelectionModelChange={(gridSelectionModel: GridRowSelectionModel) => onRowsSelectionHandler(gridSelectionModel)}
                rowSelectionModel={selectionModel}
                disableRowSelectionOnClick={true}
                slots={{
                    toolbar: DataGridCustomToolbar,
                }}
                slotProps={{
                    columnsPanel: {
                        getTogglableColumns,
                    },
                }}
                filterMode={'server'}
                sortingMode={'server'}
                paginationModel={resourcesTableUtilities.currentTableControl?.paginationModel}
                onPaginationModelChange={resourcesTableUtilities.onPaginationModelChange}
                loading={props.isLoading}
                onSortModelChange={resourcesTableUtilities.onSortModelChange}
                onFilterModelChange={resourcesTableUtilities.onFilterModelChange}
                pagination
            />
        </Box>
    );
};

const useStyles = makeStyles<IResourcePoolsTableProps>()((theme, props) => ({
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
        marginLeft: theme.spacing(1),
    },
    ContainerButton: {
        textTransform: 'none',
    },
}));

export { ResourcesTable };
