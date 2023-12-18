import { Card, CardContent, Grid, Stack, Tab, Tabs } from '@mui/material';
import { useKeycloak } from '@react-keycloak-fork/web';
import { UserSettingApi } from '@vegaplatformui/apis';
import {
    IUserSettingAddress,
    IUserSettingAddressPutRequest,
    IUserSettingPassword,
    IUserSettingProfile,
    IUserSettingBaseRequest,
    IUserSettingProfilePutRequest,
    IUserSettingRealmRole,
    IUserSettingRolePostRequest,
    IUserSettingRoleBaseRequest,
    IUserSettingUserPostRequest,
    IUserSettingSSO,
    SSOTypeEnum,
    IUserSettingSSOBaseRequest,
    ISSONameIDPolicyFormat,
    IUserSettingMFAStatusEnum,
} from '@vegaplatformui/models';
import {
    defaultVegaTableControl,
    FrontendFileDownloadBlob,
    IUser,
    MFASettings,
    NotificationSettings,
    PasswordSettings,
    PermissionsSettings,
    ProfilePhotoUrl,
    ProfileSettings,
    SnackbarErrorOutput,
    SnackBarOptions,
    SSOSettings,
    SSOSettingsListCard,
    useErrorHandlingV2,
    UsersSettings,
    vegaTableControls,
} from '@vegaplatformui/sharedcomponents';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { makeStyles } from '@vegaplatformui/styling';
import { capitalizeFirstLetter } from '@vegaplatformui/utils';
import { CloudProviderAccountsController } from '../cloud-provider-accounts/cloud-provider-accounts-controller';
import { RouteUrls } from '../../routes/routeUrls';
import { useLocation } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISettingsControllerProps {}

const settingTabsForAdmin = RouteUrls.settings.tabs;
const settingTabsForUser = RouteUrls.settings.tabs.filter((x) => ['profile', 'password', 'notifications'].includes(x.id));
const defaultProfile = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    image: '',
    username: '',
};
const defaultAddress = {
    street_address: '',
    country: '',
    city: '',
    state: '',
    zip_code: '',
};
const nameIDPolicyFormatList = [
    { label: 'Persistent', value: 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent' },
    { label: 'Transient', value: 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient' },
    { label: 'Email', value: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress' },
    { label: 'Kerberos', value: 'urn:oasis:names:tc:SAML:2.0:nameid-format:kerberos' },
    { label: 'X.509 Subject Name', value: 'urn:oasis:names:tc:SAML:1.1:nameid-format:X509SubjectName' },
    { label: 'Windows Domain Qualified Name', value: 'urn:oasis:names:tc:SAML:1.1:nameid-format:WindowsDomainQualifiedName' },
    { label: 'Unspecified', value: 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified' },
];

const SettingsController: React.FC<ISettingsControllerProps> = (props) => {
    const { keycloak } = useKeycloak();
    const { classes, cx } = useStyles();
    const location = useLocation();
    const setSnackbarOptions = useSetRecoilState(SnackBarOptions);
    const [withErrorHandlingV2] = useErrorHandlingV2();
    const userSettingApi = useMemo(() => {
        const apiInstance = new UserSettingApi();
        apiInstance.token = keycloak.token ?? '';
        return apiInstance;
    }, [keycloak.token]);

    const authUsername = keycloak.tokenParsed?.preferred_username;

    const [settingTabs, setSettingTabs] = useState(settingTabsForUser);
    const [currentTab, setCurrentTab] = useState(settingTabs[0].id);
    const [authUserRoles, setAuthUserRoles] = useState<string[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);
    const [realmRoles, setRealmRoles] = useState<IUserSettingRealmRole[]>([]);
    const [idpList, setIdpList] = useState<IUserSettingSSO[]>([]);
    const [profile, setProfile] = useState<IUserSettingProfile>({ ...defaultProfile, username: authUsername });
    const [, setProfilePhotoUrl] = useRecoilState(ProfilePhotoUrl);
    const [address, setAddress] = useState<IUserSettingAddress>(defaultAddress);
    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [isUsersLoading, setIsUsersLoading] = useState(true);
    const [isRolesLoading, setIsRolesLoading] = useState(true);
    const [, setTableControls] = useRecoilState(vegaTableControls);
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [nameIDPolicyFormatOptions, setNameIDPolicyFormatOptions] = useState<ISSONameIDPolicyFormat[]>(nameIDPolicyFormatList);
    const [mfaStatus, setMFAStatus] = useState<IUserSettingMFAStatusEnum>(IUserSettingMFAStatusEnum.DISABLED);

    const onTabChange = (event: React.ChangeEvent<object>, newValue: string) => {
        setCurrentTab(newValue);
    };

    const getUser = () => {
        withErrorHandlingV2(async () => {
            const reqBody: IUserSettingBaseRequest = {
                username: authUsername,
            };
            const res = await userSettingApi.getUser(reqBody);
            if (res.status !== 200) {
                setIsProfileLoading(false);
                return;
            }
            setProfile((prev) => ({
                ...prev,
                first_name: res.data.given_name,
                last_name: res.data.family_name,
                email: res.data.email,
                phone: res.data.mobile_phone ?? '',
                username: authUsername,
            }));
            setAddress((prev) => ({
                ...prev,
                street_address: res.data.street_address,
                country: res.data.country,
                city: res.data.city,
                state: res.data.state,
                zip_code: res.data.zip_code,
            }));
            getPhoto();
            setIsProfileLoading(false);
        }, 'Failed to retrieve user profile.');
    };
    const getAuthUserRoles = () => {
        // withErrorHandlingV2(async () => {
        //     const res = await userSettingApi.getRealmRoleByUsername({
        //         username: authUsername,
        //     });
        //     if (res.status !== 200) return;
        //     setAuthUserRoles(res.data);
        // }, 'Failed to get the roles.');
        if (keycloak.tokenParsed && keycloak.tokenParsed.realm_access) {
            setAuthUserRoles(keycloak.tokenParsed.realm_access.roles);
        }
    };
    const getPhoto = async () => {
        const reqBody: IUserSettingBaseRequest = {
            username: authUsername,
        };
        const res = await userSettingApi.getPhoto(reqBody);
        if (res.status !== 200) return;
        setProfile((prev) => ({ ...prev, image: res.data.details.key }));
        setProfilePhotoUrl(res.data.details.key);
    };
    const updateUserProfile = (data: IUserSettingProfile) => {
        withErrorHandlingV2(
            async () => {
                const reqBody: IUserSettingProfilePutRequest = {
                    username: data.username,
                    first_name: capitalizeFirstLetter(data.first_name),
                    last_name: capitalizeFirstLetter(data.last_name),
                    email: data.email,
                    mobile_phone: data.phone ?? '',
                };
                const res = await userSettingApi.updateProfile(reqBody);
                if (res.status !== 200) return;
                if (data.username === authUsername) {
                    setProfile((prev) => ({
                        ...prev,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        email: data.email,
                        phone: data.phone ?? '',
                    }));
                }
            },
            'Failed to update the profile.',
            'The profile has been successfully updated.'
        );
    };
    const uploadImg = (file: File) => {
        withErrorHandlingV2(
            async () => {
                const formData = new FormData();
                formData.append('file', file);
                const reqBody: IUserSettingBaseRequest = {
                    username: authUsername,
                };
                const res = await userSettingApi.uploadImg(reqBody, formData);
                if (res.status !== 200) return;
                setProfile((prev) => ({ ...prev, image: res.data.details.key }));
                setProfilePhotoUrl(res.data.details.key);
            },
            'Failed to upload the photo.',
            'Photo upload was successful.'
        );
    };
    const removeProfileImage = () => {
        withErrorHandlingV2(
            async () => {
                await userSettingApi.deleteImg(authUsername);
                setProfile((prev) => ({ ...prev, image: '' }));
                setProfilePhotoUrl('');
            },
            'Failed to delete photo',
            'Photo was successfully deleted'
        );
    };
    const updateUserAddress = (data: IUserSettingAddress) => {
        withErrorHandlingV2(
            async () => {
                const reqBody: IUserSettingAddressPutRequest = {
                    username: authUsername,
                    street_address: data.street_address,
                    country: data.country,
                    city: capitalizeFirstLetter(data.city),
                    state: data.state,
                    zip_code: data.zip_code,
                };
                const res = await userSettingApi.updateAddress(reqBody);
                if (res.status !== 200) return;
                setAddress((prev) => ({
                    ...prev,
                    street_address: data.street_address,
                    country: data.country,
                    city: data.city,
                    state: data.state,
                    zip_code: data.zip_code,
                }));
            },
            'Failed to update the address.',
            'User address has been updated.'
        );
    };
    const updatePassword = (data: IUserSettingPassword) => {
        withErrorHandlingV2(
            async () => {
                const formData = new FormData();
                const reqBody: IUserSettingBaseRequest = {
                    username: authUsername,
                };
                formData.append('new_password', data.new_password);
                formData.append('password', data.current_password);
                const res = await userSettingApi.updatePassword(reqBody, formData);
                if (res.status !== 200) return;
            },
            'Failed to update the password.',
            'Password has been updated.'
        );
    };
    const updateMember = (data: IUser) => {
        const profileData = {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            username: data.username,
        };
        updateUserProfile(profileData);
        updateUserRole(data);
    };
    const updateUserRole = (data: IUser) => {
        const addReqBody = {
            username: data.username,
            realm: keycloak.realm ?? '',
            role_name: data.realm_role.join(','),
        };
        const selectedUser = users.filter((user) => user.username === data.username)[0];
        const deleteReqBody: IUserSettingRoleBaseRequest = {
            username: data.username,
            role_name: selectedUser.realm_role.join(','),
        };
        userSettingApi
            .removeRolesFromUser(deleteReqBody)
            .then((response) => {
                setTimeout(() => {
                    userSettingApi
                        .updateUserRole(addReqBody)
                        .then((response) => {
                            setSnackbarOptions({
                                message: `User role list has been updated.`,
                                snackBarProps: { open: true, autoHideDuration: 3000 },
                                alertProps: { severity: 'info' },
                            });
                            getUsers();
                        })
                        .catch((e) => {
                            setSnackbarOptions({
                                message: `Unable to update roles for user: ${e}`,
                                snackBarProps: { open: true, autoHideDuration: 3000 },
                                alertProps: { severity: 'error' },
                            });
                        });
                }, 300);
            })
            .catch((e) => {
                setSnackbarOptions({
                    message: `Unable to remove roles from user, No role change will occur: ${e}`,
                    snackBarProps: { open: true, autoHideDuration: 3000 },
                    alertProps: { severity: 'error' },
                });
            });
        // withErrorHandlingV2(async () => {
        //     const deleteResponse = await userSettingApi.removeRolesFromUser(deleteReqBody);
        //     if (deleteResponse.status !== 200) return;
        // }, 'You are currently unable to update.');
        // withErrorHandlingV2(
        //     async () => {
        //         const addResponse = await userSettingApi.updateUserRole(addReqBody);
        //         if (addResponse.status !== 200) return;
        //     },
        //     'Failed to update the user role.',
        //     'User role has been updated.'
        // );
        //
        // getUsers();
    };
    const createUser = (data: IUser) => {
        const reqBody: IUserSettingUserPostRequest = {
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            roles: data.realm_role.join(','),
        };
        setIsCreatingUser(true);
        userSettingApi
            .createUser(reqBody)
            .then((response) => {
                setSnackbarOptions({
                    message: 'The user has been successfully created.',
                    snackBarProps: { open: true, autoHideDuration: 3000 },
                    alertProps: { severity: 'info' },
                });
                setIsCreatingUser(false);
                getUsers();
            })
            .catch((error) => {
                setSnackbarOptions({
                    message: `Failed to create the user: ${
                        error.response.data.detail.includes('User exists') ? `The user, ${data.email}, already exists` : error.message
                    }`,
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                });
                setIsCreatingUser(false);
            });
    };
    const deleteUsers = (data: IUser[]) => {
        const requests = data.map((user) => {
            const reqBody: IUserSettingBaseRequest = {
                username: user.email,
            };
            return userSettingApi.deleteUser(reqBody);
        });
        Promise.all(requests)
            .then(() => {
                getUsers();
                setSnackbarOptions({
                    message: 'The users have been successfully deleted.',
                    snackBarProps: { open: true, autoHideDuration: 3000 },
                    alertProps: { severity: 'success' },
                });
            })
            .catch((error) => {
                getUsers();
                setSnackbarOptions({
                    message: data.length > 1 ? 'Some or all users have failed to delete.' : 'Failed to delete user' + SnackbarErrorOutput(error),
                    snackBarProps: { open: true, autoHideDuration: 3000 },
                    alertProps: { severity: 'error' },
                });
            });
    };
    const getUsers = () => {
        withErrorHandlingV2(async () => {
            setIsUsersLoading(true);
            const realm = keycloak.realm ?? '';
            const usersResponse = await userSettingApi.getUsers(realm);

            if (usersResponse.status !== 200) {
                setIsUsersLoading(false);
                return;
            }
            const userData: IUser[] = usersResponse.data.map((resItem: any, idx: number) => {
                return {
                    id: idx,
                    username: resItem.username,
                    first_name: resItem.firstName || '',
                    last_name: resItem.lastName || '',
                    email: resItem.email,
                    realm: realm,
                    dateAdded: new Date(resItem.createdTimestamp).toLocaleDateString('en-CA'),
                    realm_role: resItem.realmRoles,
                    status: resItem.emailVerified,
                };
            });
            setUsers(userData);
            setIsUsersLoading(false);
        }, 'Failed to retrive users.');
    };
    const getRealmRoles = () => {
        withErrorHandlingV2(async () => {
            setIsRolesLoading(true);
            const realm = keycloak.realm || '';
            const res = await userSettingApi.getRealmRoles(realm);
            if (res.status !== 200) {
                setIsRolesLoading(false);
                return;
            }
            const sorted = res.data.sort((a: IUserSettingRealmRole, b: IUserSettingRealmRole) => a.name.localeCompare(b.name));
            setRealmRoles(sorted);
            setIsRolesLoading(false);
        }, 'Failed to retrieve realm roles.');
    };
    const createAndAssignRoleToUsers = async (role_name: string, members: string[]) => {
        const reqBody: IUserSettingRolePostRequest = {
            role_name: role_name,
        };
        withErrorHandlingV2(
            async () => {
                const addResponse = await userSettingApi.createRole(reqBody, authUsername);
                if (addResponse.status !== 200) return;
            },
            'Failed to create user role.',
            'Role has been successfully created.'
        );

        withErrorHandlingV2(async () => {
            const assignResponse = await userSettingApi.assignRoleToUsers(role_name, members);
            if (assignResponse.status !== 200) return;
        }, 'Failed to assign new role.');

        getRealmRoles();
        getUsers();
    };
    const updateRoleAndAssignToUsers = (role_name: string, new_role_name: string, previous_members: string[], members: string[]) => {
        withErrorHandlingV2(async () => {
            const updateRoleResponse = await userSettingApi.updateRoleName(role_name, new_role_name);
            if (updateRoleResponse.status !== 200) return;
        }, 'Role update failed.');

        withErrorHandlingV2(async () => {
            const unassignResponse = await userSettingApi.removeRoleFromUsers(role_name, previous_members);
            if (unassignResponse.status !== 200) return;
        }, 'Failed to unassign role from previous users.');
        withErrorHandlingV2(async () => {
            const assignResponse = await userSettingApi.assignRoleToUsers(new_role_name, members);
            if (assignResponse.status !== 200) return;
        }, 'Failed to assign role to users.');

        getRealmRoles();
        getUsers();
    };
    const deleteRoles = (data: IUserSettingRealmRole[]) => {
        const requests = data.map((role) => {
            const reqBody: IUserSettingRoleBaseRequest = {
                username: '',
                role_name: role.name,
            };
            return userSettingApi.removeRolesFromUser(reqBody);
        });
        Promise.all(requests).then(() => {
            getRealmRoles();
        });
    };
    const getIDPList = () => {
        withErrorHandlingV2(async () => {
            const res = await userSettingApi.getIDPList();
            if (res.status !== 200) return;
            const processedRes = res.data.map((x: any) => {
                return {
                    alias: x.alias,
                    display_name: x.display_name,
                    redirect_uri: x.redirect_uri,
                    provider_id: x.provider_id,
                    xml_metadata: x.xml_metadata,
                    config: x.config,
                };
            });
            setIdpList(processedRes);
        }, 'Failed to retrieve the idp list');
    };
    const createIDP = (data: IUserSettingSSO, type: SSOTypeEnum, byXml: boolean) => {
        withErrorHandlingV2(
            async () => {
                const reqBody: IUserSettingSSOBaseRequest = {
                    display_name: data.display_name,
                    config: data.config,
                };

                if (byXml) {
                    await userSettingApi.importConfigIDP(type, data.xml_metadata);
                } else {
                    if (type === SSOTypeEnum.OPENID) {
                        await userSettingApi.createOpenIdIDP(reqBody);
                    } else {
                        await userSettingApi.createSamlIDP(reqBody);
                    }
                }
                getIDPList();
            },
            'Failed to create new SSO configuration',
            'The new SSO configuration has created successfully'
        );
    };
    const updateIDP = (data: IUserSettingSSO) => {
        withErrorHandlingV2(
            async () => {
                const reqBody: IUserSettingSSOBaseRequest = {
                    display_name: data.display_name,
                    config: data.config,
                };
                let res;
                if (data.provider_id === SSOTypeEnum.OPENID) {
                    res = await userSettingApi.updateOpenIdIDP(data.alias, reqBody);
                } else {
                    res = await userSettingApi.updateSamlIDP(data.alias, reqBody);
                }
                if (res.status !== 200) return;
                getIDPList();
            },
            'Failed to update the SSO Configuration',
            'The SSO has successfully updated'
        );
    };
    const deleteIDP = (alias: string) => {
        withErrorHandlingV2(
            async () => {
                const res = await userSettingApi.deleteIDP(alias);
                if (res.status !== 200) return;
                getIDPList();
            },
            'Failed to delete the SSO Configuration',
            'Deleted successfully'
        );
    };
    const generateXMLMetaData = useCallback((url: string, filename: string) => {
        withErrorHandlingV2(async () => {
            const res = await userSettingApi.generateSSOXML(url);
            const blob = new Blob([res.data], { type: 'text/xml' });
            FrontendFileDownloadBlob(blob, filename);
        }, 'Failed to download the file ' + filename);
    }, []);
    const getMFAStatus = () => {
        withErrorHandlingV2(async () => {
            const res = await userSettingApi.getMFAStatus();
            if (res.status !== 200) return;
            setMFAStatus(res.data.requirement);
        }, 'Failed to get the MFA status');
    };
    const updateMFAStatus = (status: string) => {
        withErrorHandlingV2(
            async () => {
                const res = await userSettingApi.updateMFAStatus(status);
                if (res.status !== 200) return;
                getMFAStatus();
            },
            'Failed to update the MFA status',
            'The MFA has updated successfully'
        );
    };

    useEffect(() => {
        if (location.state) setCurrentTab(location.state.tab);
    }, [location.state]);

    useEffect(() => {
        if (['vega_admin', 'realm_admin', 'manager'].some((x) => authUserRoles.includes(x))) setSettingTabs(settingTabsForAdmin);
    }, [authUserRoles]);

    useEffect(() => {
        if (currentTab === 'profile') {
            getAuthUserRoles();
            getUser();
            // getUsers();
        } else if (['users', 'permissions'].some((item) => item === currentTab)) {
            getUsers();
            getRealmRoles();
        } else if (currentTab === 'sso') {
            getIDPList();
        } else if (currentTab === 'mfa') {
            getMFAStatus();
        }
    }, [currentTab]);

    useEffect(() => {
        setTableControls((controls) => {
            return [
                ...controls,
                {
                    key: 'user-settings-table',
                    value: { ...defaultVegaTableControl },
                },
                {
                    key: 'user-delete-dialog-table',
                    value: { ...defaultVegaTableControl },
                },
                {
                    key: 'role-delete-dialog-table',
                    value: { ...defaultVegaTableControl },
                },
            ];
        });
        return () => {
            setTableControls((controls) => {
                return controls.filter(
                    (control) =>
                        control.key !== 'user-settings-table' &&
                        control.key !== 'user-delete-dialog-table' &&
                        control.key !== 'role-delete-dialog-table'
                );
            });
        };
    }, []);

    return (
        <>
            <Card elevation={0}>
                <CardContent>
                    <Stack direction='column'>
                        <div>
                            <Tabs variant='scrollable' value={currentTab} onChange={onTabChange}>
                                {authUserRoles.length &&
                                    settingTabs.map((currentTab) => <Tab key={currentTab.id} label={currentTab.label} value={currentTab.id} />)}
                            </Tabs>
                        </div>
                        <div className={cx(classes.Tabpanel)}>
                            {currentTab === 'profile' ? (
                                <ProfileSettings
                                    isLoading={isProfileLoading}
                                    profile={profile}
                                    address={address}
                                    onProfileUpdate={updateUserProfile}
                                    onAddressUpdate={updateUserAddress}
                                    onPhotoUpload={(data: File) => uploadImg(data)}
                                    onPhotoRemove={removeProfileImage}
                                />
                            ) : currentTab === 'password' ? (
                                <PasswordSettings onUpdatePassword={updatePassword} />
                            ) : currentTab === 'users' ? (
                                <UsersSettings
                                    isLoading={isUsersLoading}
                                    users={users}
                                    roles={realmRoles}
                                    onInviteUser={createUser}
                                    onUpdateUser={updateMember}
                                    onDeleteUsers={deleteUsers}
                                    isCreatingUser={isCreatingUser}
                                />
                            ) : currentTab === 'permissions' ? (
                                <PermissionsSettings
                                    isLoading={[isUsersLoading, isRolesLoading].some((item) => item === true)}
                                    roles={realmRoles}
                                    users={users}
                                    onAdd={(role_name: string, members: string[]) => createAndAssignRoleToUsers(role_name, members)}
                                    onUpdate={(role_name: string, new_role_name: string, previous_members: string[], members: string[]) =>
                                        updateRoleAndAssignToUsers(role_name, new_role_name, previous_members, members)
                                    }
                                    onDeleteRoles={deleteRoles}
                                />
                            ) : currentTab === 'accounts' ? (
                                <CloudProviderAccountsController />
                            ) : currentTab === 'sso' ? (
                                <SSOSettings nameIDPolicyFormatOptions={nameIDPolicyFormatOptions} onCreate={createIDP} />
                            ) : currentTab === 'notifications' ? (
                                //This will not show since in the settingsTabs the notifications is commented out
                                <NotificationSettings />
                            ) : currentTab === 'mfa' ? (
                                <MFASettings status={mfaStatus} onSubmit={updateMFAStatus} />
                            ) : (
                                <div>Unknown section</div>
                            )}
                        </div>
                    </Stack>
                </CardContent>
            </Card>

            {currentTab === 'sso' && (
                <SSOSettingsListCard
                    nameIDPolicyFormatOptions={nameIDPolicyFormatOptions}
                    idpList={idpList}
                    onUpdate={updateIDP}
                    onDelete={deleteIDP}
                    onGenerateXMLMetaData={generateXMLMetaData}
                />
            )}
        </>
    );
};

const useStyles = makeStyles()((theme) => ({
    Tabpanel: {
        paddingBlock: theme.spacing(2),
    },
}));

export { SettingsController };
