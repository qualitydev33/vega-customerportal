import { DeleteSweep, Edit } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import React, { useState } from 'react';
import { RoleFormDialog } from './role-form-dialog';
import { RoleDeleteDialog } from './role-delete-dialog';
import { IUser } from '../users';
import { IUserSettingRealmRole } from '@vegaplatformui/models';
import { ExpandMore } from '@mui/icons-material';
import {
    DataGridPremium,
    GridColDef,
    GridRenderCellParams,
    GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
    useGridApiContext,
    useGridSelector,
    gridDetailPanelExpandedRowsContentCacheSelector,
    GridRowParams,
    GridRowSelectionModel,
    GridValueGetterParams,
} from '@mui/x-data-grid-premium';
import { DataGridCustomToolbar } from '../../utilities/datagrid-custom-toolbar';
import { DataGridCellTooltip } from '../../utilities/datagrid-cell-tooltip';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPermissionsSettingsProps {
    isLoading: boolean;
    roles: IUserSettingRealmRole[];
    users: IUser[];
    onAdd: (role_name: string, members: string[]) => void;
    onUpdate: (role_name: string, new_role_name: string, previous_members: string[], members: string[]) => void;
    onDeleteRoles: (roles: IUserSettingRealmRole[]) => void;
}

const PermissionsSettings: React.FC<IPermissionsSettingsProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();
    const theme = useTheme();
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 10,
        page: 0,
    });

    const [selectedRoles, setSelectedRoles] = useState<IUserSettingRealmRole[]>([]);

    const filteredUsersByRole = React.useCallback(
        (role: string) => {
            return (
                props.users.filter((user: IUser) => {
                    return user.realm_role && user.realm_role.includes(role);
                }) ?? []
            );
        },
        [props.users]
    );

    const getDetailPanelHeight = React.useCallback(() => 'auto', []);
    const getDetailPanelContent = React.useCallback(
        (role: string) => {
            const filteredUsers = filteredUsersByRole(role);
            return (
                <Stack sx={{ padding: '2rem' }}>
                    <Typography variant='body1' fontWeight={600}>
                        Members with role
                    </Typography>
                    <DataGridPremium
                        className={commonStyles.cx(commonStyles.classes.DataGrid)}
                        disableColumnMenu
                        autoHeight={true}
                        density={'standard'}
                        columns={detailColumns}
                        rows={filteredUsers}
                        loading={false}
                    />
                </Stack>
            );
        },
        [filteredUsersByRole]
    );

    function CustomDetailPanelToggle(props: Pick<GridRenderCellParams, 'row' | 'id' | 'value'>) {
        const { row, id, value: isExpanded } = props;
        const apiRef = useGridApiContext();
        const contentCache = useGridSelector(apiRef, gridDetailPanelExpandedRowsContentCacheSelector);
        const hasDetail = React.isValidElement(contentCache[id]);
        return (
            <IconButton
                size='small'
                tabIndex={-1}
                disabled={!hasDetail || filteredUsersByRole(row.name).length < 1}
                aria-label={isExpanded ? 'Close' : 'Open'}
            >
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

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Role', flex: 1 },
        { field: 'description', headerName: 'Description', flex: 3 },
        {
            field: 'permissions',
            headerName: 'Permissions',
            flex: 4,
            valueGetter: (params: GridValueGetterParams) => params.row.permissions.join(', '),
        },
        {
            field: 'members',
            headerName: 'Members with this role',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => filteredUsersByRole(params.row.name).length,
        },
        {
            ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
            renderCell: (params: GridRenderCellParams<IUserSettingRealmRole>) => {
                const row = params.row;
                return <CustomDetailPanelToggle row={row} id={params.id} value={params.value} />;
            },
        },
        // {
        //     field: 'actions',
        //     filterable: false,
        //     sortable: false,
        //     flex: 1,
        //     align: 'center',
        //     headerName: '',
        //     headerClassName: cx(classes.ActionsHeader),
        //     renderCell: (params: GridRenderCellParams) => (
        //         <strong>
        //             <IconButton
        //                 disabled={selectedRoles.length > 1}
        //                 onClick={() => {
        //                     setIsFormOpen(true);
        //                     setRoleToEdit(params.row);
        //                 }}
        //                 size='small'
        //                 tabIndex={params.hasFocus ? 0 : -1}
        //             >
        //                 <Edit />
        //             </IconButton>
        //         </strong>
        //     ),
        // },
    ];
    columns.map((column) => {
        if (!column.renderCell) column.renderCell = DataGridCellTooltip;
        return column;
    });
    const detailColumns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => `${params.row.first_name} ${params.row.last_name}`,
        },
        { field: 'email', headerName: 'Email Address', flex: 1 },
        { field: 'dateAdded', headerName: 'Date Assigned', flex: 1 },
    ];
    detailColumns.map((column) => {
        if (!column.renderCell) column.renderCell = DataGridCellTooltip;
        return column;
    });

    const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>([]);
    const onRowsSelectionHandler = (gridSelectionModel: GridRowSelectionModel) => {
        setSelectionModel(gridSelectionModel);
        setSelectedRoles(gridSelectionModel.map((id: any) => props.roles.find((role) => role.id === id) as IUserSettingRealmRole));
    };

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [roleToEdit, setRoleToEdit] = useState<IUserSettingRealmRole>();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [rolesToDelete, setRolesToDelete] = useState<IUserSettingRealmRole[]>([]);

    const getTogglableColumns = (columns: GridColDef[]) => {
        return columns.filter((column) => column.field !== '__detail_panel_toggle__').map((column) => column.field);
    };

    const closeRoleFormDialog = () => {
        setIsFormOpen(false);
        setRoleToEdit(undefined);
    };
    const closeRoleDeleteDialog = () => {
        setIsDeleteOpen(false);
        setRolesToDelete([]);
    };
    const addRole = (role_name: string, members: string[]) => {
        closeRoleFormDialog();
        props.onAdd(role_name, members);
    };
    const updateRole = (role_name: string, new_role_name: string, previous_members: string[], members: string[]) => {
        closeRoleFormDialog();
        props.onUpdate(role_name, new_role_name, previous_members, members);
    };
    const deleteRoles = (data: IUserSettingRealmRole[]) => {
        closeRoleDeleteDialog();
        props.onDeleteRoles(data);
    };

    return (
        <>
            <Grid container direction='column'>
                <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                    <Grid xs={6} item>
                        <Stack spacing={0.5} marginBottom={1}>
                            <Typography variant='body1' fontWeight={600}>
                                Roles & Permissions
                            </Typography>
                            <Typography variant='body2' color={theme.palette.grey[600]}>
                                Manage user roles and permissions.
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={6} item container justifyContent={'flex-end'}>
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                            {/*{selectedRoles.length > 0 && (*/}
                            {/*    <Button*/}
                            {/*        startIcon={<DeleteSweep />}*/}
                            {/*        variant={'contained'}*/}
                            {/*        color='error'*/}
                            {/*        onClick={() => {*/}
                            {/*            setRolesToDelete(selectedRoles);*/}
                            {/*            setIsDeleteOpen(true);*/}
                            {/*        }}*/}
                            {/*    >*/}
                            {/*        Remove*/}
                            {/*    </Button>*/}
                            {/*)}*/}
                            {/*<Button variant={'contained'} onClick={() => setIsFormOpen(true)}>*/}
                            {/*    Add Role*/}
                            {/*</Button>*/}
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>

            <Box>
                <DataGridPremium
                    loading={props.isLoading}
                    className={commonStyles.cx(commonStyles.classes.DataGrid)}
                    disableColumnMenu
                    autoHeight={true}
                    density={'standard'}
                    columns={columns}
                    rows={props.roles}
                    rowSelectionModel={selectionModel}
                    //This renders the checkboxes
                    checkboxSelection={false}
                    disableRowSelectionOnClick={true}
                    slots={{
                        toolbar: DataGridCustomToolbar,
                    }}
                    slotProps={{
                        columnsPanel: {
                            getTogglableColumns,
                        },
                    }}
                    getDetailPanelContent={(params: GridRowParams) => getDetailPanelContent(params.row.name)}
                    getDetailPanelHeight={getDetailPanelHeight}
                    pagination={true}
                    paginationModel={paginationModel}
                    pageSizeOptions={[5, 10, 15]}
                    onPaginationModelChange={setPaginationModel}
                    onRowSelectionModelChange={(gridSelectionModel) => onRowsSelectionHandler(gridSelectionModel)}
                />
            </Box>

            {/* Dialogs */}
            <RoleFormDialog
                isOpen={isFormOpen}
                onClose={closeRoleFormDialog}
                role={roleToEdit}
                users={props.users}
                onAdd={addRole}
                onUpdate={updateRole}
            />
            <RoleDeleteDialog isOpen={isDeleteOpen} onClose={closeRoleDeleteDialog} roles={rolesToDelete} onDeleteRoles={deleteRoles} />
        </>
    );
};

const useStyles = makeStyles<IPermissionsSettingsProps>()((theme, props) => ({
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
}));
export { PermissionsSettings };
