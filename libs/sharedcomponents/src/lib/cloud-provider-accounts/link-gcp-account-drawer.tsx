import React, { useEffect } from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { SubmitHandler } from 'react-hook-form';
import { CustomSnackBarOptions, Form, FormField, JsonInput, StyledToolTip, useFetchFileBlobAndDownload } from '@vegaplatformui/sharedcomponents';
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
import { LinkGcpAccountForm, ICloudProviderAccount } from '@vegaplatformui/models';
import { ConfigureGCP, VegaInformYaml } from '@vegaplatformui/sharedassets';
import { SetterOrUpdater, useSetRecoilState } from 'recoil';
import Draggable from 'react-draggable';
import { ArrowBack, Close, Download } from '@mui/icons-material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ILinkGcpAccountDialogProps {
    isDialogOpen: boolean;
    onBackDrawer: () => void;
    onCloseDialog: () => void;
    accountToEdit?: ICloudProviderAccount;
    onSubmitLinkGcpAccountForm: (data: LinkGcpAccountForm) => void;
    setSnackbarOptions: SetterOrUpdater<CustomSnackBarOptions>;
    serviceAccountJson: string;
    setServiceAccountJson: React.Dispatch<React.SetStateAction<string>>;
    onOpenDeleteAccountDialog?: (account: ICloudProviderAccount) => void;
}

function PaperComponent(props: PaperProps) {
    const nodeRef = React.useRef(null);
    return (
        <Draggable nodeRef={nodeRef} handle='#link-gcp-account-dialog' cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper ref={nodeRef} {...props} />
        </Draggable>
    );
}

const LinkGcpAccountDrawer: React.FC<ILinkGcpAccountDialogProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();
    const [cloudProvider, setCloudProvider] = React.useState<string | undefined>(undefined);
    const [isCloudProviderSelected, setIsCloudProviderSelected] = React.useState(false);
    const linkGcpAccountSteps = [
        {
            label: 'Enable Cloud billing data',
            description: `Download the cloud billing setup instructions`,
            button: (
                <Link
                    variant='subtitle2'
                    component='button'
                    underline='hover'
                    onClick={() => {
                        useFetchFileBlobAndDownload('Configuring-GCP-for-Vega-Platform-Integration.pdf', ConfigureGCP, props.setSnackbarOptions);
                    }}
                >
                    here
                </Link>
            ),
        },
        {
            label: 'Create Vega role in GCP',
            description: 'Setup GCP credentials',
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

    const onSubmitForm: SubmitHandler<LinkGcpAccountForm> = (data) => {
        const formToSubmit = { ...data, isEditAccount: props.accountToEdit !== undefined };
        props.onSubmitLinkGcpAccountForm(formToSubmit);
        props.onCloseDialog();
    };

    const onChangeJson = (value: string) => {
        props.setServiceAccountJson!(value);
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
            aria-labelledby='link-gcp-account-drawer'
            hideBackdrop={!props.accountToEdit}
        >
            <DialogTitle variant={'h6'} id='link-gcp-account-drawer-title'>
                <Grid container>
                    <Grid xs={10}>
                        <Stack className={cx(classes.DrawerTitle)} direction={'row'} justifyContent='flex-start' alignItems='flex-start' spacing={1}>
                            {props.accountToEdit === undefined && (
                                <IconButton onClick={props.onBackDrawer}>
                                    <ArrowBack color={'secondary'} />
                                </IconButton>
                            )}
                            <Stack direction={'column'}>
                                {(props.accountToEdit && 'Edit GCP Account') ?? 'Link GCP Account'}
                                {props.accountToEdit === undefined ? (
                                    <Typography variant={'body2'}>
                                        Download the GCP guide and follow the instructions to link your GCP account in the Vega platform
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
                                    'Configuring-GCP-for-Vega-Platform-Integration.pdf',
                                    ConfigureGCP,
                                    props.setSnackbarOptions
                                );
                            }}
                            startIcon={<Download />}
                        >
                            GCP Guide
                        </Button>
                    </Stack>
                )}
                <Stack className={cx(classes.DrawerContainer)} direction='column' justifyContent='flex-start' alignItems='flex-start' spacing={1}>
                    <Stack spacing={1} className={cx(classes.FormWindow)}>
                        <Typography className={cx(classes.FormTitle)} variant={'body1'}>
                            Account Details
                        </Typography>
                        <Form id='link-gcp-account-drawer-form' onSubmit={onSubmitForm}>
                            {(formProps) => {
                                const service_account = formProps.watch('service_account');
                                const project_name = formProps.watch('service_account');

                                return (
                                    <>
                                        <Grid container spacing={2}>
                                            <Grid xs={12}>
                                                <FormField label='Project Name' htmlFor='project_name'>
                                                    <TextField
                                                        id={'project_name'}
                                                        className={cx(classes.FormContentWindow)}
                                                        size='small'
                                                        placeholder={'Project Name'}
                                                        {...formProps.register('project_name', {
                                                            required: { message: 'Required', value: true },
                                                        })}
                                                        error={!!formProps.errors.project_name}
                                                        defaultValue={props.accountToEdit?.account_name ?? ''}
                                                        helperText={formProps.errors.project_name?.message}
                                                    />
                                                </FormField>
                                            </Grid>
                                            <Grid xs={12}>
                                                <FormField label='Service Account' htmlFor='service_account'>
                                                    <JsonInput
                                                        id={'service_account'}
                                                        className={cx(classes.FormContentWindow)}
                                                        size='small'
                                                        multiline
                                                        rows={12}
                                                        setFormValue={formProps.setValue}
                                                        onChangeValue={onChangeJson}
                                                        {...formProps.register('service_account', { required: { message: 'Required', value: true } })}
                                                        error={!!formProps.errors.service_account}
                                                        value={props.serviceAccountJson ?? ''}
                                                        placeholder={'Paste JSON from Instructions'}
                                                        helperText={formProps.errors.service_account?.message}
                                                    />
                                                </FormField>
                                            </Grid>
                                        </Grid>
                                    </>
                                );
                            }}
                        </Form>
                    </Stack>
                    {/*Just adding false in so it will never display*/}
                    {props.accountToEdit === undefined && false && (
                        <Typography className={cx(classes.FormContentWindow)} variant={'caption'}>
                            Accounts will automatically be tested after creation and there will be a discovery every 30 minutes to search for errors.
                        </Typography>
                    )}
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
                            form={'link-gcp-account-drawer-form'}
                        >
                            Save Changes
                        </Button>
                    ) : (
                        <Button
                            className={commonStyles.cx(commonStyles.classes.LowercaseTextButton)}
                            disableElevation={true}
                            type={'submit'}
                            variant={'contained'}
                            form={'link-gcp-account-drawer-form'}
                        >
                            Link Account
                        </Button>
                    )}
                </DialogActions>
            </Stack>
        </Drawer>
    );
};

const useStyles = makeStyles<ILinkGcpAccountDialogProps>()((theme, props) => ({
    DialogActions: {
        marginRight: '0.3rem',
    },
    FormWindow: { width: '100%' },
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
    FormContentWindow: {
        width: '90%',
    },
    DrawerPaper: { width: '35%' },
    CloseButton: {
        float: 'right',
        marginRight: '-1.5rem',
        marginTop: '-1rem',
    },
    TemplateButton: {
        marginTop: '2rem',
    },
}));

export { LinkGcpAccountDrawer };
