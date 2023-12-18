import React, { useState } from 'react';

import { Form, FormField } from '@vegaplatformui/sharedcomponents';
import { FieldErrors, SubmitHandler } from 'react-hook-form';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { Button, Grid, Stack, TextField, Typography, Collapse, useTheme, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { ISSONameIDPolicyFormat, IUserSettingSSO, IUserSettingSSOSaml, SSOTypeEnum } from '@vegaplatformui/models';
import { regexList } from '@vegaplatformui/utils';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

interface SSOSamlCreateFormProps {
    nameIDPolicyFormatOptions: ISSONameIDPolicyFormat[];
    onCreate: (data: IUserSettingSSO, type: SSOTypeEnum, byXml: boolean) => void;
    onBack: () => void;
}

const SSOSamlCreateForm: React.FC<SSOSamlCreateFormProps> = (props) => {
    const theme = useTheme();
    const commonStyles = useCommonStyles();
    const { classes, cx } = useStyles(props);

    const [isSSOCreateManually, setIsSSOCreateManually] = useState<boolean>(false);
    const [selectedNameIDPolicy, setSelectedNameIDPolicy] = useState<string>(props.nameIDPolicyFormatOptions[0].value);
    const [isChangedFormStateBySelect, setIsChangedFormStateBySelect] = useState(false);

    const onSelectNameIDPolicy = (event: SelectChangeEvent<string>) => {
        const fieldValue = event.target.value;
        setIsChangedFormStateBySelect(true);
        setSelectedNameIDPolicy(fieldValue);
    };

    const onConfigurationSubmit: SubmitHandler<IUserSettingSSOSaml> = (data) => {
        if (isSSOCreateManually) data.config.name_id_policy_format = selectedNameIDPolicy;
        props.onCreate(data, SSOTypeEnum.SAML, !isSSOCreateManually);
    };

    return (
        <Form onSubmit={onConfigurationSubmit}>
            {({ errors, register, formState, reset, watch }) => {
                const fieldErrors = errors as FieldErrors<IUserSettingSSOSaml>;
                return (
                    <>
                        <Typography variant='body1' fontWeight={600}>
                            SAML configuration
                        </Typography>
                        <Typography variant='body2' color={theme.palette.grey[600]}>
                            Use one of the options to configure your SSO for SAML.
                        </Typography>

                        <Typography variant='body2' fontWeight={600} marginTop={2}>
                            Enter SAML SSO Metadata URL
                        </Typography>
                        <Typography variant='body2' color={theme.palette.grey[600]}>
                            Paste your SAML SSO metadata URL. If you do not have one, continue to method two.
                        </Typography>
                        <Grid container marginTop={1}>
                            <Grid item xs={12}>
                                <FormField label='Metadata URL' htmlFor='xml_metadata'>
                                    <TextField
                                        id='xml_metadata'
                                        size='small'
                                        fullWidth={true}
                                        {...register('xml_metadata', {
                                            validate: (value: string) => {
                                                if (!value.match(regexList.url) && value) {
                                                    return 'Invalid URL';
                                                }
                                            },
                                        })}
                                        error={!!fieldErrors.xml_metadata}
                                        helperText={fieldErrors.xml_metadata?.message}
                                    />
                                </FormField>
                            </Grid>
                        </Grid>

                        <Button variant='text' className={cx(classes.CollapseButton)} onClick={() => setIsSSOCreateManually(!isSSOCreateManually)}>
                            No URL? Enter information manually
                            {isSSOCreateManually ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </Button>

                        <Collapse in={isSSOCreateManually} timeout='auto' unmountOnExit>
                            {isSSOCreateManually && (
                                <Grid container spacing={2} marginTop={1}>
                                    <Grid item xs={12} md={6}>
                                        <FormField label='Display Name *' htmlFor='display_name'>
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
                                        </FormField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
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
                                                error={!!fieldErrors.config?.signing_certificate}
                                                helperText={fieldErrors.config?.signing_certificate?.message}
                                            />
                                        </FormField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormField label='Entity ID' htmlFor='idp_entity_id'>
                                            <TextField
                                                id='idp_entity_id'
                                                size='small'
                                                fullWidth={true}
                                                {...register('config.idp_entity_id')}
                                                error={!!fieldErrors.config?.idp_entity_id}
                                                helperText={fieldErrors.config?.idp_entity_id?.message}
                                            />
                                        </FormField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormField label='Policy Format' htmlFor='name_id_policy_format'>
                                            <Select
                                                id={'name_id_policy_format'}
                                                labelId={'name_id_policy_format'}
                                                size='small'
                                                fullWidth={true}
                                                {...register('config.name_id_policy_format')}
                                                error={!!fieldErrors.config?.name_id_policy_format}
                                                defaultValue={props.nameIDPolicyFormatOptions[0].value}
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
                                    <Grid item xs={12} md={6}>
                                        <FormField label='Single Sign-On Service URL *' htmlFor='single_sign_on_service_url'>
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
                                                        if (!value.match(regexList.url) && value) {
                                                            return 'Invalid URL';
                                                        }
                                                    },
                                                })}
                                                error={!!fieldErrors.config?.single_sign_on_service_url}
                                                helperText={fieldErrors.config?.single_sign_on_service_url?.message}
                                            />
                                        </FormField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
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
                                                error={!!fieldErrors.config?.single_logout_service_url}
                                                helperText={fieldErrors.config?.single_logout_service_url?.message}
                                            />
                                        </FormField>
                                    </Grid>
                                </Grid>
                            )}
                        </Collapse>

                        <Stack direction={'row'} marginTop={2} columnGap={2} justifyContent={'end'}>
                            <Button variant='contained' className={commonStyles.classes.GreyButton} onClick={props.onBack}>
                                Back
                            </Button>
                            <Button variant='contained' disabled={!formState.isDirty && !isChangedFormStateBySelect} type='submit'>
                                Create SAML SSO
                            </Button>
                        </Stack>
                    </>
                );
            }}
        </Form>
    );
};

const useStyles = makeStyles<SSOSamlCreateFormProps>()((theme) => ({
    CollapseButton: {
        marginTop: theme.spacing(2),
        color: theme.palette.grey[700],
        textTransform: 'unset',
    },
}));

export { SSOSamlCreateForm };
