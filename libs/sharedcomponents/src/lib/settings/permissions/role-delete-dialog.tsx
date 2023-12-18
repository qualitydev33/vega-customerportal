import { Dialog, DialogContent, DialogTitle, DialogActions, styled, Button, ButtonProps, Stack, Chip } from '@mui/material';
import { grey } from '@mui/material/colors';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import { GridColDef } from '@mui/x-data-grid-premium';
import { IUserSettingRealmRole } from '@vegaplatformui/models';
import { useRecoilState } from 'recoil';
import { vegaTableControls } from '@vegaplatformui/sharedcomponents';

export interface IRoleDeleteDialogProps {
    roles: IUserSettingRealmRole[];
    isOpen: boolean;
    onClose: () => void;
    onDeleteRoles: (roles: IUserSettingRealmRole[]) => void;
}

const CancelButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(grey[500]),
    backgroundColor: grey[300],
    '&:hover': {
        backgroundColor: grey[500],
    },
}));

const RoleDeleteDialog: React.FC<IRoleDeleteDialogProps> = (props) => {
    const onSubmit = () => {
        props.onDeleteRoles(props.roles);
    };

    const [tableControls, setTableControls] = useRecoilState(vegaTableControls);
    const paginationModel = tableControls.find((control) => control.key === 'role-delete-dialog-table')?.value.paginationModel;

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Role', flex: 1 },
        { field: 'members', headerName: 'Members', flex: 1 },
        { field: 'permissions', headerName: 'Permissions', flex: 1 },
    ];

    return (
        <Dialog open={props.isOpen} onClose={props.onClose} fullWidth>
            <DialogTitle variant={'h6'} style={{ cursor: 'move' }} id='choose-cloud-provider-dialog'>
                Remove Role{props.roles.length > 1 ? 's' : ''}
            </DialogTitle>
            <DialogContent>
                <DataGrid
                    disableColumnMenu
                    autoHeight={true}
                    pageSizeOptions={[5, 10, 15]}
                    density={'compact'}
                    columns={columns}
                    rows={props.roles}
                    paginationModel={paginationModel}
                    onPaginationModelChange={(p) => {
                        setTableControls((controls) => {
                            return controls.map((control) => {
                                if (control.key === 'role-delete-dialog-table') {
                                    control.value.paginationModel = p;
                                }
                                return control;
                            });
                        });
                    }}
                    loading={false}
                    disableRowSelectionOnClick={true}
                />
            </DialogContent>
            <DialogActions>
                <CancelButton variant={'contained'} color={'secondary'} autoFocus onClick={props.onClose}>
                    Cancel
                </CancelButton>
                <Button variant={'contained'} color='error' onClick={onSubmit} disabled={false}>
                    Remove Role{props.roles.length > 1 ? 's' : ''}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export { RoleDeleteDialog };
