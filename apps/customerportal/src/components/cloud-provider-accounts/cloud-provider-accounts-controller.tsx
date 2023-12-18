import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import {
    CloudProviderAccountsCard,
    DiscoveryDetails,
    SnackbarErrorOutput,
    SnackBarOptions,
    useTableUtilities,
} from '@vegaplatformui/sharedcomponents';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useKeycloak } from '@react-keycloak-fork/web';
import { Stack } from '@mui/material';
import { CloudProviderAccountApi } from '@vegaplatformui/apis';
import {
    DiscoveryEvents,
    ICloudProviderAccount,
    IDiscoverRequest,
    IDiscoveryResponse,
    LinkAwsAccountForm,
    LinkAzureAccountForm,
    LinkGcpAccountForm,
} from '@vegaplatformui/models';
import useWebSocket, { ReadyState } from 'react-use-websocket';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICloudProviderAccountsControllerProps {}

const CloudProviderAccountsController: React.FC<ICloudProviderAccountsControllerProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [accounts, setAccounts] = useState<ICloudProviderAccount[]>([]);
    const setSnackbarOptions = useSetRecoilState(SnackBarOptions);
    const [selectedAccounts, setSelectedAccounts] = useState<ICloudProviderAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [providerFiles, setProviderFiles] = useState<File[]>([]);
    const [isFilesLoading, setIsFilesLoading] = useState(false);
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState<ICloudProviderAccount>();
    const [accountToEdit, setAccountToEdit] = React.useState<ICloudProviderAccount | undefined>(undefined);
    const [isEditAwsAccountDialogOpen, setIsEditAwsAccountDialogOpen] = React.useState(false);
    const [isEditAzureAccountDialogOpen, setIsEditAzureAccountDialogOpen] = React.useState(false);
    const [isEditGcpAccountDialogOpen, setIsEditGcpAccountDialogOpen] = React.useState(false);
    const [serviceAccountJson, setServiceAccountJson] = React.useState<string>(``);
    const [discoveryDetails, setDiscoveryDetails] = useRecoilState(DiscoveryDetails);
    const defaultWebsocketUrl = process.env.NX_WEBSOCKET_URL!;
    const cloudProviderAccountsTableUtilities = useTableUtilities('cloud-provider-accounts-table');
    const { keycloak } = useKeycloak();
    //Not used since the websocket is always connected
    //const [socketUrl, setSocketUrl] = useState(defaultWebsocketUrl);
    //Not used since the websocket is always connected
    // const getSocketUrl = useCallback(() => {
    //     return new Promise((resolve: (value: string) => void) => {
    //         resolve(socketUrl);
    //     });
    // }, [socketUrl]);

    //ToDo I don't think I need this use effect in two places. I just would need to use it at the top level one and it should be fine?
    // useEffect(() => {
    //     switch (keycloak.token) {
    //         case undefined:
    //             return setDiscoveryDetails({ ...discoveryDetails, shouldConnect: false });
    //         default:
    //             return setDiscoveryDetails({ ...discoveryDetails, shouldConnect: true });
    //     }
    // }, [keycloak.token]);

    const { sendJsonMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
        defaultWebsocketUrl,
        {
            // protocols: ['Authorization', `${keycloak.token}`],
            queryParams: {
                token: (defaultWebsocketUrl === process.env.NX_WEBSOCKET_URL) !== undefined ? `${keycloak.token}` : '',
                //client_id: localStorage.getItem('websocket_client_id') ?? 'null',
            }, //retryOnError: false,
            share: true,
            onOpen: (event) => {
                // const clientId = localStorage.getItem('websocket_client_id') ?? null;
                // sendJsonMessage({ event: DiscoveryEvents.NewConnection, data: { client_id: clientId } });
            },
            onMessage: (event) => {
                const data: IDiscoveryResponse = JSON.parse(event.data);
                switch (data.event) {
                    case DiscoveryEvents.ClientDisconnected:
                        setDiscoveryDetails({
                            ...discoveryDetails,
                        });
                        setSnackbarOptions({
                            snackBarProps: { open: true, autoHideDuration: 5000 },
                            alertProps: { severity: 'error' },
                            message: `There Was A Problem With Resource Discovery, The Client Disconnected`,
                        });
                        break;
                    case DiscoveryEvents.AuthenticationFailed:
                        setDiscoveryDetails({
                            ...discoveryDetails,
                            in_cooldown: false,
                            is_discovery: false,
                            request_id: '',
                            client_id: '',
                            datetime_in_30min: 0,
                        });
                        setSnackbarOptions({
                            snackBarProps: { open: true, autoHideDuration: 5000 },
                            alertProps: { severity: 'error' },
                            message: `There Was A Problem With Resource Discovery, Authentication Failed`,
                        });
                        break;
                    case DiscoveryEvents.ClientConnected:
                        //localStorage.setItem('websocket_client_id', JSON.stringify(data.data.client_id!));
                        setDiscoveryDetails({ ...discoveryDetails, client_id: data.data.client_id! });
                        break;
                    case DiscoveryEvents.DiscoveryInProgress:
                        setDiscoveryDetails({ ...discoveryDetails, is_discovery: true });
                        setSnackbarOptions({
                            snackBarProps: { open: true, autoHideDuration: 5000 },
                            alertProps: { severity: 'info' },
                            message: `Resource Discovery Currently In Progress`,
                        });
                        break;
                    case DiscoveryEvents.DiscoveryStarted:
                        setDiscoveryDetails({ ...discoveryDetails, is_discovery: true, request_id: data.data.request_id! });
                        setSnackbarOptions({
                            snackBarProps: { open: true, autoHideDuration: 5000 },
                            alertProps: { severity: 'info' },
                            message: `Resource Discovery Started`,
                        });
                        break;
                    case DiscoveryEvents.DiscoveryRequestFailed:
                        setDiscoveryDetails({ ...discoveryDetails, is_discovery: false, request_id: '' });
                        setSnackbarOptions({
                            snackBarProps: { open: true, autoHideDuration: 5000 },
                            alertProps: { severity: 'error' },
                            message: `Resource Discovery Request Failed`,
                        });
                        break;
                    case DiscoveryEvents.DiscoveryComplete:
                        setDiscoveryDetails({ ...discoveryDetails, is_discovery: false, request_id: '' });
                        setSnackbarOptions({
                            snackBarProps: { open: true, autoHideDuration: 5000 },
                            alertProps: { severity: 'info' },
                            message: `Resource Discovery Complete`,
                        });
                        loadData('*', '', 'id');
                        break;
                    case DiscoveryEvents.DiscoveryCompleteWithFailures:
                        setDiscoveryDetails({ ...discoveryDetails, is_discovery: false, request_id: '' });
                        setSnackbarOptions({
                            snackBarProps: { open: true, autoHideDuration: 5000 },
                            alertProps: { severity: 'warning' },
                            message: `Resource Discovery Complete With Errors`,
                        });
                        loadData('*', '', 'id');
                        break;
                    case DiscoveryEvents.DiscoveryCooldown:
                        setDiscoveryDetails({
                            ...discoveryDetails,
                            in_cooldown: true,
                            datetime_in_30min:
                                data.data.cooldown_time_remaining !== undefined
                                    ? //The message sends back the number of seconds left in the cooldown so I have to get the current timestamp and add the milliseconds left
                                      Date.now() + Number(data.data.cooldown_time_remaining) * 1000
                                    : Date.now() + 30 * 60000, // Date.parse(data.data.cooldown_time_remaining * 1000 ?? new Date(Date.now() + 30 * 60000).toString()),
                        });
                        setSnackbarOptions({
                            snackBarProps: { open: true, autoHideDuration: 5000 },
                            alertProps: { severity: 'warning' },
                            message: `Discovery Has Ran Recently, Please Wait To Run Again`,
                        });
                        break;
                    default:
                        break;
                }
            },
            onClose: (event) => {
                setDiscoveryDetails({
                    ...discoveryDetails,
                    in_cooldown: false,
                    is_discovery: false,
                    request_id: '',
                    client_id: '',
                    datetime_in_30min: 0,
                });
            },
            onError: (e) => {
                setDiscoveryDetails({ ...discoveryDetails, is_discovery: false, request_id: '' });
            },
            shouldReconnect: (closeEvent) => {
                return true;
            },
        },
        discoveryDetails.shouldConnect
    );
    const cloudAccountApi = new CloudProviderAccountApi();
    cloudAccountApi.token = keycloak.token ?? '';

    const handleClickSendDiscoveryRequest = (accountIds: string[]) => {
        // setDiscoveryDetails({
        //     ...discoveryDetails,
        //     in_cooldown: true,
        //     datetime_in_30min: Date.now() + 30 * 60000,
        // });

        const discoveryRequest: IDiscoverRequest = {
            event: DiscoveryEvents.RequestDiscovery,
            data: { accounts: accountIds },
        };
        sendJsonMessage(discoveryRequest);
    };

    const loadData = (fields: string, filter: string, ordering: string) => {
        if (cloudProviderAccountsTableUtilities.currentTableControl !== undefined) {
            setIsLoading(true);
            cloudAccountApi
                .loadCloudAccounts({
                    fields: fields,
                    filter: filter,
                    //filter: JSON.stringify(cloudProviderAccountsTableUtilities.currentTableControl?.filterModel.items,
                    ordering: ordering,
                    page: cloudProviderAccountsTableUtilities.currentTableControl.paginationModel.page,
                    size: cloudProviderAccountsTableUtilities.currentTableControl.paginationModel.pageSize,
                })
                .then((response) => {
                    setAccounts(response?.data);
                })
                .catch((error) => {
                    setSnackbarOptions({
                        snackBarProps: { open: true, autoHideDuration: 6000 },
                        alertProps: { severity: 'error' },
                        message: `There was a problem loading the data: ${SnackbarErrorOutput(error)}`,
                    });
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const getCloudAccountDetails = (internalId: string, cloudAccountId: string) => {
        cloudAccountApi
            .getCloudAccount({ id: internalId })
            .then((response) => {
                setAccountToEdit(response?.data);
                setServiceAccountJson(response.data.secret_json ?? ``);
                onEditDialogOpen(response?.data);
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem getting cloud provider account details for ${cloudAccountId}: ${SnackbarErrorOutput(error)}`,
                });
                setAccountToEdit(undefined);
            });
    };

    useEffect(() => {
        loadData('*', '', 'id');
    }, [
        cloudProviderAccountsTableUtilities.currentTableControl?.paginationModel,
        cloudProviderAccountsTableUtilities.currentTableControl?.sortModel,
        cloudProviderAccountsTableUtilities.currentTableControl?.filterModel,
    ]);

    const onClickDeleteAccount = (account: ICloudProviderAccount) => {
        cloudAccountApi
            .deleteCloudAccount({ id: account.id })
            .then((response) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: `Successfully deleted ${account.account_id}`,
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem deleting the cloud account (${account.account_id}): ` + SnackbarErrorOutput(error),
                });
                setIsLoading(false);
            })
            .finally(() => {
                loadData('*', '', 'id');
            });
    };

    const onClickDeleteSelectedAccounts = () => {
        const selectedAccountIds = selectedAccounts.map((selectedAccount) => selectedAccount.id);
        cloudAccountApi
            .deleteCloudAccountBatch({ ids: selectedAccountIds })
            .then(() => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: `Successfully deleted ${selectedAccountIds.length} accounts`,
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem deleting the accounts: ${SnackbarErrorOutput(error)}`,
                });
                setIsLoading(false);
            })
            .finally(() => {
                loadData('*', '', 'id');
            });
    };

    const onSubmitLinkAwsAccountForm = (data: LinkAwsAccountForm) => {
        cloudAccountApi
            .createCloudAccount({
                account_id: data.account_id,
                account_name: data.account_name,
                provider_str: 'AWS',
                enabled: true,
                parent_account_id: data.payer_account_id ? data.payer_account_id : null,
                external_id: data.external_id,
            })
            .then((response) => {
                loadData('*', '', 'id');
                //handleClickSendDiscoveryRequest(response.data.id);
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: 'Successfully created cloud account',
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem creating the cloud account: ${SnackbarErrorOutput(error)}`,
                });
                setIsLoading(false);
            });
    };

    const onSubmitLinkAzureAccountForm = (data: LinkAzureAccountForm) => {
        cloudAccountApi
            .createCloudAccount({
                account_id: data.subscriptionId,
                account_name: data.subscription,
                provider_str: 'AZURE',
                enabled: true,
                parent_account_id: null,
                secret_json: `{"activeDirectoryEndpointUrl":"https://login.microsoftonline.com","resourceManagerEndpointUrl":"https://management.azure.com/","activeDirectoryGraphResourceId":"https://graph.windows.net/","sqlManagementEndpointUrl":"https://management.core.windows.net:8443/","galleryEndpointUrl":"https://gallery.azure.com/","managementEndpointUrl":"https://management.core.windows.net/","vegacustomername":"${keycloak.realm}","subscriptionId":"${data.subscriptionId}","clientId":"${data.clientId}","clientSecret":"${data.clientSecret}","tenantId":"${data.tenantId}"}`,
            })
            .then(() => {
                //handleClickSendDiscoveryRequest(response.data.id);
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: 'Successfully created cloud account',
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem creating the cloud account: ${SnackbarErrorOutput(error)}`,
                });
                setIsLoading(false);
            })
            .finally(() => {
                loadData('*', '', 'id');
            });
    };

    const onSubmitLinkGcpAccountForm = (data: LinkGcpAccountForm) => {
        cloudAccountApi
            .createCloudAccount({
                account_id: data && JSON.parse(data.service_account).project_id,
                account_name: data.project_name,
                provider_str: 'GCP',
                enabled: true,
                parent_account_id: null,
                secret_json: data.service_account,
            })
            .then(() => {
                //handleClickSendDiscoveryRequest(response.data.id);
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: 'Successfully created cloud account',
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem creating the cloud account: ${SnackbarErrorOutput(error)}`,
                });
                setIsLoading(false);
            })
            .finally(() => {
                loadData('*', '', 'id');
            });
    };

    const onSubmitEditAwsAccountForm = (data: LinkAwsAccountForm) => {
        cloudAccountApi
            .updateCloudAccount({
                id: accountToEdit?.id,
                account_id: data.account_id,
                account_name: data.account_name,
                provider_str: 'AWS',
                enabled: accountToEdit!.enabled,
                created_at: accountToEdit!.created_at,
                created_by: accountToEdit!.created_by,
                parent_account_id: data.payer_account_id ? data.payer_account_id : null,
                external_id: data.external_id,
            })
            .then(() => {
                //handleClickSendDiscoveryRequest(response.data.id);
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: 'Successfully edited cloud account',
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem creating the cloud account: ${SnackbarErrorOutput(error)}`,
                });
                setIsLoading(false);
            })
            .finally(() => {
                loadData('*', '', 'id');
            });
    };
    const onSubmitEditAzureAccountForm = (data: LinkAzureAccountForm) => {
        cloudAccountApi
            .updateCloudAccount({
                id: accountToEdit?.id,
                account_id: data.subscriptionId,
                account_name: data.subscription,
                provider_str: 'AZURE',
                enabled: accountToEdit!.enabled,
                created_at: accountToEdit!.created_at,
                created_by: accountToEdit!.created_by,
                parent_account_id: null,
                secret_json: `{"activeDirectoryEndpointUrl":"https://login.microsoftonline.com","resourceManagerEndpointUrl":"https://management.azure.com/","activeDirectoryGraphResourceId":"https://graph.windows.net/","sqlManagementEndpointUrl":"https://management.core.windows.net:8443/","galleryEndpointUrl":"https://gallery.azure.com/","managementEndpointUrl":"https://management.core.windows.net/","vegacustomername":"${keycloak.realm}","subscriptionId":"${data.subscriptionId}","clientId":"${data.clientId}","clientSecret":"${data.clientSecret}","tenantId":"${data.tenantId}"}`,
            })
            .then(() => {
                //handleClickSendDiscoveryRequest(response.data.id);
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: 'Successfully edited cloud account',
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem creating the cloud account: ${SnackbarErrorOutput(error)}`,
                });
                setIsLoading(false);
            })
            .finally(() => {
                loadData('*', '', 'id');
            });
    };

    const onSubmitEditGcpAccountForm = (data: LinkGcpAccountForm) => {
        cloudAccountApi
            .updateCloudAccount({
                id: accountToEdit?.id,
                account_id: data && JSON.parse(data.service_account)?.project_id,
                account_name: data.project_name,
                provider_str: 'GCP',
                enabled: accountToEdit!.enabled,
                created_at: accountToEdit!.created_at,
                created_by: accountToEdit!.created_by,
                parent_account_id: accountToEdit?.parent_account_id ? accountToEdit?.parent_account_id : null,
                secret_json: data.service_account,
            })
            .then(() => {
                //handleClickSendDiscoveryRequest(response.data.id);
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: 'Successfully edited cloud account',
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem creating the cloud account: ${SnackbarErrorOutput(error)}`,
                });
                setIsLoading(false);
            })
            .finally(() => {
                loadData('*', '', 'id');
            });
    };

    const onSubmitBulkAccount = (file: Blob) => {
        setIsLoading(true);
        cloudAccountApi
            .createCloudAccounts({ file: file })
            .then(() => {
                //handleClickSendDiscoveryRequest(response.data.map((account) => account.id));
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: 'Successfully created the accounts',
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem creating the cloud accounts: ${SnackbarErrorOutput(error)}`,
                });
            })
            .finally(() => {
                setIsLoading(false);
                setProviderFiles([]);
                loadData('*', '', 'id');
            });
    };

    const onEditDialogOpen = (account: ICloudProviderAccount | undefined) => {
        switch (account?.provider_str.toLowerCase()) {
            case 'aws':
                setIsEditAwsAccountDialogOpen(true);
                break;
            case 'azure':
                setIsEditAzureAccountDialogOpen(true);
                break;
            case 'gcp':
                setIsEditGcpAccountDialogOpen(true);
                break;
        }
    };

    const onCloseEditDialog = () => {
        switch (accountToEdit?.provider_str.toLowerCase()) {
            case 'aws':
                setIsEditAwsAccountDialogOpen(false);
                break;
            case 'azure':
                setIsEditAzureAccountDialogOpen(false);
                break;
            case 'gcp':
                setIsEditGcpAccountDialogOpen(false);
                break;
        }
        setTimeout(() => {
            setAccountToEdit(undefined);
            setServiceAccountJson(``);
        }, 150);
    };

    return (
        <Stack direction={'column'} spacing={1}>
            <CloudProviderAccountsCard
                getCloudAccountDetails={getCloudAccountDetails}
                accountToEdit={accountToEdit}
                setAccountToEdit={setAccountToEdit}
                setSelectedFiles={setProviderFiles}
                selectedFiles={providerFiles}
                isFilesLoading={isFilesLoading}
                onSubmitBulkAccount={onSubmitBulkAccount}
                selectedAccounts={selectedAccounts}
                cloudProviderAccounts={accounts}
                setSelectedAccounts={setSelectedAccounts}
                isLoading={isLoading}
                onClickDeleteAccount={onClickDeleteAccount}
                onClickDeleteSelectedAccounts={onClickDeleteSelectedAccounts}
                onSubmitLinkAwsAccountForm={onSubmitLinkAwsAccountForm}
                onSubmitLinkAzureAccountForm={onSubmitLinkAzureAccountForm}
                onSubmitLinkGcpAccountForm={onSubmitLinkGcpAccountForm}
                onSubmitEditAwsAccountForm={onSubmitEditAwsAccountForm}
                onSubmitEditAzureAccountForm={onSubmitEditAzureAccountForm}
                onSubmitEditGcpAccountForm={onSubmitEditGcpAccountForm}
                accountToDelete={accountToDelete}
                confirmDeleteAccount={onClickDeleteAccount}
                setIsConfirmDeleteDialogOpen={setIsConfirmDeleteDialogOpen}
                isConfirmDeleteDialogOpen={isConfirmDeleteDialogOpen}
                setAccountToDelete={setAccountToDelete}
                onCloseEditDialog={onCloseEditDialog}
                isEditAwsAccountDialogOpen={isEditAwsAccountDialogOpen}
                isEditAzureAccountDialogOpen={isEditAzureAccountDialogOpen}
                isEditGcpAccountDialogOpen={isEditGcpAccountDialogOpen}
                serviceAccountJson={serviceAccountJson}
                setServiceAccountJson={setServiceAccountJson}
                handleClickSendDiscoveryRequest={handleClickSendDiscoveryRequest}
            />
        </Stack>
    );
};

const useStyles = makeStyles<ICloudProviderAccountsControllerProps>()((theme, props) => ({}));

export { CloudProviderAccountsController };
