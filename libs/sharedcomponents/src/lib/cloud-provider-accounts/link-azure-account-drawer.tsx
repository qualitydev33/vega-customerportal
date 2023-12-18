import React from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { SubmitHandler } from 'react-hook-form';
import { CustomSnackBarOptions, Form, FormField, StyledToolTip, useFetchFileBlobAndDownload } from '@vegaplatformui/sharedcomponents';
import {
    Button,
    ButtonProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Drawer,
    IconButton,
    Link,
    Paper,
    PaperProps,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { InstructionStepper } from '../instruction-stepper/instruction-stepper';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { CancelButton } from '@vegaplatformui/utils';
import { LinkAzureAccountForm, ICloudProviderAccount } from '@vegaplatformui/models';
import { ConfigureAzure, VegaInformYaml } from '@vegaplatformui/sharedassets';
import { SetterOrUpdater, useSetRecoilState } from 'recoil';
import { validate as uuidValidate } from 'uuid';
import Draggable from 'react-draggable';
import { ArrowBack, Close, Download } from '@mui/icons-material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ILinkAzureAccountDialogProps {
    isDialogOpen: boolean;
    onBackDrawer: () => void;
    onCloseDialog: () => void;
    accountToEdit?: ICloudProviderAccount;
    onSubmitLinkAzureAccountForm: (data: LinkAzureAccountForm) => void;
    setSnackbarOptions: SetterOrUpdater<CustomSnackBarOptions>;
    onOpenDeleteAccountDialog?: (account: ICloudProviderAccount) => void;
}

function PaperComponent(props: PaperProps) {
    const nodeRef = React.useRef(null);
    return (
        <Draggable nodeRef={nodeRef} handle='#link-azure-account-dialog' cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper ref={nodeRef} {...props} />
        </Draggable>
    );
}

const LinkAzureAccountDrawer: React.FC<ILinkAzureAccountDialogProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();
    const [cloudProvider, setCloudProvider] = React.useState<string | undefined>(undefined);
    const [isCloudProviderSelected, setIsCloudProviderSelected] = React.useState(false);

    const linkAzureAccountSteps = [
        {
            label: 'Configure Azure integration with Vega platform',
            description: `Download the Azure configuration`,
            button: (
                <Link
                    variant='subtitle2'
                    component='button'
                    underline='hover'
                    onClick={() => {
                        useFetchFileBlobAndDownload(
                            'Configuring-Azure-Single-Subscription-Account-for-Vega-Platform-Integration.pdf',
                            ConfigureAzure,
                            props.setSnackbarOptions
                        );
                    }}
                >
                    here
                </Link>
            ),
        },
        {
            label: 'Provide account details',
            description: `Refer to the documentation on where to find account details`,
        },
    ];
    const onChangeCloudProvider = (event: React.MouseEvent<HTMLElement>, cloudProvider: string | undefined) => {
        if (cloudProvider !== undefined) {
            setIsCloudProviderSelected(true);
        } else {
            setIsCloudProviderSelected(false);
        }
        setCloudProvider(cloudProvider);
    };

    const control = {
        value: cloudProvider,
        onChange: onChangeCloudProvider,
        exclusive: true,
    };

    const onSubmitForm: SubmitHandler<LinkAzureAccountForm> = (data) => {
        const formToSubmit = { ...data, isEditAccount: props.accountToEdit !== undefined };
        props.onSubmitLinkAzureAccountForm(formToSubmit);
        props.onCloseDialog();
    };

    return (
        <Drawer
            PaperProps={{
                className: cx(classes.DrawerPaper),
            }}
            classes={{ root: cx(classes.DrawerRoot) }}
            anchor={'right'}
            open={props.isDialogOpen}
            onClose={props.onCloseDialog}
            aria-labelledby='link-azure-account-drawer'
            hideBackdrop={!props.accountToEdit}
        >
            <DialogTitle variant={'h6'} id='link-azure-account-drawer-title'>
                <Grid container>
                    <Grid xs={10}>
                        <Stack className={cx(classes.DrawerTitle)} direction={'row'} justifyContent='flex-start' alignItems='flex-start' spacing={1}>
                            {props.accountToEdit === undefined && (
                                <IconButton onClick={props.onBackDrawer}>
                                    <ArrowBack color={'secondary'} />
                                </IconButton>
                            )}
                            <Stack direction={'column'}>
                                {(props.accountToEdit && 'Edit Azure Account') ?? 'Link Azure Account'}
                                {props.accountToEdit === undefined ? (
                                    <Typography variant={'body2'}>
                                        Download the Azure guide and follow the instructions to setup an Azure account in the Vega platform.
                                    </Typography>
                                ) : (
                                    <></>
                                )}
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid xs={2}>
                        <IconButton className={cx(classes.CloseButton)} onClick={props.onCloseDialog}>
                            <Close color={'secondary'} />
                        </IconButton>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                {props.accountToEdit === undefined && (
                    <Stack
                        direction={'column'}
                        className={cx(classes.DrawerContainer)}
                        justifyContent='flex-start'
                        alignItems='flex-start'
                        spacing={0.5}
                    >
                        <Button
                            className={commonStyles.cx(commonStyles.classes.LowercaseTextButton)}
                            variant={'outlined'}
                            onClick={() => {
                                useFetchFileBlobAndDownload(
                                    'Configuring-Azure-Single-Subscription-Account-for-Vega-Platform-Integration.pdf',
                                    ConfigureAzure,
                                    props.setSnackbarOptions
                                );
                            }}
                            startIcon={<Download />}
                        >
                            Azure Guide
                        </Button>
                    </Stack>
                )}
                <Stack className={cx(classes.DrawerContainer)} direction='column' justifyContent='flex-start' alignItems='flex-start' spacing={1}>
                    <Stack spacing={1}>
                        <Typography className={cx(classes.FormTitle)} variant={'body1'}>
                            Account Details
                        </Typography>
                        <Form id='link-azure-account-drawer-form' onSubmit={onSubmitForm}>
                            {({ errors, register, watch, setValue }) => {
                                const subscription_id = watch('subscriptionId');
                                const client_id = watch('clientId');
                                const secret_value = watch('clientSecret');
                                const tenant_id = watch('tenantId');
                                const subscription = watch('subscription');

                                return (
                                    <>
                                        <Grid container spacing={2}>
                                            <Grid xs={12}>
                                                <FormField label='Subscription' htmlFor='subscription'>
                                                    <TextField
                                                        id={'subscription'}
                                                        size='small'
                                                        className={cx(classes.FormContentWindow)}
                                                        {...register('subscription', {
                                                            required: { message: 'Required', value: true },
                                                            validate: (subscription: string) => {
                                                                if (!subscription.match(/^[a-zA-Z]([a-zA-Z0-9\-]{0,78}[a-zA-Z0-9])?$/i)) {
                                                                    return 'Subscription can only contain alphanumerics and hyphens. In addition, must start with a letter and end with an alphanumeric.';
                                                                }
                                                            },
                                                            minLength: 1,
                                                            maxLength: 80,
                                                        })}
                                                        error={!!errors.subscription}
                                                        defaultValue={(props.accountToEdit && props.accountToEdit.account_name) ?? ''}
                                                        placeholder={'Subscription'}
                                                        helperText={errors.subscription?.message}
                                                    />
                                                </FormField>
                                            </Grid>
                                            <Grid xs={12}>
                                                <FormField label='Subscription ID' htmlFor='subscriptionId'>
                                                    <TextField
                                                        id={'subscription_id'}
                                                        inputProps={{ readOnly: !!props.accountToEdit }}
                                                        size='small'
                                                        className={cx(classes.FormContentWindow)}
                                                        {...register('subscriptionId', {
                                                            required: { message: 'Required', value: true },
                                                            validate: (account_id: string) => {
                                                                if (!uuidValidate(account_id)) {
                                                                    return 'Subscription ID must be a valid UUID';
                                                                }
                                                            },
                                                        })}
                                                        error={!!errors.subscriptionId}
                                                        defaultValue={(props.accountToEdit && props.accountToEdit.account_id) ?? ''}
                                                        placeholder={'Subscription ID'}
                                                        helperText={errors.subscriptionId?.message}
                                                    />
                                                </FormField>
                                            </Grid>
                                            <Grid xs={12}>
                                                <FormField label='Client ID' htmlFor='clientId'>
                                                    <TextField
                                                        id={'client_id'}
                                                        size='small'
                                                        className={cx(classes.FormContentWindow)}
                                                        inputProps={{ readOnly: !!props.accountToEdit }}
                                                        {...register('clientId', {
                                                            required: { message: 'Required', value: true },
                                                            validate: (account_id: string) => {
                                                                if (!uuidValidate(account_id)) {
                                                                    return 'Client ID/Application ID must be a valid UUID';
                                                                }
                                                            },
                                                        })}
                                                        error={!!errors.clientId}
                                                        placeholder={'Client ID'}
                                                        defaultValue={
                                                            (props.accountToEdit && JSON.parse(props.accountToEdit.secret_json)?.clientId) ?? ''
                                                        }
                                                        helperText={errors.clientId?.message}
                                                    />
                                                </FormField>
                                            </Grid>
                                            <Grid xs={12}>
                                                <FormField label='Client Secret' htmlFor='clientSecret'>
                                                    <TextField
                                                        id={'secret_value'}
                                                        size='small'
                                                        className={cx(classes.FormContentWindow)}
                                                        {...register('clientSecret', { required: { message: 'Required', value: true } })}
                                                        error={!!errors.clientSecret}
                                                        placeholder={'Client Secret'}
                                                        defaultValue={
                                                            (props.accountToEdit && JSON.parse(props.accountToEdit.secret_json)?.clientSecret) ?? ''
                                                        }
                                                        helperText={errors.clientSecret?.message}
                                                    />
                                                </FormField>
                                            </Grid>
                                            <Grid xs={12}>
                                                <FormField label='Tenant ID' htmlFor='tenantId'>
                                                    <TextField
                                                        id={'tenant_id'}
                                                        size='small'
                                                        className={cx(classes.FormContentWindow)}
                                                        inputProps={{ readOnly: !!props.accountToEdit }}
                                                        {...register('tenantId', {
                                                            required: { message: 'Required', value: true },
                                                            validate: (account_id: string) => {
                                                                if (!uuidValidate(account_id)) {
                                                                    return 'Tenant ID must be a valid UUID';
                                                                }
                                                            },
                                                        })}
                                                        error={!!errors.tenantId}
                                                        placeholder={'Tenant ID'}
                                                        defaultValue={
                                                            (props.accountToEdit && JSON.parse(props.accountToEdit.secret_json)?.tenantId) ?? ''
                                                        }
                                                        helperText={errors.tenantId?.message}
                                                    />
                                                </FormField>
                                            </Grid>
                                        </Grid>
                                    </>
                                );
                            }}
                        </Form>
                        {/*Just adding false in so it will never display*/}
                        {props.accountToEdit === undefined && false && (
                            <Typography className={cx(classes.FormContentWindow)} variant={'caption'}>
                                Accounts will automatically be tested after creation and there will be a discovery every 30 minutes to search for
                                errors.
                            </Typography>
                        )}
                    </Stack>
                </Stack>
            </DialogContent>
            <Stack className={cx(classes.FormContentWindow)} direction={'row'} justifyContent='space-between' alignItems='center' spacing={0}>
                <DialogActions className={cx(classes.DialogActions, classes.DeleteButton)}>
                    {props.accountToEdit && (
                        <Button
                            className={commonStyles.cx(commonStyles.classes.LowercaseTextButton)}
                            disableElevation={true}
                            variant={'contained'}
                            onClick={() => {
                                const account = props.accountToEdit!;
                                props.onOpenDeleteAccountDialog && props.onOpenDeleteAccountDialog(account);
                                props.onCloseDialog();
                            }}
                            color={'error'}
                        >
                            Delete
                        </Button>
                    )}
                </DialogActions>
                <DialogActions className={cx(classes.DialogActions)}>
                    {/*<CancelButton disableElevation={true} variant={'contained'} color={'secondary'} autoFocus onClick={props.onCloseDialog}>*/}
                    {/*    Cancel*/}
                    {/*</CancelButton>*/}
                    {props.accountToEdit !== undefined ? (
                        <Button
                            className={commonStyles.cx(commonStyles.classes.LowercaseTextButton)}
                            disableElevation={true}
                            type={'submit'}
                            variant={'contained'}
                            form={'link-azure-account-drawer-form'}
                        >
                            Save Changes
                        </Button>
                    ) : (
                        <Button
                            className={commonStyles.cx(commonStyles.classes.LowercaseTextButton)}
                            disableElevation={true}
                            type={'submit'}
                            variant={'contained'}
                            form={'link-azure-account-drawer-form'}
                        >
                            Link Account
                        </Button>
                    )}
                </DialogActions>
            </Stack>
        </Drawer>
    );
};

const useStyles = makeStyles<ILinkAzureAccountDialogProps>()((theme, props) => ({
    DialogActions: {
        marginRight: '0.3rem',
    },
    CloudFormationTitle: {
        fontWeight: 600,
    },
    FormTitle: {
        fontWeight: 600,
        marginTop: '1rem',
        marginBottom: '.5rem',
    },
    DrawerRoot: {
        zIndex: '1300 !important' as any,
    },
    DrawerTitle: {},
    DeleteButton: { marginLeft: '4rem' },
    DrawerContainer: {
        marginLeft: '3rem',
    },
    DrawerPaper: { width: '35%' },
    FormContentWindow: {
        width: '90%',
    },
    CloseButton: {
        float: 'right',
        marginRight: '-1.5rem',
        marginTop: '-1rem',
    },
    TemplateButton: {
        marginTop: '2rem',
    },
}));

export { LinkAzureAccountDrawer };
