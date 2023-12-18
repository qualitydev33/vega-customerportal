import React, { useEffect, useState } from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { Box, Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, Stack, Typography } from '@mui/material';
import { CloudProviderAccountsTable } from './cloud-provider-accounts-table';
import { Add, Delete, Refresh } from '@mui/icons-material';
import { CloudProviderSelecterDrawer } from './cloud-provider-selecter-drawer';
import { LinkAwsAccountDrawer } from './link-aws-account-drawer';
import { LinkAzureAccountDrawer } from './link-azure-account-drawer';
import { LinkGcpAccountDrawer } from './link-gcp-account-drawer';
import { FilterTableByProvider, ICloudProviderAccount, LinkAwsAccountForm, LinkAzureAccountForm, LinkGcpAccountForm } from '@vegaplatformui/models';
import { ConfirmDeleteCloudAccountDialog } from './confirm-delete-cloud-account-dialog';
import { grey } from '@mui/material/colors';
import { SetterOrUpdater, useRecoilState, useSetRecoilState } from 'recoil';
import { CustomSnackBarOptions } from '../custom-snackbar/custom-snackbar';
import { ConfirmDeleteCloudAccountsBatchDialog } from './confirm-delete-cloud-accounts-batch-dialog';
import { BulkProviderAccountDrawer } from './bulk-provider-account-drawer';
import { DiscoveryDetails, SnackBarOptions } from '../recoil/atom';
import { LoadingButton } from '@mui/lab';
import { CloudProviderDiscoveryResultsDrawer } from './cloud-provider-discovery-results-drawer';
import Countdown, { zeroPad } from 'react-countdown';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICloudProviderAccountsCardProps {
    cloudProviderAccounts: ICloudProviderAccount[];
    setSelectedAccounts: React.Dispatch<React.SetStateAction<ICloudProviderAccount[]>>;
    selectedAccounts: ICloudProviderAccount[];
    isLoading: boolean;
    onClickDeleteAccount: (account: ICloudProviderAccount) => void;
    onClickDeleteSelectedAccounts: () => void;
    onSubmitLinkAwsAccountForm: (data: LinkAwsAccountForm) => void;
    onSubmitLinkAzureAccountForm: (data: LinkAzureAccountForm) => void;
    onSubmitLinkGcpAccountForm: (data: LinkGcpAccountForm) => void;
    onSubmitEditAwsAccountForm: (data: LinkAwsAccountForm) => void;
    onSubmitEditAzureAccountForm: (data: LinkAzureAccountForm) => void;
    onSubmitEditGcpAccountForm: (data: LinkGcpAccountForm) => void;
    selectedFiles: File[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
    isFilesLoading: boolean;
    onSubmitBulkAccount: (file: File) => void;
    accountToDelete?: ICloudProviderAccount;
    isConfirmDeleteDialogOpen: boolean;
    confirmDeleteAccount: (account: ICloudProviderAccount) => void;
    setAccountToDelete: React.Dispatch<React.SetStateAction<ICloudProviderAccount | undefined>>;
    setIsConfirmDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    accountToEdit?: ICloudProviderAccount;
    setAccountToEdit: React.Dispatch<React.SetStateAction<ICloudProviderAccount | undefined>>;
    getCloudAccountDetails: (internalId: string, cloudAccountId: string) => void;
    onCloseEditDialog: () => void;
    isEditAwsAccountDialogOpen: boolean;
    isEditAzureAccountDialogOpen: boolean;
    isEditGcpAccountDialogOpen: boolean;
    serviceAccountJson: string;
    setServiceAccountJson: React.Dispatch<React.SetStateAction<string>>;
    handleClickSendDiscoveryRequest: (accounts: string[]) => void;
}

const CloudProviderAccountsCard: React.FC<ICloudProviderAccountsCardProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [isLinkNewAccountDialogOpen, setIsLinkNewAccountDialogOpen] = React.useState(false);
    const [isBulkImportProviderDialogOpen, setIsBulkImportProviderDialogOpen] = useState(false);
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
    const [isLinkAwsAccountDialogOpen, setIsLinkAwsAccountDialogOpen] = React.useState(false);
    const [isLinkAzureAccountDialogOpen, setIsLinkedAzureAccountDialogOpen] = React.useState(false);
    const [isLinkGcpAccountDialogOpen, setIsLinkedGcpAccountDialogOpen] = React.useState(false);
    const [tableFilterByProvider, setTableFilterByProvider] = React.useState<FilterTableByProvider>(FilterTableByProvider.All);
    const [discoveryDetails, setDiscoveryDetails] = useRecoilState(DiscoveryDetails);
    const [isDiscoveryErrorDetailOpen, setIsDiscoveryErrorDetailOpen] = useState(false);
    const [selectedAccountWithErrors, setSelectedAccountWithErrors] = useState<ICloudProviderAccount | undefined>(undefined);

    const setSnackbarOptions = useSetRecoilState(SnackBarOptions);

    const onOpenLinkNewAccountDialog = () => {
        setIsLinkNewAccountDialogOpen(true);
    };

    const handleAnchorElCreate = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleAnchorElClose = () => {
        setAnchorEl(null);
    };

    const onCloseLinkNewAccountDialog = () => {
        props.setAccountToEdit(undefined);
        setIsLinkNewAccountDialogOpen(false);
    };

    const onSubmitLinkAwsAccountForm = (data: LinkAwsAccountForm) => {
        props.onSubmitLinkAwsAccountForm(data);
        setIsLinkNewAccountDialogOpen(false);
    };
    const onSubmitLinkAzureAccountForm = (data: LinkAzureAccountForm) => {
        props.onSubmitLinkAzureAccountForm(data);
        setIsLinkNewAccountDialogOpen(false);
    };

    const onSubmitLinkGcpAccountForm = (data: LinkGcpAccountForm) => {
        props.onSubmitLinkGcpAccountForm(data);
        setIsLinkNewAccountDialogOpen(false);
    };

    const onSubmitEditAwsAccountForm = (data: LinkAwsAccountForm) => {
        props.onSubmitEditAwsAccountForm(data);
        setTimeout(() => {
            props.setAccountToEdit(undefined);
        }, 150);
    };
    const onSubmitEditAzureAccountForm = (data: LinkAzureAccountForm) => {
        props.onSubmitEditAzureAccountForm(data);
        setTimeout(() => {
            props.setAccountToEdit(undefined);
        }, 150);
    };

    const onSubmitEditGcpAccountForm = (data: LinkGcpAccountForm) => {
        props.onSubmitEditGcpAccountForm(data);
        setTimeout(() => {
            props.setAccountToEdit(undefined);
            props.setServiceAccountJson('');
        }, 150);
    };

    const onOpenDeleteAccountDialog = (account: ICloudProviderAccount) => {
        props.setIsConfirmDeleteDialogOpen(true);
        props.setAccountToDelete(account);
    };

    const onCloseDeleteAccountDialog = () => {
        props.setAccountToDelete(undefined);
        props.setIsConfirmDeleteDialogOpen(false);
    };

    const onOpenDeleteAccountBatchDialog = () => {
        setIsConfirmDeleteDialogOpen(true);
    };

    const onCloseDeleteAccountBatchDialog = () => {
        setIsConfirmDeleteDialogOpen(false);
    };

    const confirmDeleteAccountsBatch = () => {
        props.onClickDeleteSelectedAccounts();
        onCloseDeleteAccountBatchDialog();
    };

    const confirmDeleteAccount = (account: ICloudProviderAccount) => {
        props.confirmDeleteAccount(account);
        onCloseDeleteAccountDialog();
    };

    const onClickEditAccount = (account: ICloudProviderAccount | undefined) => {
        props.getCloudAccountDetails(account!.id, account!.account_id);
    };

    const onOpenBulkImportProviderDialog = () => {
        setIsBulkImportProviderDialogOpen(true);
    };

    const onClickShowDiscoveryErrorDetails = (account: ICloudProviderAccount) => {
        setIsDiscoveryErrorDetailOpen(true);
        setSelectedAccountWithErrors(account);
    };

    return (
        <>
            <CloudProviderDiscoveryResultsDrawer
                onBackDrawer={() => {
                    setSelectedAccountWithErrors(undefined);
                    setIsDiscoveryErrorDetailOpen(false);
                }}
                test={[
                    'This a test',
                    'This is a second message',
                    'This is a message pertaining to a certain key point of information.',
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eros donec ac odio tempor. Condimentum lacinia quis vel eros donec ac. Nulla at volutpat diam ut venenatis. Dui faucibus in ornare quam viverra orci sagittis. Orci ac auctor augue mauris augue. Eu consequat ac felis donec. Risus pretium quam vulputate dignissim suspendisse. Curabitur gravida arcu ac tortor dignissim convallis. Quis imperdiet massa tincidunt nunc pulvinar sapien. Nibh nisl condimentum id venenatis a condimentum vitae. Mi bibendum neque egestas congue quisque egestas diam in arcu. Tincidunt ornare massa eget egestas. Malesuada nunc vel risus commodo. Tincidunt praesent semper feugiat nibh sed pulvinar proin.',
                ]}
                account={selectedAccountWithErrors}
                isDrawerOpen={isDiscoveryErrorDetailOpen}
            />
            <ConfirmDeleteCloudAccountsBatchDialog
                selectedAccounts={props.selectedAccounts}
                isConfirmDeleteDialogBatchOpen={isConfirmDeleteDialogOpen}
                onCloseConfirmDeleteBatchDialog={onCloseDeleteAccountBatchDialog}
                confirmDeleteAccounts={confirmDeleteAccountsBatch}
            />
            <ConfirmDeleteCloudAccountDialog
                accountToDelete={props.accountToDelete}
                confirmDeleteAccount={confirmDeleteAccount}
                onCloseConfirmDeleteDialog={onCloseDeleteAccountDialog}
                isConfirmDeleteDialogOpen={props.isConfirmDeleteDialogOpen}
            />
            <BulkProviderAccountDrawer
                isDialogOpen={isBulkImportProviderDialogOpen}
                onBackDrawer={() => setIsBulkImportProviderDialogOpen(false)}
                onCloseDialog={() => {
                    setIsBulkImportProviderDialogOpen(false);
                    onCloseLinkNewAccountDialog();
                }}
                selectedFiles={props.selectedFiles}
                setSelectedFiles={props.setSelectedFiles}
                isFilesLoading={props.isFilesLoading}
                onSubmitBulkAccount={props.onSubmitBulkAccount}
                setSnackbarOptions={setSnackbarOptions}
            />
            <CloudProviderSelecterDrawer
                onCloseLinkAwsDialog={() => setIsLinkAwsAccountDialogOpen(false)}
                onSubmitLinkAwsAccountForm={onSubmitLinkAwsAccountForm}
                isDialogOpen={isLinkNewAccountDialogOpen}
                onCloseDialog={onCloseLinkNewAccountDialog}
                onCloseLinkAzureDialog={() => setIsLinkedAzureAccountDialogOpen(false)}
                onSubmitLinkAzureAccountForm={onSubmitLinkAzureAccountForm}
                onCloseLinkGcpDialog={() => setIsLinkedGcpAccountDialogOpen(false)}
                onSubmitLinkGcpAccountForm={onSubmitLinkGcpAccountForm}
                setSnackbarOptions={setSnackbarOptions}
                serviceAccountJson={props.serviceAccountJson}
                setServiceAccountJson={props.setServiceAccountJson}
                onOpenBulkImportProviderDialog={onOpenBulkImportProviderDialog}
            />
            <LinkAwsAccountDrawer
                onBackDrawer={() => {}}
                onCloseDialog={() => props.onCloseEditDialog()}
                isDialogOpen={props.isEditAwsAccountDialogOpen}
                onSubmitLinkAwsAccountForm={onSubmitEditAwsAccountForm}
                accountToEdit={props.accountToEdit}
                setSnackbarOptions={setSnackbarOptions}
                onOpenDeleteAccountDialog={onOpenDeleteAccountDialog}
            />
            <LinkAzureAccountDrawer
                onBackDrawer={() => {}}
                isDialogOpen={props.isEditAzureAccountDialogOpen}
                onCloseDialog={() => props.onCloseEditDialog()}
                onSubmitLinkAzureAccountForm={onSubmitEditAzureAccountForm}
                accountToEdit={props.accountToEdit}
                setSnackbarOptions={setSnackbarOptions}
                onOpenDeleteAccountDialog={onOpenDeleteAccountDialog}
            />
            <LinkGcpAccountDrawer
                onBackDrawer={() => {}}
                isDialogOpen={props.isEditGcpAccountDialogOpen}
                onCloseDialog={() => props.onCloseEditDialog()}
                onSubmitLinkGcpAccountForm={onSubmitEditGcpAccountForm}
                accountToEdit={props.accountToEdit}
                setSnackbarOptions={setSnackbarOptions}
                serviceAccountJson={props.serviceAccountJson}
                setServiceAccountJson={props.setServiceAccountJson}
                onOpenDeleteAccountDialog={onOpenDeleteAccountDialog}
            />
            <Card elevation={0}>
                <CardContent>
                    <Grid spacing={0.5} container direction={'column'}>
                        <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                            <Grid xs={5} item>
                                <Typography className={commonStyles.cx(commonStyles.classes.PageCardTitle)} variant='body1'>
                                    Provider Accounts
                                </Typography>
                            </Grid>
                            <Grid xs={7} item container justifyContent={'flex-end'}>
                                <Stack direction={'row'} spacing={1}>
                                    {props.selectedAccounts.length > 0 && (
                                        <Button
                                            startIcon={<Delete />}
                                            className={cx(classes.AccountButtons, commonStyles.classes.MultipleDeleteButton)}
                                            variant={'contained'}
                                            onClick={onOpenDeleteAccountBatchDialog}
                                            disabled={discoveryDetails.is_discovery}
                                        >
                                            Delete Selected Accounts
                                        </Button>
                                    )}
                                    {discoveryDetails.datetime_in_30min > 0 && (
                                        <Countdown
                                            date={discoveryDetails.datetime_in_30min}
                                            precision={2}
                                            onComplete={() => {
                                                setSnackbarOptions({
                                                    snackBarProps: { open: true, autoHideDuration: 6000 },
                                                    alertProps: { severity: 'info' },
                                                    message: `Resource Discovery Cooldown Complete`,
                                                });
                                                return setDiscoveryDetails({ ...discoveryDetails, in_cooldown: false, datetime_in_30min: 0 });
                                            }}
                                            renderer={({ hours, minutes, seconds, completed }) => {
                                                if (completed) {
                                                    // Render a completed state
                                                    return <></>;
                                                } else {
                                                    // Render a countdown
                                                    return (
                                                        <Stack direction={'row'} justifyContent='center' alignItems='center' spacing={1}>
                                                            <Stack direction='column' justifyContent='flex-start' alignItems='center' spacing={-1}>
                                                                <Typography fontWeight={500} variant={'body1'}>
                                                                    {zeroPad(minutes)}
                                                                </Typography>
                                                                <Typography fontWeight={500} variant={'caption'}>
                                                                    Minutes
                                                                </Typography>
                                                            </Stack>
                                                            <Typography fontWeight={500} variant={'body1'}>
                                                                :
                                                            </Typography>
                                                            <Stack direction='column' justifyContent='flex-start' alignItems='center' spacing={-1}>
                                                                <Typography fontWeight={500} variant={'body1'}>
                                                                    {zeroPad(seconds)}
                                                                </Typography>
                                                                <Typography fontWeight={500} variant={'caption'}>
                                                                    Seconds
                                                                </Typography>
                                                            </Stack>
                                                        </Stack>
                                                    );
                                                }
                                            }}
                                        />
                                    )}
                                    <Stack direction='column' justifyContent='flex-start' alignItems='flex-start' spacing={1}>
                                        <LoadingButton
                                            loading={discoveryDetails.is_discovery}
                                            loadingPosition={'start'}
                                            className={commonStyles.cx(commonStyles.classes.LowercaseTextButton)}
                                            startIcon={<Refresh />}
                                            variant={'outlined'}
                                            disabled={
                                                discoveryDetails.is_discovery ||
                                                discoveryDetails.in_cooldown ||
                                                props.cloudProviderAccounts.length === 0
                                            }
                                            onClick={() => {
                                                const accounts: string[] =
                                                    props.selectedAccounts.length > 1
                                                        ? props.selectedAccounts.map((account) => account.id)
                                                        : props.cloudProviderAccounts.map((account) => account.id);
                                                return props.handleClickSendDiscoveryRequest(accounts);
                                            }}
                                        >
                                            {discoveryDetails.is_discovery
                                                ? 'Running Discovery'
                                                : discoveryDetails.in_cooldown
                                                ? 'Discovery On Cooldown'
                                                : props.selectedAccounts.length > 0
                                                ? 'Refresh Selected'
                                                : 'Refresh All'}
                                        </LoadingButton>
                                    </Stack>
                                    <Button
                                        startIcon={<Add />}
                                        className={cx(classes.AccountButtons)}
                                        variant={'contained'}
                                        // onClick={handleAnchorElCreate}
                                        onClick={() => onOpenLinkNewAccountDialog()}
                                        //endIcon={open ? <ArrowDropUp /> : <ArrowDropDown />}
                                        disabled={props.selectedAccounts.length > 0 || discoveryDetails.is_discovery}
                                    >
                                        Link
                                    </Button>
                                    {/*<Menu id='cloud-accounts-create-menu' anchorEl={anchorEl} open={open} onClose={handleAnchorElClose}>*/}
                                    {/*    <MenuItem*/}
                                    {/*        onClick={() => {*/}
                                    {/*            onOpenLinkNewAccountDialog();*/}
                                    {/*            handleAnchorElClose();*/}
                                    {/*        }}*/}
                                    {/*    >*/}
                                    {/*        Import Single Account*/}
                                    {/*    </MenuItem>*/}
                                    {/*    <MenuItem*/}
                                    {/*        onClick={() => {*/}
                                    {/*            onOpenBulkImportProviderDialog();*/}
                                    {/*            handleAnchorElClose();*/}
                                    {/*        }}*/}
                                    {/*    >*/}
                                    {/*        Bulk Import Accounts*/}
                                    {/*    </MenuItem>*/}
                                    {/*</Menu>*/}
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                            <Grid xs={6} item>
                                {/* TODO may have to change back to: "Manage your provider accounts. Accounts will automatically be tested after creation and there will be a discovery every 30 minutes to search for errors." at some point*/}
                                <Typography variant='body2' className={cx(classes.Subtitle)}>
                                    Link and manage your provider accounts.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Stack direction={'column'} spacing={1}>
                        <FormControl sx={{ m: 1, width: 220 }} size='small'>
                            <InputLabel id='provider_filter_label'>Provider</InputLabel>
                            <Select
                                labelId={'provider_filter_label'}
                                value={tableFilterByProvider}
                                autoWidth
                                onChange={(newValue) => setTableFilterByProvider(newValue.target.value as FilterTableByProvider)}
                                input={<OutlinedInput label='Provider' />}
                            >
                                <MenuItem value={FilterTableByProvider.All}>All</MenuItem>
                                <MenuItem value={FilterTableByProvider.Aws}>AWS</MenuItem>
                                <MenuItem value={FilterTableByProvider.Azure}>Azure</MenuItem>
                                <MenuItem value={FilterTableByProvider.Gcp}>GCP</MenuItem>
                            </Select>
                        </FormControl>
                        <CloudProviderAccountsTable
                            cloudProviderAccounts={props.cloudProviderAccounts}
                            setSelectedAccounts={props.setSelectedAccounts}
                            selectedAccounts={props.selectedAccounts}
                            isLoading={props.isLoading}
                            onClickEditAccount={onClickEditAccount}
                            onOpenDeleteAccountDialog={onOpenDeleteAccountDialog}
                            tableFilterByProvider={tableFilterByProvider}
                            setTableFilterByProvider={setTableFilterByProvider}
                            handleClickSendDiscoveryRequest={props.handleClickSendDiscoveryRequest}
                            onClickShowDiscoveryErrorDetails={onClickShowDiscoveryErrorDetails}
                        />
                    </Stack>
                </CardContent>
            </Card>
        </>
    );
};

const useStyles = makeStyles<ICloudProviderAccountsCardProps>()((theme, props) => ({
    ButtonPlaceHolder: {
        height: '2.25rem',
    },
    Subtitle: {
        paddingBottom: '1rem',
        marginTop: '-1rem',
        color: theme.palette.grey[600],
    },
    Timer: {
        borderBlockColor: theme.palette.primary.light,
    },
    AccountButtons: {
        textTransform: 'none',
    },
}));

export { CloudProviderAccountsCard };
