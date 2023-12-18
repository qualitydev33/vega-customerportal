import { Button, Card, Grid, Popper, Stack, TextField, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { Form, FormField } from '../../forms';
import { SubmitHandler } from 'react-hook-form';
import { PasswordStrengthIndicator } from './password-strength-indicator';
import { IUserSettingPassword } from '@vegaplatformui/models';
import { CancelButton } from '@vegaplatformui/utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPasswordSettingsProps {
    onUpdatePassword: (data: IUserSettingPassword) => void;
}

const PasswordSettings: React.FC<IPasswordSettingsProps> = (props) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [passwordToCheck, setPasswordToCheck] = useState('');

    const onSubmit: SubmitHandler<IUserSettingPassword> = (data) => {
        props.onUpdatePassword(data);
    };

    return (
        <div>
            <Form onSubmit={onSubmit}>
                {({ errors, register, formState, reset, watch }) => {
                    return (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Stack spacing={0.5}>
                                    <Typography variant='body1' fontWeight={600}>
                                        Password
                                    </Typography>
                                    <Typography variant='body2' color={theme.palette.grey[600]}>
                                        Update or reset your password.
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormField label='Current Password' htmlFor='currentPassword'>
                                    <TextField
                                        id='currentPassword'
                                        type='password'
                                        autoComplete='current-password'
                                        size='small'
                                        fullWidth={true}
                                        {...register('current_password', {
                                            required: {
                                                value: true,
                                                message: 'Required',
                                            },
                                        })}
                                        error={!!errors.current_password}
                                        helperText={errors.current_password?.message}
                                    />
                                </FormField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormField label='New Password' htmlFor='newPassword'>
                                    <TextField
                                        id='newPassword'
                                        type='password'
                                        autoComplete='new-password'
                                        size='small'
                                        fullWidth={true}
                                        onFocus={(e) => {
                                            setAnchorEl(e.currentTarget);
                                        }}
                                        {...register('new_password', {
                                            required: {
                                                value: true,
                                                message: 'Required',
                                            },
                                            onChange: (e) => setPasswordToCheck(e.currentTarget.value),
                                            onBlur: () => setAnchorEl(null),
                                        })}
                                        error={!!errors.new_password}
                                        helperText={errors.new_password?.message}
                                    />
                                </FormField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormField label='Confirm New Password' htmlFor='confirmPassword'>
                                    <TextField
                                        id='confirmPassword'
                                        type='password'
                                        autoComplete='confirm-password'
                                        size='small'
                                        fullWidth={true}
                                        {...register('confirm_password', {
                                            required: {
                                                value: true,
                                                message: 'Required',
                                            },
                                            validate: (value: string) => {
                                                const newPassword = watch('new_password');
                                                if (value !== newPassword) return 'Password mismatched';
                                            },
                                        })}
                                        error={!!errors.confirm_password}
                                        helperText={errors.confirm_password?.message}
                                    />
                                </FormField>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={2} direction={'row'} justifyContent={'flex-end'}>
                                    {/*<Button variant='text' type='button'>*/}
                                    {/*    Forgot Password?*/}
                                    {/*</Button>*/}
                                    <Stack spacing={1} direction={'row'} justifyContent={'end'}>
                                        <CancelButton
                                            onClick={() =>
                                                reset({
                                                    // TODO: Pass in initial values
                                                    new_password: '',
                                                    current_password: '',
                                                    confirm_password: '',
                                                })
                                            }
                                            disabled={!formState.isDirty}
                                            disableElevation
                                        >
                                            Cancel
                                        </CancelButton>
                                        <Button variant='contained' disabled={!formState.isDirty} type='submit' disableElevation>
                                            Save
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Grid>
                        </Grid>
                    );
                }}
            </Form>
            <Popper open={Boolean(anchorEl)} anchorEl={anchorEl}>
                <Card elevation={3}>
                    <PasswordStrengthIndicator password={passwordToCheck} />
                </Card>
            </Popper>
        </div>
    );
};

export { PasswordSettings };
