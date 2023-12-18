import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Box, PaletteMode, Stack, Toolbar, Typography } from '@mui/material';
import {
    CommonPageHeader,
    CustomAppBar,
    CustomDrawer,
    CustomSnackbar,
    CustomSnackBarOptions,
    ProfilePhotoUrl,
} from '@vegaplatformui/sharedcomponents';
import { SetterOrUpdater, useRecoilValue } from 'recoil';
import { GeminiMenuItem } from '@vegaplatformui/sharedassets';
import Keycloak from 'keycloak-js';
import { LoadingComponent } from '../loading-components/loading-component';
import { CustomErrorBoundary } from '../custom-error-boundary/custom-error-boundary';
import { INotification, INotificationStatusEnum } from '@vegaplatformui/models';

const openDrawerWidth = 274;
const closedDrawerWidth = 88;

export interface IGeminiLayoutProps extends React.PropsWithChildren {
    logoutUrl: string;
    pageWrapperMargin: string;
    themeState: PaletteMode;
    authenticationState: boolean;
    setNavMargin: SetterOrUpdater<string>;
    setAuthenticated: SetterOrUpdater<boolean>;
    setThemeState: SetterOrUpdater<PaletteMode>;
    selectedMenuItem: GeminiMenuItem;
    menuItems: GeminiMenuItem[];
    userName: string | undefined;
    keycloak: Keycloak;
    snackbarOptions: CustomSnackBarOptions;
    onCloseSnackbar: () => void;
    setSidebarMenuItems: React.Dispatch<React.SetStateAction<GeminiMenuItem[]>>;
    profilePhotoUrl: string;
}

const GeminiLayout: React.FC<IGeminiLayoutProps> = (props) => {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(true);
    const commonPageHeader = useRecoilValue(CommonPageHeader);
    const { classes, cx } = useStyles({ props, isDrawerOpen, commonPageHeader });
    return (
        <Box sx={{ display: 'flex', overflow: 'hidden' }}>
            <CustomSnackbar snackbarOptions={props.snackbarOptions} onCloseSnackbar={props.onCloseSnackbar} />
            <CustomAppBar
                themeState={props.themeState}
                selectedMenuItem={props.selectedMenuItem}
                menuItems={props.menuItems}
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
            />
            <CustomDrawer
                selectedMenuItem={props.selectedMenuItem}
                menuItems={props.menuItems}
                setNavMargin={props.setNavMargin}
                keycloak={props.keycloak}
                setAuthenticated={props.setAuthenticated}
                logoutUrl={props.logoutUrl}
                userName={props.userName}
                themeState={props.themeState}
                setThemeState={props.setThemeState}
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
                setSidebarMenuItems={props.setSidebarMenuItems}
                profilePhotoUrl={props.profilePhotoUrl}
            />

            <Box component='main' className={cx(classes.MainBox)}>
                {commonPageHeader && <Box className={cx(classes.CommonPageHeader)}>{commonPageHeader}</Box>}
                <LoadingComponent>
                    <CustomErrorBoundary menuItems={props.menuItems} setSidebarMenuItems={props.setSidebarMenuItems}>
                        <Box className={cx(classes.Container)}>
                            <Box className={cx(classes.ContainerBox)}>{props.children}</Box>
                        </Box>
                    </CustomErrorBoundary>
                </LoadingComponent>
            </Box>
        </Box>
    );
};

interface IGeminiLayoutStyles {
    props: IGeminiLayoutProps;
    isDrawerOpen: boolean;
    commonPageHeader: React.ReactNode;
}

const useStyles = makeStyles<IGeminiLayoutStyles>()((theme, input) => ({
    CommonPageHeader: {
        borderTop: `1px solid ${theme.palette.grey.A200}`,
        position: 'fixed',
        top: '4rem',
        width: `calc(100% - ${input.isDrawerOpen ? openDrawerWidth : closedDrawerWidth}px)`,
        transition: theme.transitions.create(['all'], {
            easing: theme.transitions.easing.sharp,
            duration: input.isDrawerOpen ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
        }),
    },
    Container: {
        marginTop: input.commonPageHeader ? '4rem' : '',
        display: 'flex',
        paddingBottom: '1rem',
        flexDirection: 'column',
        overflowY: 'hidden',
        /**
         * Height set here is the total height of the viewport minus
         * the static sizes of the Appbar and Page header if it is there.
         */
        height: input.commonPageHeader ? 'calc(100vh - 8rem)' : 'calc(100vh - 5rem)',
    },
    MainBox: {
        flexGrow: 1,
        height: 'calc(100vh)',
        overflow: 'auto',
        marginTop: '5rem',
    },
    ContainerBox: {
        overflow: 'auto',
        maxHeight: '100vh',
        paddingLeft: '1rem',
        paddingRight: '1rem',
    },
}));

export { GeminiLayout };
