import { Dialog, DialogContent, DialogTitle, Grid, DialogActions, styled, Button, ButtonProps, TextField, Select, MenuItem, Checkbox, SelectChangeEvent } from '@mui/material';
import { grey } from '@mui/material/colors';
import { SubmitHandler } from 'react-hook-form';
import { Form, FormField } from '../../forms';
import { IUser } from '../users';
import { IUserSettingRealmRole } from '@vegaplatformui/models';
import { useEffect, useState } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export interface IRoleFormDialogProps {
    role?: IUserSettingRealmRole;
    users: IUser[];
    isOpen: boolean;
    onClose: () => void;
    onAdd: (role_name: string, members: string[]) => void;
    onUpdate: (role_name: string, new_role_name: string, previous_members: string[], members: string[]) => void;
}

const CancelButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(grey[500]),
    backgroundColor: grey[300],
    '&:hover': {
        backgroundColor: grey[500],
    },
}));

const RoleFormDialog: React.FC<IRoleFormDialogProps> = (props) => {
    const [activeUsers, setActiveUsers] = useState<string[]>([]);
    const onSubmit: SubmitHandler<any> = (data) => {
        if (props.role) {
            props.onUpdate(props.role.name, data.role, activeUsers, data.members);
        } else {
            props.onAdd(data.role, data.members);
        }
        
    };
    const handleUserSelect = (event: SelectChangeEvent<typeof activeUsers>) => {
        const {
            target: { value },
        } = event;
        setActiveUsers(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    useEffect(() => {
        if (props.isOpen) {
            const defaultRole = props.role ? props.role.name : 'undefined';
            const filteredUsers = props.users.filter((user: IUser) => user.realm_role.includes(defaultRole));
            const strArrayUsers = filteredUsers.map(user => user.email);
            setActiveUsers(strArrayUsers);
        } else {
            setActiveUsers([]);
        }
    }, [props.isOpen])

    return (
        <Dialog open={props.isOpen} onClose={props.onClose} fullWidth>
            <DialogTitle variant={'h6'} style={{ cursor: 'move' }} id='choose-cloud-provider-dialog'>
                {props.role ? 'Edit Role' : 'Add Role'}
            </DialogTitle>
            <Form onSubmit={onSubmit}>
                {({ errors, register, formState }) => {
                    return (
                        <>
                            <DialogContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <FormField label='Role' htmlFor='role'>
                                            <TextField
                                                id='role'
                                                size='small'
                                                fullWidth={true}
                                                {...register('role', { required: true })}
                                                error={!!errors.role}
                                                defaultValue={props.role?.name}
                                            />
                                        </FormField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormField label='Permissions' htmlFor='permissions'>
                                            <TextField
                                                id='permissions'
                                                size='small'
                                                fullWidth={true}
                                                {...register('permissions', { required: true })}
                                                error={!!errors.permissions}
                                            />
                                        </FormField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormField label='Members' htmlFor='members'>
                                            <Select
                                                id={'members'}
                                                labelId={'members'}
                                                size='small'
                                                multiple
                                                fullWidth={true}
                                                MenuProps={MenuProps}
                                                {...register('members', { required: true })}
                                                error={!!errors.role}
                                                // defaultValue={props.users.length ? props.users[0].id : ''}
                                                renderValue={(selected) => selected.join(', ')}
                                                value={activeUsers}
                                                onChange={handleUserSelect}
                                            >
                                                {props.users.map((option) => (
                                                    <MenuItem key={option.id} value={option.username}>
                                                        <Checkbox checked={activeUsers.includes(option.username)} />
                                                        {option.username}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormField>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <CancelButton variant={'contained'} color={'secondary'} autoFocus onClick={props.onClose}>
                                    Cancel
                                </CancelButton>
                                <Button variant={'contained'} type='submit' disabled={!formState.isDirty}>
                                    Save
                                </Button>
                            </DialogActions>
                        </>
                    );
                }}
            </Form>
        </Dialog>
    );
};

export { RoleFormDialog };
