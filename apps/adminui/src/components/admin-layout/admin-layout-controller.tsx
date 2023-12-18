import { GeminiLayout, SelectedLinkType } from '@vegaplatformui/sharedcomponents';
import { useRecoilState, useRecoilValue } from 'recoil';
import { authenticationState, menuItemState, pageWrapperMargin, SnackBarOptions, themeState } from '../../recoil/atom';
import { RouteUrls } from '../../routes/routeUrls';
import { menuItems } from './menu-items';
import { useKeycloak } from '@react-keycloak-fork/web';
import { GeminiMenuItem } from '@vegaplatformui/sharedassets';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionTexts } from '@vegaplatformui/utils';

type IGeminiLayoutControllerProps = React.PropsWithChildren;
export const AdminLayoutController = ({ children }: IGeminiLayoutControllerProps) => {
    const [theming, setThemeState] = useRecoilState(themeState);
    const [navMargin, setNavMargin] = useRecoilState(pageWrapperMargin);
    const [authenticated, setAuthenticated] = useRecoilState(authenticationState);
    const [selectedMenuItem, setSelectedMenuItem] = useRecoilState<GeminiMenuItem>(menuItemState);
    const [sidebarMenuItems, setSidebarMenuItems] = useState<GeminiMenuItem[]>([]);
    const keycloak = useKeycloak();
    const [snackbarOptions, setSnackbarOptions] = useRecoilState(SnackBarOptions);
    const navigate = useNavigate();

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
        selectedItem && selectedItem.route && navigate(selectedItem.route);
    }, [sidebarMenuItems]);

    useEffect(() => {
        //Set selected nav item and route on refresh
        const updatedMenuItems = menuItems.map((a) => Object.assign({}, a));
        const currentRoute = sessionStorage.getItem(sessionTexts.route) || RouteUrls.dashboard;

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
        <GeminiLayout
            keycloak={keycloak.keycloak}
            logoutUrl={RouteUrls.landing}
            pageWrapperMargin={navMargin}
            themeState={theming}
            authenticationState={authenticated}
            setNavMargin={setNavMargin}
            setAuthenticated={setAuthenticated}
            setThemeState={setThemeState}
            selectedMenuItem={selectedMenuItem}
            menuItems={sidebarMenuItems}
            userName={keycloak?.keycloak?.idTokenParsed?.name}
            children={children}
            snackbarOptions={snackbarOptions}
            onCloseSnackbar={onCloseSnackbar}
            setSidebarMenuItems={setSidebarMenuItems}
        />
    );
};
