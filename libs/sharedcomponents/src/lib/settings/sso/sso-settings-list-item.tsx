import React, { useEffect, useState } from 'react';
import { Stack, Typography, Collapse, Grid, TextField, Button, IconButton, InputAdornment, Tooltip, useTheme, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { makeStyles } from '@vegaplatformui/styling';
import { ISSONameIDPolicyFormat, IUserSettingSSO, IUserSettingSSOOpenID, IUserSettingSSOSaml, SSOTypeEnum } from '@vegaplatformui/models';
import { Download, FileCopy, Info, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { regexList } from '@vegaplatformui/utils';
import { useCopyClipboard, Form, FormField, SSODeleteDialog, useFetchFileBlobAndDownload, SnackBarOptions } from '@vegaplatformui/sharedcomponents';
import { FieldErrors, SubmitHandler } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import { useKeycloak } from '@react-keycloak-fork/web';

interface SSOSettingsListItemProps {
    ssoItem: IUserSettingSSO;
    nameIDPolicyFormatOptions: ISSONameIDPolicyFormat[];
    idx: number;
    expandedIdxList: number[];
    onExpand: (idx: number) => void;
    onSubmit: (data: IUserSettingSSO) => void;
    onDelete: (alias: string) => void;
    onGenerateXMLMetaData: (url: string, filename: string) => void;
}

const SSOSettingsListItem: React.FC<SSOSettingsListItemProps> = (props) => {
    const { cx, classes } = useStyles();
    const theme = useTheme();
    const { keycloak } = useKeycloak();
    const [withCopyClipboard] = useCopyClipboard();
    const setSnackbarOptions = useSetRecoilState(SnackBarOptions);

    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [selectedNameIDPolicy, setSelectedNameIDPolicy] = useState('');
    const [isChangedFormStateBySelect, setIsChangedFormStateBySelect] = useState(false);

    const onSelectNameIDPolicy = (event: SelectChangeEvent<string>) => {
        const fieldValue = event.target.value;
        setIsChangedFormStateBySelect(true);
        setSelectedNameIDPolicy(fieldValue);
    };

    const onSubmit: SubmitHandler<IUserSettingSSO> = (data: IUserSettingSSO) => {
        const samlData = data as IUserSettingSSOSaml;
        const idpData = data as IUserSettingSSOOpenID;
        samlData.config.name_id_policy_format = selectedNameIDPolicy;
        if (data.provider_id === SSOTypeEnum.SAML) {
            props.onSubmit(samlData);
        } else {
            props.onSubmit(idpData);
        }
    };

    useEffect(() => {
        const samlData = props.ssoItem as IUserSettingSSOSaml;
        if (props.ssoItem.provider_id === SSOTypeEnum.SAML) {
            setSelectedNameIDPolicy(samlData.config.name_id_policy_format)
        }
    }, [props.ssoItem]);

    return (
        <>
            <Stack className={cx(classes.SSOItem)}>
                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Stack>
                        <Typography variant='subtitle1' fontWeight={theme.typography.fontWeightMedium}>
                            {props.ssoItem.display_name || '[N/A]'}
                        </Typography>
                        <Typography variant='caption' color={theme.palette.grey[300]} fontWeight={theme.typography.fontWeightMedium}>
                            {props.ssoItem.provider_id.toUpperCase()}
                        </Typography>
                    </Stack>
                    <IconButton onClick={() => props.onExpand(props.idx)}>
                        {props.expandedIdxList.includes(props.idx) ? <KeyboardArrowUp></KeyboardArrowUp> : <KeyboardArrowDown></KeyboardArrowDown>}
                    </IconButton>
                </Stack>
                <Collapse in={props.expandedIdxList.includes(props.idx)} timeout='auto' unmountOnExit>
                    <Form onSubmit={onSubmit}>
                        {({ errors, register, formState, watch, reset }) => {
                            const openIDFieldErrors = errors as FieldErrors<IUserSettingSSOOpenID>;
                            const samlFieldErrors = errors as FieldErrors<IUserSettingSSOSaml>;
                            const idpOpenID = props.ssoItem as IUserSettingSSOOpenID;
                            const idpSaml = props.ssoItem as IUserSettingSSOSaml;
                            return (
                                <Grid container spacing={2} padding={2}>
                                    <Grid item xs={12} display={'none'}>
                                        <FormField label='alias' htmlFor='alias'>
                                            <TextField
                                                id='alias'
                                                size='small'
                                                fullWidth={true}
                                                {...register('alias')}
                                                error={!!openIDFieldErrors.alias}
                                                defaultValue={props.ssoItem.alias}
                                            />
                                        </FormField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormField labelOrientation='horizontal' label='Redirect URI' htmlFor='redirect_uri'>
                                            <Tooltip title="You can't edit the redirect uri because it was already deployed.">
                                                <Info className={cx(classes.InfoIcon)} />
                                            </Tooltip>
                                        </FormField>
                                        <TextField
                                            id='redirect_uri'
                                            size='small'
                                            className={cx(classes.GreyInput)}
                                            fullWidth={true}
                                            {...register('redirect_uri')}
                                            error={!!openIDFieldErrors.redirect_uri}
                                            value={props.ssoItem.redirect_uri}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position='end'>
                                                        <IconButton onClick={() => withCopyClipboard(props.ssoItem.redirect_uri)}>
                                                            <FileCopy />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            inputProps={{
                                                disabled: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormField label='Display Name *' htmlFor='display_name'>
                                            <TextField
                                                id='display_name'
                                                size='small'
                                                fullWidth={true}
                                                {...register('display_name', {
                                                    required: {
                                                        value: true,
                                                        message: 'Required'
                                                    }
                                                })}
                                                error={!!openIDFieldErrors.display_name}
                                                helperText={openIDFieldErrors.display_name?.message}
                                                defaultValue={props.ssoItem.display_name}
                                            />
                                        </FormField>
                                    </Grid>
                                    {props.ssoItem.provider_id.includes(SSOTypeEnum.OPENID) && (
                                        <>
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
                                                        error={!!openIDFieldErrors.config?.authorization_url}
                                                        helperText={openIDFieldErrors.config?.authorization_url?.message}
                                                        defaultValue={idpOpenID.config.authorization_url}
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
                                                        error={!!openIDFieldErrors.config?.token_url}
                                                        helperText={openIDFieldErrors.config?.token_url?.message}
                                                        defaultValue={idpOpenID.config.token_url}
                                                    />
                                                </FormField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormField label='Client ID *' htmlFor='client_id'>
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
                                                        error={!!openIDFieldErrors.config?.client_id}
                                                        helperText={openIDFieldErrors.config?.client_id?.message}
                                                        defaultValue={idpOpenID.config.client_id}
                                                    />
                                                </FormField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormField label='Client Secret *' htmlFor='client_secret'>
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
                                                        error={!!openIDFieldErrors.config?.client_secret}
                                                        helperText={openIDFieldErrors.config?.client_secret?.message}
                                                        defaultValue={idpOpenID.config.client_secret}
                                                    />
                                                </FormField>
                                            </Grid>
                                        </>
                                    )}
                                    {props.ssoItem.provider_id === SSOTypeEnum.SAML && (
                                        <>
                                            <Grid item xs={12} sm={6}>
                                                <FormField label='Signing Certificate' htmlFor='signing_certificate'>
                                                    <TextField
                                                        id='signing_certificate'
                                                        size='small'
                                                        fullWidth={true}
                                                        {...register('config.signing_certificate', {
                                                            // required: {
                                                            //     value: true,
                                                            //     message: 'Required',
                                                            // },
                                                            // validate: (value: string) => {
                                                            // 	if (!value.match(regexList.alphanumeric)) {
                                                            // 		return 'Invalid format. Please provide a valid format containing only alphabetic and numeric characters';
                                                            // 	}
                                                            // },
                                                        })}
                                                        error={!!samlFieldErrors.config?.signing_certificate}
                                                        helperText={samlFieldErrors.config?.signing_certificate?.message}
                                                        defaultValue={idpSaml.config.signing_certificate}
                                                    />
                                                </FormField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormField label='Entity ID' htmlFor='entity_id'>
                                                    <TextField
                                                        id='entity_id'
                                                        size='small'
                                                        fullWidth={true}
                                                        {...register('config.idp_entity_id')}
                                                        error={!!samlFieldErrors.config?.idp_entity_id}
                                                        helperText={samlFieldErrors.config?.idp_entity_id?.message}
                                                        defaultValue={idpSaml.config.idp_entity_id}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position='end'>
                                                                    <IconButton onClick={() => withCopyClipboard(watch('config.idp_entity_id'))}>
                                                                        <FileCopy />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </FormField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormField label='Policy Format' htmlFor='name_id_policy_format'>
                                                    <Select
                                                        id={'name_id_policy_format'}
                                                        labelId={'name_id_policy_format'}
                                                        size='small'
                                                        fullWidth={true}
                                                        {...register('config.name_id_policy_format')}
                                                        error={!!samlFieldErrors.config?.name_id_policy_format}
                                                        value={selectedNameIDPolicy}
                                                        onChange={onSelectNameIDPolicy}
                                                    >
                                                        {props.nameIDPolicyFormatOptions.map((option) => (
                                                            <MenuItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormField label='Single-sign-on URL *' htmlFor='single_sign_on_service_url'>
                                                    <TextField
                                                        id='single_sign_on_service_url'
                                                        size='small'
                                                        fullWidth={true}
                                                        {...register('config.single_sign_on_service_url', {
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
                                                        error={!!samlFieldErrors.config?.single_sign_on_service_url}
                                                        helperText={samlFieldErrors.config?.single_sign_on_service_url?.message}
                                                        defaultValue={idpSaml.config.single_sign_on_service_url}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position='end'>
                                                                    <IconButton
                                                                        onClick={() => withCopyClipboard(watch('config.single_sign_on_service_url'))}
                                                                    >
                                                                        <FileCopy />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </FormField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormField label='Single Logout Service URL' htmlFor='single_logout_service_url'>
                                                    <TextField
                                                        id='single_logout_service_url'
                                                        size='small'
                                                        fullWidth={true}
                                                        {...register('config.single_logout_service_url', {
                                                            validate: (value: string) => {
                                                                if (!value.match(regexList.url) && value) {
                                                                    return 'Invalid URL';
                                                                }
                                                            },
                                                        })}
                                                        error={!!samlFieldErrors.config?.single_logout_service_url}
                                                        helperText={samlFieldErrors.config?.single_logout_service_url?.message}
                                                        defaultValue={idpSaml.config.single_logout_service_url}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position='end'>
                                                                    <IconButton
                                                                        onClick={() => withCopyClipboard(watch('config.single_logout_service_url'))}
                                                                    >
                                                                        <FileCopy />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </FormField>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Stack>
                                                    <Typography variant='subtitle2' fontWeight={theme.typography.fontWeightBold}>
                                                        Provide this to your SSO provider
                                                    </Typography>
                                                    <Button
                                                        variant='text'
                                                        className={cx(classes.XMLDownload)}
                                                        onClick={() => props.onGenerateXMLMetaData(idpSaml.xml_metadata, `Vega_IdP_Metadata_XML.xml`)}
                                                    >
                                                        <Download />
                                                        <Typography variant='subtitle2'>Vega IdP Metadata XML</Typography>
                                                    </Button>
                                                </Stack>
                                            </Grid>
                                        </>
                                    )}
                                    <Grid item container xs={12} direction={'row'} justifyContent={'space-between'}>
                                        <Button
                                            variant='contained'
                                            color='error'
                                            onClick={() => setIsDeleteOpen(true)}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant='contained'
                                            disabled={!formState.isDirty && !isChangedFormStateBySelect}
                                            type='submit'
                                            disableElevation
                                        >
                                            Save
                                        </Button>
                                    </Grid>
                                </Grid>
                            );
                        }}
                    </Form>
                </Collapse>
            </Stack>

            <SSODeleteDialog isOpen={isDeleteOpen} selectedSSO={props.ssoItem} onClose={() => setIsDeleteOpen(false)} onDelete={props.onDelete} />
        </>
    );
};

const useStyles = makeStyles()((theme) => ({
    SSOItem: {
        borderColor: theme.palette.grey['100'],
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '10px',
        padding: '10px 20px 10px 30px',
        marginTop: theme.spacing(2),
    },
    InfoIcon: {
        fontSize: '17px',
    },
    GreyInput: {
        backgroundColor: theme.palette.grey[100],
    },
    XMLDownload: {
        display: 'flex',
        alignItems: 'center',
        columnGap: theme.spacing(1),
        marginTop: theme.spacing(1),
        width: 'fit-content',
        textDecoration: 'underline',
    },
}));

export { SSOSettingsListItem };
