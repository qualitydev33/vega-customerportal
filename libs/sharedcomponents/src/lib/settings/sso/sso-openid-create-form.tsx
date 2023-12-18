import React from 'react';

import { Form, FormField } from '@vegaplatformui/sharedcomponents';
import { FieldErrors, SubmitHandler } from 'react-hook-form';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { Info } from '@mui/icons-material';
import { Button, Grid, Stack, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import { IUserSettingSSO, IUserSettingSSOOpenID, SSOTypeEnum } from '@vegaplatformui/models';
import { regexList } from '@vegaplatformui/utils';

interface SSOOpenIDCreateFormProps {
    onCreate: (data: IUserSettingSSO, type: SSOTypeEnum, byXml: boolean) => void;
    onBack: () => void;
}

const SSOOpenIDCreateForm: React.FC<SSOOpenIDCreateFormProps> = (props) => {
    const theme = useTheme();
    const { cx, classes } = useStyles();
    const commonStyles = useCommonStyles();

    const onConfigurationSubmit: SubmitHandler<IUserSettingSSO> = (data) => {
        props.onCreate(data, SSOTypeEnum.OPENID, false);
    };

    return (
        <Form onSubmit={onConfigurationSubmit}>
            {({ errors, register, formState, reset }) => {
                const fieldErrors = errors as FieldErrors<IUserSettingSSOOpenID>;
                return (
                    <>
                        <Typography variant='body1' fontWeight={600}>
                            OpenID
                        </Typography>
                        <Typography variant='body2' color={theme.palette.grey[600]} marginBottom={3}>
                            Fill out the input to configure your SSO for OpenID.
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <FormField labelOrientation='horizontal' label='Display Name *' htmlFor='display_name'>
                                    <Tooltip title='Friendly name for Identity Providers.'>
                                        <Info className={cx(classes.InfoIcon)} />
                                    </Tooltip>
                                </FormField>
                                <TextField
                                    id='display_name'
                                    size='small'
                                    fullWidth={true}
                                    {...register('display_name', {
                                        required: {
                                            value: true,
                                            message: 'Required',
                                        },
                                    })}
                                    error={!!fieldErrors.display_name}
                                    helperText={fieldErrors.display_name?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormField label='Authorization URL *' htmlFor='authorization_url'>
                                    <TextField
                                        id='authorization_url'
                                        size='small'
                                        fullWidth={true}
                                        {...register('config.authorization_url', {
                                            required: {
                                                value: true,
                                                message: 'Required',
                                            },
                                            validate: (value: string) => {
                                                if (!value.match(regexList.url)) {
                                                    return 'Invalid URL';
                                                }
                                            },
                                        })}
                                        error={!!fieldErrors.config?.authorization_url}
                                        helperText={fieldErrors.config?.authorization_url?.message}
                                    />
                                </FormField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormField label='Token URL *' htmlFor='token_url'>
                                    <TextField
                                        id='token_url'
                                        size='small'
                                        fullWidth={true}
                                        {...register('config.token_url', {
                                            required: {
                                                value: true,
                                                message: 'Required',
                                            },
                                            validate: (value: string) => {
                                                if (!value.match(regexList.url)) {
                                                    return 'Invalid URL';
                                                }
                                            },
                                        })}
                                        error={!!fieldErrors.config?.token_url}
                                        helperText={fieldErrors.config?.token_url?.message}
                                    />
                                </FormField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormField labelOrientation='horizontal' label='Client ID *' htmlFor='client_id'>
                                    <Tooltip title='The client identifier registered with the identity provider.'>
                                        <Info className={cx(classes.InfoIcon)} />
                                    </Tooltip>
                                </FormField>
                                <TextField
                                    id='client_id'
                                    size='small'
                                    fullWidth={true}
                                    {...register('config.client_id', {
                                        required: {
                                            value: true,
                                            message: 'Required',
                                        },
                                    })}
                                    error={!!fieldErrors.config?.client_id}
                                    helperText={fieldErrors.config?.client_id?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormField labelOrientation='horizontal' label='Client Secret *' htmlFor='client_secret'>
                                    <Tooltip title='The client secret registered with the identity provider.'>
                                        <Info className={cx(classes.InfoIcon)} />
                                    </Tooltip>
                                </FormField>
                                <Typography variant='caption' color={theme.palette.grey[600]}>
                                    Please store this secret somewhere. It cannot be recovered later.
                                </Typography>
                                <TextField
                                    id='client_secret'
                                    type='password'
                                    size='small'
                                    fullWidth={true}
                                    {...register('config.client_secret', {
                                        required: {
                                            value: true,
                                            message: 'Required',
                                        },
                                        validate: (value: string) => {
                                            if (!value.match(regexList.client_secret)) {
                                                return 'Invalid client secret. Please provide a valid client secret consisting of at least 32 alphanumeric characters, underscores, or hyphens';
                                            }
                                        },
                                    })}
                                    error={!!fieldErrors.config?.client_secret}
                                    helperText={fieldErrors.config?.client_secret?.message}
                                />
                            </Grid>
                        </Grid>

                        <Stack direction={'row'} marginTop={2} columnGap={2} justifyContent={'end'}>
                            <Button variant='contained' className={commonStyles.classes.GreyButton} onClick={props.onBack}>
                                Back
                            </Button>
                            <Button variant='contained' disabled={!formState.isDirty} type='submit' disableElevation>
                                Create OpenID SSO
                            </Button>
                        </Stack>
                    </>
                );
            }}
        </Form>
    );
};

const useStyles = makeStyles()((theme) => ({
    InfoIcon: {
        fontSize: '17px',
    },
}));

export { SSOOpenIDCreateForm };
