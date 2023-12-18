import React from 'react';
import { useCommonStyles, makeStyles } from '@vegaplatformui/styling';
import {
    Box,
    Button,
    ButtonProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Drawer,
    IconButton,
    Link,
    List,
    ListItem,
    MenuItem,
    Paper,
    PaperProps,
    Stack,
    Switch,
    TextField,
    ToggleButton,
    Typography,
} from '@mui/material';
import { InstructionStepper, InstructionStepperSteps } from '../instruction-stepper/instruction-stepper';
import {
    Form,
    FormField,
    FrontendFileDownloadBlob,
    useFetchFileBlobAndDownload,
    CustomSnackBarOptions,
    StyledToolTip,
    OrganizationId,
} from '@vegaplatformui/sharedcomponents';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { SubmitHandler } from 'react-hook-form';
import { CancelButton } from '@vegaplatformui/utils';
import { LinkAwsAccountForm, ICloudProviderAccount } from '@vegaplatformui/models';
import { VegaInformYaml } from '@vegaplatformui/sharedassets';
import { SetterOrUpdater, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Draggable from 'react-draggable';
import { ArrowBack, Close, Download } from '@mui/icons-material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ILinkAwsAccountDialogProps {
    isDialogOpen: boolean;
    onBackDrawer: () => void;
    onCloseDialog: () => void;
    accountToEdit?: ICloudProviderAccount;
    onSubmitLinkAwsAccountForm: (data: LinkAwsAccountForm) => void;
    setSnackbarOptions: SetterOrUpdater<CustomSnackBarOptions>;
    onOpenDeleteAccountDialog?: (account: ICloudProviderAccount) => void;
}

function PaperComponent(props: PaperProps) {
    const nodeRef = React.useRef(null);
    return (
        <Draggable nodeRef={nodeRef} handle='#link-aws-account-dialog' cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper ref={nodeRef} {...props} />
        </Draggable>
    );
}

const LinkAwsAccountDrawer: React.FC<ILinkAwsAccountDialogProps> = (props) => {
    const localStyles = useStyles(props);
    const commonStyles = useCommonStyles();
    const [cloudProvider, setCloudProvider] = React.useState<string | undefined>(undefined);
    const [isCloudProviderSelected, setIsCloudProviderSelected] = React.useState(false);
    const organizationId = useRecoilValue(OrganizationId);

    const linkAwsAccountSteps: InstructionStepperSteps[] = [
        {
            label: 'Install cloud formation template',
            description: `Download the cloud formation template`,
            button: (
                <Link
                    variant='subtitle2'
                    component='button'
                    underline='hover'
                    onClick={() => {
                        useFetchFileBlobAndDownload('vega-cft-linked-informedsku.yaml', VegaInformYaml, props.setSnackbarOptions);
                    }}
                >
                    here
                </Link>
            ),
        },
        {
            label: 'Provide account details',
            description:
                'Account ID is the 12-digit AWS account ID.\nPayer Account ID is the master billing account (organization root).\nExternal ID is the Vega provided external value.',
        },
    ];

    const onSubmitForm: SubmitHandler<LinkAwsAccountForm> = (data) => {
        const formToSubmit = { ...data, isEditAccount: props.accountToEdit !== undefined };
        props.onSubmitLinkAwsAccountForm(formToSubmit);
        props.onCloseDialog();
    };

    return (
        <Drawer
            PaperProps={{
                className: localStyles.cx(localStyles.classes.DrawerPaper),
            }}
            classes={{ root: localStyles.cx(localStyles.classes.DrawerRoot) }}
            anchor={'right'}
            open={props.isDialogOpen}
            onClose={props.onBackDrawer}
            aria-labelledby='link-aws-account-drawer'
            hideBackdrop={!props.accountToEdit}
        >
            <DialogTitle variant={'h6'} id={'link-aws-account-drawer-title'}>
                <Grid container>
                    <Grid xs={10}>
                        <Stack
                            className={localStyles.cx(localStyles.classes.DrawerTitle)}
                            direction={'row'}
                            justifyContent='flex-start'
                            alignItems='flex-start'
                            spacing={1}
                        >
                            {props.accountToEdit === undefined && (
                                <IconButton onClick={props.onBackDrawer}>
                                    <ArrowBack color={'secondary'} />
                                </IconButton>
                            )}
                            <Stack direction={'column'}>
                                {(props.accountToEdit && 'Edit AWS Account') ?? 'Link AWS Cloud Account'}
                                {props.accountToEdit === undefined ? (
                                    <Typography variant={'body2'}>Follow the instructions to link your AWS cloud account.</Typography>
                                ) : (
                                    <></>
                                )}
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid xs={2}>
                        <IconButton className={localStyles.cx(localStyles.classes.CloseButton)} onClick={props.onCloseDialog}>
                            <Close color={'secondary'} />
                        </IconButton>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <Stack
                    className={localStyles.cx(localStyles.classes.DrawerContainer)}
                    direction='column'
                    justifyContent='flex-start'
                    alignItems='flex-start'
                    spacing={2}
                >
                    {props.accountToEdit === undefined && (
                        <List className={localStyles.cx(localStyles.classes.IntructionList)}>
                            <ListItem className={localStyles.cx(localStyles.classes.InstructionStep)}>
                                <Typography variant={'body2'}>Account ID is the 12-digit AWS account ID</Typography>
                            </ListItem>
                            <ListItem className={localStyles.cx(localStyles.classes.InstructionStep)}>
                                <Typography variant={'body2'}>Payer Account ID is the master billing account (organization root)</Typography>
                            </ListItem>
                            <ListItem className={localStyles.cx(localStyles.classes.InstructionStep)}>
                                <Typography variant={'body2'}>External ID is the Vega provided external value</Typography>
                            </ListItem>
                        </List>
                    )}
                    {props.accountToEdit === undefined && (
                        <Stack
                            direction={'column'}
                            className={localStyles.cx(localStyles.classes.DrawerContainer, localStyles.classes.TemplateButton)}
                            justifyContent='flex-start'
                            alignItems='flex-start'
                            spacing={0.5}
                        >
                            <Typography className={localStyles.cx(localStyles.classes.CloudFormationTitle)} variant={'body1'}>
                                Download the cloud formation template
                            </Typography>
                            <Typography variant={'subtitle1'}>This template is used to create the External ID.</Typography>
                            <Button
                                className={commonStyles.cx(commonStyles.classes.LowercaseTextButton)}
                                variant={'outlined'}
                                type={'button'}
                                onClick={() => {
                                    useFetchFileBlobAndDownload('vega-cft-linked-informedsku.yaml', VegaInformYaml, props.setSnackbarOptions);
                                }}
                                startIcon={<Download />}
                            >
                                Cloud Formation Template
                            </Button>
                        </Stack>
                    )}
                    <Stack spacing={1}>
                        <Typography className={localStyles.cx(localStyles.classes.FormTitle)} variant={'body1'}>
                            Account Details
                        </Typography>
                        <Form id={'link-aws-account-drawer-form'} onSubmit={onSubmitForm}>
                            {({ errors, register, watch, setValue }) => {
                                const payer_account_id = watch('payer_account_id');
                                const external_id = watch('external_id');
                                const account_id = watch('account_id');
                                const account_name = watch('account_name');

                                return (
                                    <>
                                        <Grid container spacing={2}>
                                            <Grid xs={12}>
                                                <FormField label='Account Name' htmlFor='account_name'>
                                                    <TextField
                                                        id={'account_name'}
                                                        className={localStyles.cx(localStyles.classes.FormContentWindow)}
                                                        size='small'
                                                        {...register('account_name', { required: { message: 'Required', value: true } })}
                                                        error={!!errors.account_name}
                                                        defaultValue={props.accountToEdit?.account_name ?? ''}
                                                        placeholder={'Enter Account Name or Nickname'}
                                                        helperText={errors.account_name?.message}
                                                    />
                                                </FormField>
                                            </Grid>
                                            <Grid xs={12}>
                                                <FormField label='Payer Account ID' htmlFor='payer_account_id'>
                                                    <TextField
                                                        id={'payer_account_id'}
                                                        className={localStyles.cx(localStyles.classes.FormContentWindow)}
                                                        size='small'
                                                        {...register('payer_account_id', {
                                                            validate: (payer_account_id: string) => {
                                                                if (!payer_account_id.match(/^(0|[1-9]\d*)$|^$/i)) {
                                                                    return 'Payer Account ID should be left empty or only contain digits';
                                                                }
                                                            },
                                                            maxLength: {
                                                                value: 12,
                                                                message: 'Value must be 12 digits',
                                                            },
                                                            minLength: {
                                                                value: 12,
                                                                message: 'Value must be 12 digits',
                                                            },
                                                        })}
                                                        error={!!errors.payer_account_id}
                                                        placeholder={'Enter Payer Account ID'}
                                                        inputProps={{ readOnly: !!props.accountToEdit }}
                                                        defaultValue={props.accountToEdit?.parent_account_id ?? ''}
                                                        helperText={errors.payer_account_id?.message}
                                                    />
                                                </FormField>
                                            </Grid>
                                            <Grid xs={12}>
                                                <FormField label='Account ID' htmlFor='account_id'>
                                                    <TextField
                                                        id={'account_id'}
                                                        className={localStyles.cx(localStyles.classes.FormContentWindow)}
                                                        size='small'
                                                        {...register('account_id', {
                                                            required: { message: 'Required', value: true },
                                                            validate: (account_id: string) => {
                                                                if (!account_id.match(/^(0|[1-9]\d*)$/i)) {
                                                                    return 'Account ID should only contain digits';
                                                                }
                                                            },
                                                            maxLength: {
                                                                value: 12,
                                                                message: 'Value must be 12 digits',
                                                            },
                                                            minLength: {
                                                                value: 12,
                                                                message: 'Value must be 12 digits',
                                                            },
                                                        })}
                                                        inputProps={{ readOnly: !!props.accountToEdit }}
                                                        error={!!errors.account_id}
                                                        defaultValue={props.accountToEdit?.account_id ?? ''}
                                                        placeholder={'Enter Account ID'}
                                                        helperText={errors.account_id?.message}
                                                    />
                                                </FormField>
                                            </Grid>
                                            <Grid xs={12}>
                                                <FormField label='External ID' htmlFor='external_id'>
                                                    <TextField
                                                        id={'external_id'}
                                                        className={localStyles.cx(localStyles.classes.FormContentWindow)}
                                                        size='small'
                                                        {...register('external_id')}
                                                        error={!!errors.external_id}
                                                        placeholder={'Enter External ID'}
                                                        defaultValue={props.accountToEdit?.external_id ?? `vega:${organizationId}`}
                                                        helperText={errors.external_id?.message}
                                                    />
                                                </FormField>
                                            </Grid>
                                            {props.accountToEdit && (
                                                <Grid xs={12} className={localStyles.cx(localStyles.classes.IsEnabledField)}>
                                                    <FormField label='Account Status' htmlFor='enabled'>
                                                        <Stack direction='row' justifyContent='space-between' alignItems='center' spacing={1}>
                                                            <Typography
                                                                children={`The account is ${props.accountToEdit.enabled ? 'enabled' : 'disabled'}`}
                                                            />

                                                            <Switch checked={props.accountToEdit.enabled} size={'small'} />
                                                        </Stack>
                                                    </FormField>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </>
                                );
                            }}
                        </Form>
                        {/*Just adding false in so it will never display*/}
                        {props.accountToEdit === undefined && false && (
                            <Typography className={localStyles.cx(localStyles.classes.FormContentWindow)} variant={'caption'}>
                                Accounts will automatically be tested after creation and there will be a discovery every 30 minutes to search for
                                errors.
                            </Typography>
                        )}
                    </Stack>
                </Stack>
            </DialogContent>

            <Stack
                className={localStyles.cx(localStyles.classes.FormContentWindow)}
                direction={'row'}
                justifyContent='space-between'
                alignItems='center'
                spacing={0}
            >
                <DialogActions className={localStyles.cx(localStyles.classes.DialogActions, localStyles.classes.DeleteButton)}>
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
                <DialogActions className={localStyles.cx(localStyles.classes.DialogActions)}>
                    {props.accountToEdit !== undefined ? (
                        <Button
                            className={commonStyles.cx(commonStyles.classes.LowercaseTextButton)}
                            disableElevation={true}
                            type={'submit'}
                            variant={'contained'}
                            form={'link-aws-account-drawer-form'}
                        >
                            Save Changes
                        </Button>
                    ) : (
                        <Button
                            className={commonStyles.cx(commonStyles.classes.LowercaseTextButton)}
                            disableElevation={true}
                            type={'submit'}
                            variant={'contained'}
                            form={'link-aws-account-drawer-form'}
                        >
                            Link Account
                        </Button>
                    )}
                </DialogActions>
            </Stack>
        </Drawer>
    );
};

const useStyles = makeStyles<ILinkAwsAccountDialogProps>()((theme, props) => ({
    DialogActions: {
        marginRight: '0.3rem',
    },
    CloseButton: {
        float: 'right',
        marginRight: '-1.5rem',
        marginTop: '-1rem',
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
    IntructionList: { listStyleType: 'disc', pl: 1, marginLeft: '1rem' },
    InstructionStep: { display: 'list-item' },
    FormContentWindow: {
        width: '90%',
    },
    TemplateButton: {
        marginTop: '2rem',
    },
    IsEnabledField: {
        marginTop: '1rem',
        width: '90%',
    },
}));

export { LinkAwsAccountDrawer };
