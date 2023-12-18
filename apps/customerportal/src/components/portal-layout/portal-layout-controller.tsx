import {
    GeminiLayout,
    OrganizationId,
    ProfilePhotoUrl,
    ShowSupportForm,
    SnackbarErrorOutput,
    SnackBarOptions,
} from '@vegaplatformui/sharedcomponents';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { RouteUrls } from '../../routes/routeUrls';
import { menuItems } from './menu-items';
import { useKeycloak } from '@react-keycloak-fork/web';
import { authenticationState, menuItemState, pageWrapperMargin, themeState } from '../../recoil/atom';
import { GeminiMenuItem } from '@vegaplatformui/sharedassets';
import React, { useEffect, useState, useMemo } from 'react';
import { sessionTexts } from '@vegaplatformui/utils';
import { useNavigate } from 'react-router-dom';
import { ContactSupportController } from '../contact-support/contact-support-controller';
import { UserSettingApi } from '@vegaplatformui/apis';
import { NotificationController } from '../notifications/notification-controller';
import { IUserSettingBaseRequest } from '@vegaplatformui/models';

type IGeminiLayoutControllerProps = React.PropsWithChildren;
export const PortalLayoutController = ({ children }: IGeminiLayoutControllerProps) => {
    const [theming, setThemeState] = useRecoilState(themeState);
    const [navMargin, setNavMargin] = useRecoilState(pageWrapperMargin);
    const [authenticated, setAuthenticated] = useRecoilState(authenticationState);
    const [selectedMenuItem, setSelectedMenuItem] = useRecoilState<GeminiMenuItem>(menuItemState);
    const [profilePhotoUrl, setProfilePhotoUrl] = useRecoilState(ProfilePhotoUrl);
    const { keycloak } = useKeycloak();
    const [snackbarOptions, setSnackbarOptions] = useRecoilState(SnackBarOptions);
    const [sidebarMenuItems, setSidebarMenuItems] = useState<GeminiMenuItem[]>([]);
    const showSupportForm = useRecoilValue(ShowSupportForm);
    const [isNotNavigate, setIsNotNavigate] = useState(false);
    const setOrganizationId = useSetRecoilState(OrganizationId);
    const navigate = useNavigate();
    const userSettingApi = new UserSettingApi();
    useEffect(() => {
        userSettingApi.token = keycloak.token ?? '';
        userSettingApi
            .getPhoto({ username: keycloak.tokenParsed?.preferred_username })
            .then((response) => {
                setProfilePhotoUrl(response.data.details.key);
            })
            .catch((error) => {
                ('');
            });
        userSettingApi
            .getUser({ username: keycloak.tokenParsed?.preferred_username })
            .then((response) => {
                setOrganizationId(response.data.organization_id ?? '');
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `Failed to get User Info, Organization ID: ${SnackbarErrorOutput(error)}`,
                });
            });
    }, [keycloak.token]);

    useEffect(() => {
        //Handle updating collection and navigating when menu selection changes
        const selectedItem = { ...selectedMenuItem };
        const updatedMenuItems = sidebarMenuItems.map((a) => Object.assign({}, a));

        updatedMenuItems &&
            updatedMenuItems.forEach(function iter(item: GeminiMenuItem) {
                if (item.isSelected) {
                    Object.assign(selectedItem, item);
                }
                Array.isArray(item.subMenu) && item.subMenu.forEach(iter);
            });
        selectedItem && setSelectedMenuItem(selectedItem);
        sessionStorage.setItem(sessionTexts.route, selectedItem.route || sessionStorage.getItem(sessionTexts.route) || RouteUrls.navigator);
        !isNotNavigate && selectedItem && selectedItem.route && navigate(selectedItem.route);
        setIsNotNavigate(false);
    }, [sidebarMenuItems]);

    useEffect(() => {
        //console.log(window.location.pathname);
        if (selectedMenuItem?.route !== window.location.pathname.replace('/', '')) {
            //Handle updating collection and navigating when menu selection changes

            const menuItemsUpdate: GeminiMenuItem[] = sidebarMenuItems.map((a) => Object.assign({}, a));

            menuItemsUpdate &&
                menuItemsUpdate.forEach(function iter(item: GeminiMenuItem) {
                    if (item.route === window.location.pathname.replace('/', '')) {
                        item.isSelected = true;
                    } else {
                        item.isSelected = false;
                    }
                    Array.isArray(item.subMenu) && item.subMenu.forEach(iter);
                });
            setIsNotNavigate(true);
            setSidebarMenuItems([...menuItemsUpdate]);
        }
    }, [window.location.pathname]);

    useEffect(() => {
        //Set selected nav item and route on refresh
        const updatedMenuItems = menuItems.map((a) => Object.assign({}, a));
        const currentRoute = sessionStorage.getItem(sessionTexts.route) || RouteUrls.navigator;

        updatedMenuItems &&
            updatedMenuItems.forEach(function iter(item: GeminiMenuItem) {
                if (item.route === currentRoute) {
                    item.isSelected = true;
                } else {
                    item.isSelected = false;
                }
                Array.isArray(item.subMenu) && item.subMenu.forEach(iter);
            });

        setSidebarMenuItems(updatedMenuItems);
    }, []);

    const onCloseSnackbar = () => {
        setSnackbarOptions({ snackBarProps: {}, alertProps: {}, message: '' });
    };

    return (
        <>
            <GeminiLayout
                keycloak={keycloak}
                logoutUrl={RouteUrls.navigator}
                pageWrapperMargin={navMargin}
                themeState={theming}
                authenticationState={authenticated}
                setNavMargin={setNavMargin}
                setAuthenticated={setAuthenticated}
                setThemeState={setThemeState}
                selectedMenuItem={selectedMenuItem}
                menuItems={sidebarMenuItems}
                userName={keycloak?.idTokenParsed?.name}
                children={children}
                snackbarOptions={snackbarOptions}
                onCloseSnackbar={onCloseSnackbar}
                setSidebarMenuItems={setSidebarMenuItems}
                profilePhotoUrl={profilePhotoUrl}
            />
            <ContactSupportController show={showSupportForm.showSupportForm} />
            <NotificationController />
        </>
    );
};
