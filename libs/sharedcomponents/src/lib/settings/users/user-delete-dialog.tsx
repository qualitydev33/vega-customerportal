import { Dialog, DialogContent, DialogTitle, DialogActions, styled, Button, ButtonProps } from '@mui/material';
import { IUser } from './users-settings';
import { grey } from '@mui/material/colors';
import { SubmitHandler } from 'react-hook-form';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import React from 'react';
import { useRecoilState } from 'recoil';
import { vegaTableControls } from '@vegaplatformui/sharedcomponents';

export interface IUserDeleteDialogProps {
    users: IUser[];
    isOpen: boolean;
    onClose: () => void;
    onDelete: (data: IUser[]) => void;
}

const CancelButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(grey[500]),
    backgroundColor: grey[300],
    '&:hover': {
        backgroundColor: grey[500],
    },
}));

const UserDeleteDialog: React.FC<IUserDeleteDialogProps> = (props) => {
    const onSubmit: SubmitHandler<IUser[]> = (data: IUser[]) => {
        props.onDelete(data);
    };
    const [tableControls, setTableControls] = useRecoilState(vegaTableControls);
    const paginationModel = tableControls.find((control) => control.key === 'user-delete-dialog-table')?.value.paginationModel;

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'User',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => `${params.row.first_name} ${params.row.last_name}`,
        },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'realm_role', headerName: 'Role', flex: 1 },
    ];

    return (
        <Dialog open={props.isOpen} onClose={props.onClose} fullWidth>
            <DialogTitle variant={'h6'} style={{ cursor: 'move' }} id='choose-cloud-provider-dialog'>
                Remove User{props.users.length > 1 ? 's' : ''}
            </DialogTitle>
            <DialogContent>
                <DataGrid
                    disableColumnMenu
                    autoHeight={true}
                    pageSizeOptions={[5, 10, 15]}
                    density={'compact'}
                    columns={columns}
                    rows={props.users}
                    paginationModel={paginationModel}
                    onPaginationModelChange={(p) => {
                        setTableControls((controls) => {
                            return controls.map((control) => {
                                if (control.key === 'user-delete-dialog-table') {
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
                <Button variant={'contained'} color='error' onClick={() => onSubmit(props.users)} disabled={false}>
                    Remove User{props.users.length > 1 ? 's' : ''}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export { UserDeleteDialog };
