import {
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    DialogActions,
    styled,
    Button,
    ButtonProps,
    TextField,
    Select,
    MenuItem,
    Checkbox,
    SelectChangeEvent,
    FormHelperText,
    Tooltip,
    Stack,
    Typography,
} from '@mui/material';
import { IUser } from './users-settings';
import { grey } from '@mui/material/colors';
import { SubmitHandler } from 'react-hook-form';
import { Form, FormField } from '../../forms';
import { IUserSettingRealmRole } from '@vegaplatformui/models';
import { useEffect, useState } from 'react';
import { fieldToStr, regexList } from '@vegaplatformui/utils';
import { StyledToolTip } from '@vegaplatformui/sharedcomponents';

const userFormFields = ['first_name', 'last_name', 'email'] as const;
type UserFormFieldUnion = (typeof userFormFields)[number];

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
const regex = {
    ...regexList,
    first_name: regexList.alphabetic,
    last_name: regexList.alphabetic,
};

export interface IUserFormDialogProps {
    user?: IUser;
    users: IUser[];
    roles: IUserSettingRealmRole[];
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (data: IUser) => void;
    onInvite: (data: IUser) => void;
}

const CancelButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(grey[500]),
    backgroundColor: grey[300],
    '&:hover': {
        backgroundColor: grey[500],
    },
}));

const UserFormDialog: React.FC<IUserFormDialogProps> = (props) => {
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const onSubmit: SubmitHandler<IUser> = (data: IUser) => {
        data.realm_role = selectedRoles;
        if (props.user) {
            data.username = props.user.username;
            props.onUpdate(data);
        } else {
            props.onInvite(data);
        }
    };
    const handleRoleSelect = (event: SelectChangeEvent<typeof selectedRoles>) => {
        const {
            target: { value },
        } = event;
        setSelectedRoles(typeof value === 'string' ? value.split(',') : value);
    };

    useEffect(() => {
        if (props.isOpen) {
            const defaultRoles = props.user && props.user.realm_role ? props.user.realm_role : [];
            setSelectedRoles(defaultRoles);
        } else {
            setSelectedRoles([]);
        }
    }, [props.isOpen]);

    return (
        <Dialog open={props.isOpen} onClose={props.onClose} fullWidth>
            <DialogTitle variant={'h6'} style={{ cursor: 'move' }} id='choose-cloud-provider-dialog'>
                {props.user ? 'Edit User' : 'Invite User'}
            </DialogTitle>
            <Form onSubmit={onSubmit}>
                {({ errors, register, watch }) => {
                    return (
                        <>
                            <DialogContent>
                                <Grid container spacing={2}>
                                    {userFormFields.map((field: UserFormFieldUnion) => (
                                        <Grid item xs={12} sm={6} key={`${field}`}>
                                            <FormField label={fieldToStr(field)} htmlFor={field}>
                                                <TextField
                                                    id={field}
                                                    size='small'
                                                    fullWidth={true}
                                                    {...register(field, {
                                                        required: {
                                                            value: true,
                                                            message: 'Required',
                                                        },
                                                        validate: (value: string) => {
                                                            if (!String(value).match(regex[field])) {
                                                                if (field === 'first_name' || field === 'last_name') {
                                                                    return 'Required to be alphabetic.';
                                                                }
                                                                if (field === 'email') {
                                                                    return 'Invalid emaill address.';
                                                                }
                                                            }
                                                            if (field === 'email' && !props.user) {
                                                                const filtered = props.users.filter(x => x.email === value);
                                                                if (filtered.length > 0) {
                                                                    return 'That email address is already taken.'
                                                                }
                                                            }
                                                        },
                                                    })}
                                                    error={!!errors[field]}
                                                    defaultValue={props.user ? props.user[field] : ''}
                                                    helperText={errors[field]?.message}
                                                />
                                            </FormField>
                                        </Grid>
                                    ))}
                                    <Grid item xs={12} sm={6}>
                                        <FormField label='Role' htmlFor='realm_role'>
                                            <Select
                                                id={'realm_role'}
                                                labelId={'realm_role'}
                                                size='small'
                                                multiple
                                                fullWidth={true}
                                                {...register('realm_role')}
                                                error={!!errors.realm_role}
                                                MenuProps={MenuProps}
                                                value={selectedRoles}
                                                renderValue={(selected) => selected.join(', ')}
                                                onChange={handleRoleSelect}
                                            >
                                                {props.roles.map((option) => (
                                                    <MenuItem key={option.name} value={option.name}>
                                                        <StyledToolTip arrow title={option.description}>
                                                            <Stack
                                                                spacing={0.5}
                                                                direction={'row'}
                                                                alignItems={'center'}
                                                                justifyContent={'flex-start'}
                                                            >
                                                                <Checkbox checked={selectedRoles.includes(option.name)} />
                                                                <Typography>{option.name}</Typography>
                                                            </Stack>
                                                        </StyledToolTip>
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
                                <Button variant={'contained'} type='submit' disabled={false}>
                                    {props.user ? 'Save Changes' : 'Send Invite'}
                                </Button>
                            </DialogActions>
                        </>
                    );
                }}
            </Form>
        </Dialog>
    );
};

export { UserFormDialog };
