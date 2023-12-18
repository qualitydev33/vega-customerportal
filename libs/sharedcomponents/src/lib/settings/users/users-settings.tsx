import { Box, Button, Chip, Grid, Icon, IconButton, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { Add, Delete, DeleteSweep, Edit } from '@mui/icons-material';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { GridRowSelectionModel, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import { DataGridPremium, GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid-premium';
import React, { useState } from 'react';
import { UserFormDialog } from './user-form-dialog';
import { UserDeleteDialog } from './user-delete-dialog';
import { IUserSettingRealmRole } from '@vegaplatformui/models';
import { useRecoilState } from 'recoil';
import { vegaTableControls } from '../../recoil/atom';
import { DataGridCustomToolbar } from '../../utilities/datagrid-custom-toolbar';
import { useKeycloak } from '@react-keycloak-fork/web';
import { grey } from '@mui/material/colors';
import { DataGridCellTooltip } from '../../utilities/datagrid-cell-tooltip';
import { LoadingButton } from '@mui/lab';
import { StyledToolTip } from '../../utilities/styled-tooltip';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUsersSettingsProps {
    users: IUser[];
    roles: IUserSettingRealmRole[];
    isLoading: boolean;
    onUpdateUser: (data: IUser) => void;
    onDeleteUsers: (data: IUser[]) => void;
    onInviteUser: (data: IUser) => void;
    isCreatingUser: boolean;
}

export interface IUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    realm: string;
    dateAdded: string;
    realm_role: string[];
    status: boolean;
}

const UsersSettings: React.FC<IUsersSettingsProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();
    const theme = useTheme();
    const [tableControls, setTableControls] = useRecoilState(vegaTableControls);
    const paginationModel = tableControls.find((control) => control.key === 'user-settings-table')?.value.paginationModel;
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
    const { keycloak } = useKeycloak();

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'User',
            flex: 2,
            valueGetter: (params: GridValueGetterParams) => {
                return `${params.row.first_name} ${params.row.last_name}`;
            },
        },
        { field: 'email', headerName: 'Email', flex: 2 },
        { field: 'dateAdded', headerName: 'Date Added', flex: 2 },
        {
            field: 'realm_role',
            headerName: 'Role',
            flex: 4,
            valueGetter: (params: GridValueGetterParams) => params.value.join(', '),
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <span>
                    <Chip color={`${params.row.status ? 'success' : 'warning'}`} label={`${params.row.status ? 'Active' : 'Invited'}`} />
                </span>
            ),
        },
        {
            field: 'actions',
            filterable: false,
            sortable: false,
            flex: 1,
            align: 'center',
            headerName: '',
            headerClassName: cx(classes.ActionsHeader),
            renderCell: (params: GridRenderCellParams<IUser>) => (
                <strong>
                    <StyledToolTip arrow title='Edit'>
                        <IconButton
                            disabled={selectedUsers.length > 1}
                            onClick={() => {
                                setIsFormOpen(true);
                                setUserToEdit(params.row);
                            }}
                            size='small'
                            tabIndex={params.hasFocus ? 0 : -1}
                        >
                            <Edit />
                        </IconButton>
                    </StyledToolTip>
                    <StyledToolTip arrow title='Delete'>
                        <IconButton
                            disabled={selectedUsers.length > 1 || params.row.email === (keycloak.tokenParsed && keycloak.tokenParsed.email)}
                            onClick={() => {
                                setIsDeleteOpen(true);
                                setUsersToDelete([params.row]);
                            }}
                            size='small'
                            tabIndex={params.hasFocus ? 0 : -1}
                        >
                            <Delete />
                        </IconButton>
                    </StyledToolTip>
                </strong>
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

    const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>([]);
    const onRowsSelectionHandler = (gridSelectionModel: GridRowSelectionModel) => {
        setSelectionModel(gridSelectionModel);
        setSelectedUsers(gridSelectionModel.map((id) => props.users.find((user) => user.id === id) as IUser));
    };

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<IUser>();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [usersToDelete, setUsersToDelete] = useState<IUser[]>([]);

    const closeUserFormDialog = () => {
        setIsFormOpen(false);
        setUserToEdit(undefined);
    };
    const closeDeleteDialog = () => {
        setIsDeleteOpen(false);
        setUsersToDelete([]);
    };
    const inviteUser = (data: IUser) => {
        closeUserFormDialog();
        props.onInviteUser(data);
    };
    const updateUser = (data: IUser) => {
        closeUserFormDialog();
        props.onUpdateUser(data);
    };
    const deleteUsers = (data: IUser[]) => {
        closeDeleteDialog();
        props.onDeleteUsers(data);
    };

    return (
        <>
            <Grid container direction='column'>
                <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                    <Grid xs={6} item>
                        <Stack spacing={0.5} marginBottom={1}>
                            <Typography variant='body1' fontWeight={600}>
                                Users
                            </Typography>
                            <Typography variant='body2' color={theme.palette.grey[600]}>
                                Invite and manage users.
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={6} item container justifyContent={'flex-end'}>
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                            {selectedUsers.length > 1 && (
                                <Button
                                    startIcon={<Delete />}
                                    className={commonStyles.cx(commonStyles.classes.MultipleDeleteButton)}
                                    variant={'contained'}
                                    onClick={() => {
                                        setUsersToDelete(selectedUsers);
                                        setIsDeleteOpen(true);
                                    }}
                                >
                                    Delete Selected Users
                                </Button>
                            )}
                            <LoadingButton
                                loading={props.isCreatingUser}
                                loadingPosition={'start'}
                                variant={'contained'}
                                startIcon={props.isCreatingUser ? <Icon></Icon> : <></>}
                                onClick={() => setIsFormOpen(true)}
                            >
                                Invite User
                            </LoadingButton>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
            <Box>
                <DataGridPremium
                    isRowSelectable={(params: GridRowParams<IUser>) => params.row.email !== (keycloak.tokenParsed && keycloak.tokenParsed.email)}
                    loading={props.isLoading}
                    className={commonStyles.cx(commonStyles.classes.DataGrid)}
                    disableColumnMenu
                    autoHeight={true}
                    density={'standard'}
                    columns={columns}
                    rows={props.users}
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
                    pagination
                    pageSizeOptions={[5, 10, 15]}
                    paginationModel={paginationModel}
                    onPaginationModelChange={(p) => {
                        setTableControls((controls) => {
                            return controls.map((control) => {
                                if (control.key === 'user-settings-table') {
                                    control.value.paginationModel = p;
                                }
                                return control;
                            });
                        });
                    }}
                    onRowSelectionModelChange={(gridSelectionModel: GridRowSelectionModel) => onRowsSelectionHandler(gridSelectionModel)}
                />
            </Box>

            {/* Dialogs */}
            <UserFormDialog
                isOpen={isFormOpen}
                user={userToEdit}
                users={props.users}
                roles={props.roles}
                onClose={closeUserFormDialog}
                onUpdate={updateUser}
                onInvite={inviteUser}
            />
            <UserDeleteDialog isOpen={isDeleteOpen} users={usersToDelete} onClose={closeDeleteDialog} onDelete={deleteUsers} />
        </>
    );
};

const useStyles = makeStyles<IUsersSettingsProps>()((theme, props) => ({
    ToolBar: {
        color: theme.palette.grey[100],
        '& .MuiFormControl-root': {
            minWidth: '100%',
        },
    },
    ToolBarFilter: {
        color: theme.palette.grey[500],
        marginBottom: '1rem',
    },
    ActionsHeader: { fontSize: 0 },
}));

export { UsersSettings };
