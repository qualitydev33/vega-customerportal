import React from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, Switch, Typography } from '@mui/material';
import { makeStyles } from '@vegaplatformui/styling';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Form, FormField } from '@vegaplatformui/sharedcomponents';
import { OrganizationApi } from '@vegaplatformui/apis';
import { Stack } from '@mui/system';
import { IOrganizationPostRequest } from '@vegaplatformui/models';
import { useKeycloak } from '@react-keycloak-fork/web';
import { AxiosResponse } from 'axios';

export interface INewOrganizationFormProps {
    open: boolean;
    onClose: () => void;
}

const skus = [
    { label: 'Trial', value: '1', id: 1 },
    { label: 'Inform', value: '2', id: 2 },
    { label: 'Optimize', value: '3', id: 3 },
    { label: 'Operate', value: '4', id: 4 },
    { label: 'MSP', value: '5', id: 5 },
];

const childOrgs = [
    { label: 'Org 1', value: '1' },
    { label: 'Org 2', value: '2' },
    { label: 'Org 3', value: '3' },
    { label: 'Org 4', value: '4' },
];

const NewOrganizationForm: React.FC<INewOrganizationFormProps> = (props) => {
    const { open, onClose } = props;
    const { classes, cx } = useStyles();
    const { keycloak } = useKeycloak();

    const onSubmit: SubmitHandler<IOrganizationPostRequest> = (data) => {
        const org = new OrganizationApi();
        org.token = keycloak.token ?? '';

        org.createOrganization(data).then((res: AxiosResponse) => {
            console.log(res);
        });

        onClose();
    };

    const getValidKeycloakRealm = (slug: string) => {
        // TODO: Check if available, else return an available one

        return slug;
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true}>
            <DialogTitle>New Organization</DialogTitle>
            <DialogContent>
                <Form onSubmit={onSubmit} className={cx(classes.Form)}>
                    {({ errors, register, watch, setValue }) => {
                        const isTrial = watch('isTrial');
                        const isMSP = watch('isMSP');
                        const isChildOrg = watch('isChildOrg');

                        return (
                            <Grid container spacing={2}>
                                <Grid xs={12}>
                                    <FormField label='Organization Name' htmlFor='name'>
                                        <TextField
                                            id={'name'}
                                            size='small'
                                            fullWidth={true}
                                            {...register('name', { required: true })}
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                        />
                                    </FormField>
                                </Grid>

                                <Grid xs={12} sm={6}>
                                    <FormField label='Org Owner First Name' htmlFor='owner.firstName'>
                                        <TextField
                                            id={'owner.firstName'}
                                            size='small'
                                            fullWidth={true}
                                            {...register('owner.firstName', { required: true })}
                                            error={!!errors.owner?.firstName}
                                            helperText={errors.owner?.firstName?.message}
                                        />
                                    </FormField>
                                </Grid>

                                <Grid xs={12} sm={6}>
                                    <FormField label='Org Owner Last Name' htmlFor='owner.lastName'>
                                        <TextField
                                            id={'owner.lastName'}
                                            size='small'
                                            fullWidth={true}
                                            {...register('owner.lastName', { required: true })}
                                            error={!!errors.owner?.lastName}
                                            helperText={errors.owner?.lastName?.message}
                                        />
                                    </FormField>
                                </Grid>

                                <Grid xs={12}>
                                    <FormField label='Org Owner Email Address' htmlFor='owner.emailAddress'>
                                        <TextField
                                            id={'owner.emailAddress'}
                                            size='small'
                                            fullWidth={true}
                                            {...register('owner.emailAddress', { required: true })}
                                            error={!!errors.owner?.emailAddress}
                                            helperText={errors.owner?.emailAddress?.message}
                                        />
                                    </FormField>
                                </Grid>

                                <Grid xs={12} sm={6}>
                                    <FormField label='Org Slug Name' htmlFor='slug'>
                                        <TextField
                                            id={'slug'}
                                            size='small'
                                            fullWidth={true}
                                            {...register('slug', { required: true })}
                                            onBlur={(e) => {
                                                const slug = e.currentTarget.value;
                                                if (!slug) {
                                                    return;
                                                }

                                                // Generate domain
                                                setValue('domain', `${slug}.vegacloud.io`);

                                                // Generate keycloak realm
                                                const keycloakRealm = getValidKeycloakRealm(slug);
                                                setValue('keycloakRealm', keycloakRealm);
                                            }}
                                            error={!!errors.slug}
                                            helperText={errors.slug?.message}
                                        />
                                    </FormField>
                                </Grid>

                                <Grid xs={12} sm={6}>
                                    <FormField label='Org Keycloak Realm Name' htmlFor='keycloakRealm'>
                                        <TextField
                                            id={'keycloakRealm'}
                                            size='small'
                                            fullWidth={true}
                                            {...register('keycloakRealm', { required: true })}
                                            error={!!errors.keycloakRealm}
                                            helperText={errors.keycloakRealm?.message}
                                        />
                                    </FormField>
                                </Grid>

                                <Grid xs={12}>
                                    <FormField label='Domain URL' htmlFor='domain'>
                                        <TextField
                                            id={'domain'}
                                            size='small'
                                            fullWidth={true}
                                            {...register('domain', { required: true })}
                                            error={!!errors.domain}
                                            helperText={errors.domain?.message}
                                        />
                                    </FormField>
                                </Grid>

                                <Grid xs={12}>
                                    <FormField label='SKU' htmlFor='sku'>
                                        <Select
                                            id={'sku'}
                                            labelId={'sku'}
                                            size='small'
                                            fullWidth={true}
                                            {...register('sku', { required: true })}
                                            error={!!errors.sku}
                                        >
                                            {skus.map((option) => (
                                                <MenuItem key={option.label} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormField>
                                </Grid>

                                <Grid xs={12}>
                                    <Stack direction='row' alignItems='start' spacing={2}>
                                        <FormField label='Is Trial?' labelOrientation='horizontal' htmlFor='isTrial'>
                                            <Stack direction='row' alignItems='center'>
                                                <Typography className={cx(isTrial ? classes.SwitchLabelInactive : classes.SwitchLabelActive)}>
                                                    No
                                                </Typography>
                                                <Switch id='isTrial' {...register('isTrial')} />
                                                <Typography className={cx(isTrial ? classes.SwitchLabelActive : classes.SwitchLabelInactive)}>
                                                    Yes
                                                </Typography>
                                            </Stack>
                                        </FormField>
                                        {isTrial ? (
                                            <>
                                                <FormField label='Start' labelOrientation='horizontal' htmlFor='trialStart'>
                                                    <TextField
                                                        type='date'
                                                        id='trialStart'
                                                        size='small'
                                                        {...register('trialStart', { required: true })}
                                                        error={!!errors.trialStart}
                                                        helperText={errors.trialStart?.message}
                                                    />
                                                </FormField>
                                                <FormField label='End' labelOrientation='horizontal' htmlFor='trialEnd'>
                                                    <TextField
                                                        type='date'
                                                        id='trialEnd'
                                                        size='small'
                                                        {...register('trialEnd', { required: true })}
                                                        error={!!errors.trialEnd}
                                                        helperText={errors.trialEnd?.message}
                                                    />
                                                </FormField>
                                            </>
                                        ) : null}
                                    </Stack>
                                </Grid>

                                <Grid xs={12}>
                                    <FormField label='MSP?' labelOrientation='horizontal' htmlFor='isMSP'>
                                        <Stack direction='row' alignItems='center'>
                                            <Typography className={cx(isMSP ? classes.SwitchLabelInactive : classes.SwitchLabelActive)}>
                                                No
                                            </Typography>
                                            <Switch id='isMSP' {...register('isMSP')} />
                                            <Typography className={cx(isMSP ? classes.SwitchLabelActive : classes.SwitchLabelInactive)}>
                                                Yes
                                            </Typography>
                                        </Stack>
                                    </FormField>
                                </Grid>
                                {isMSP ? (
                                    <>
                                        <Grid xs={12}>
                                            <FormField label='MSP Child Org?' labelOrientation='horizontal' htmlFor='isChildOrg'>
                                                <Stack direction='row' alignItems='center'>
                                                    <Typography className={cx(isChildOrg ? classes.SwitchLabelInactive : classes.SwitchLabelActive)}>
                                                        No
                                                    </Typography>
                                                    <Switch id='isChildOrg' {...register('isChildOrg')} />
                                                    <Typography className={cx(isChildOrg ? classes.SwitchLabelActive : classes.SwitchLabelInactive)}>
                                                        Yes
                                                    </Typography>
                                                </Stack>
                                            </FormField>
                                        </Grid>
                                    </>
                                ) : null}

                                {isMSP && isChildOrg ? (
                                    <Grid xs={12}>
                                        <FormField label='Child Org' htmlFor='childOrg'>
                                            <Select
                                                id={'childOrg'}
                                                labelId={'childOrg'}
                                                size='small'
                                                fullWidth={true}
                                                {...register('childOrg', { required: true })}
                                                error={!!errors.childOrg}
                                            >
                                                {childOrgs.map((option) => (
                                                    <MenuItem key={option.label} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormField>
                                    </Grid>
                                ) : null}

                                <DialogActions>
                                    <Button type='submit' variant='contained'>
                                        Create new Org
                                    </Button>
                                </DialogActions>
                            </Grid>
                        );
                    }}
                </Form>
            </DialogContent>
        </Dialog>
    );
};

const useStyles = makeStyles()((theme) => ({
    Container: {
        padding: theme.spacing(4),
    },
    Form: {
        marginTop: theme.spacing(2),
    },
    SwitchLabelInactive: {
        fontSize: 12,
        fontWeight: theme.typography.fontWeightRegular,
        color: theme.palette.text.secondary,
    },
    SwitchLabelActive: {
        fontSize: 12,
        fontWeight: theme.typography.fontWeightRegular,
        color: theme.palette.text.primary,
    },
}));

export { NewOrganizationForm };
