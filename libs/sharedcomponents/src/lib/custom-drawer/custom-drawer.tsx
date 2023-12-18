import * as React from 'react';
import { useEffect } from 'react';
import { CSSObject, styled, Theme, useTheme } from '@mui/material/styles';
import { Divider, PaletteMode, Stack, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import Box from '@mui/material/Box';
import { MainMenuItem } from './drawer-menu-item/main-menu-item';
import IconButton from '@mui/material/IconButton';
import MuiDrawer from '@mui/material/Drawer';
import { GeminiMenuItem, VegaLogo, VegaLogoShort } from '@vegaplatformui/sharedassets';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import { makeStyles } from '@vegaplatformui/styling';
import { UserProfile } from '../user-profile/user-profile';
import Keycloak from 'keycloak-js';
import { selectNewMenuItem } from '@vegaplatformui/utils';
import { ShowSupportForm } from '../recoil/atom';
import { Help } from '@mui/icons-material';
import { MenuHeading } from './drawer-menu-item/menu-heading';
import { SupportEmailRecipient } from '@vegaplatformui/models';
import { useNavigate } from 'react-router-dom';

const openDrawerWidth = 274;
const closedDrawerWidth = 88;

const openedMixin = (theme: Theme): CSSObject => ({
    width: openDrawerWidth,
    border: 'none',
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),

    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.secondary,
    borderRight: `1px solid ${theme.palette.grey[100]}`,
    overflowX: 'hidden',
    padding: '0 1rem',
    '&::-webkit-scrollbar': {
        width: '0.4em',
    },
    '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#888',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: '#555',
    },
});

const closedMixin = (theme: Theme): CSSObject => ({
    border: 'none',
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    borderRight: `1px solid ${theme.palette.grey[100]}`,
    overflowX: 'hidden',
    width: closedDrawerWidth,
    background: theme.palette.common.white,
    color: theme.palette.text.secondary,
    padding: '0 1rem',
});

const DrawerHeader = styled('div')(({ theme }) => ({
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem 0 ',
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    width: openDrawerWidth,
    flexShrink: 0,
    border: 'none',
    background: theme.palette.common.white,
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}));

export interface IMiniDrawerProps {
    setNavMargin: SetterOrUpdater<string>;
    selectedMenuItem: GeminiMenuItem;
    isDrawerOpen: boolean;
    menuItems: GeminiMenuItem[];
    keycloak: Keycloak;
    setAuthenticated: SetterOrUpdater<boolean>;
    logoutUrl: string;
    userName: string | undefined;
    themeState: PaletteMode;
    setThemeState: SetterOrUpdater<PaletteMode>;
    setSidebarMenuItems: React.Dispatch<React.SetStateAction<GeminiMenuItem[]>>;
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    profilePhotoUrl: string;
}

const CustomDrawer: React.FC<IMiniDrawerProps> = (props) => {
    const theme = useTheme();
    const { classes, cx } = useStyles(props);
    const [showSupportForm, setShowSupportForm] = useRecoilState(ShowSupportForm);
    const navigate = useNavigate();

    useEffect(() => {
        props.setNavMargin(props.isDrawerOpen ? `${openDrawerWidth}px` : `${closedDrawerWidth}px`);
    }, [props.isDrawerOpen, props.setNavMargin]);

    const onSelectMenuItem = (menuItem: GeminiMenuItem) => {
        selectNewMenuItem(props.menuItems, menuItem, props.setSidebarMenuItems);
    };

    // Group menu items by heading with un-grouped items in the first, default group
    const menuGroups = React.useMemo(
        () =>
            props.menuItems.reduce<GeminiMenuItem[][]>(
                (groups, item) => {
                    if (item.heading) {
                        const idx = groups.findIndex((g) => g.length > 0 && g[0].heading === item.heading);
                        if (idx >= 0) {
                            groups[idx].push(item);
                        } else {
                            groups.push([item]);
                        }
                    } else {
                        groups[0].push(item);
                    }
                    return groups;
                },
                [[]]
            ),
        [props.menuItems]
    );

    return (
        <Box data-testid={'custom-drawer'} sx={{ display: 'flex' }}>
            <Drawer variant='permanent' open={props.isDrawerOpen} theme={theme}>
                <DrawerHeader sx={{ marginBottom: '1rem' }}>
                    <IconButton
                        className={cx(props.isDrawerOpen ? classes.VegaIconOpen : classes.VegaIconClosed)}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'inherit',
                            },
                        }}
                        color='inherit'
                        aria-label='open drawer'
                        edge='start'
                        onClick={() => {
                            navigate(props.logoutUrl);
                        }}
                    >
                        {props.isDrawerOpen ? <VegaLogo /> : <VegaLogoShort />}
                    </IconButton>
                </DrawerHeader>
                <Stack className={cx(classes.HeaderMenuContainer)}>
                    {props.menuItems.map(
                        (menuItem) =>
                            menuItem.isHeaderMenuItem && (
                                <MainMenuItem
                                    onSelectMenuItem={onSelectMenuItem}
                                    key={menuItem.title}
                                    isDrawerOpen={props.isDrawerOpen}
                                    setIsDrawerOpen={props.setIsDrawerOpen}
                                    menuItem={menuItem}
                                    theme={theme}
                                />
                            )
                    )}
                </Stack>
                <Stack direction={'column'}>
                    {menuGroups
                        .filter((group) => group.length > 0)
                        .map((group, i) => (
                            <Stack key={i}>
                                {group[0].heading ? <MenuHeading heading={group[0].heading} theme={theme} isDrawerOpen={props.isDrawerOpen} /> : null}
                                <Stack direction={'column'}>
                                    {group.map((item) =>
                                        !item.isFooterMenuItem && !item.isHeaderMenuItem ? (
                                            <MainMenuItem
                                                onSelectMenuItem={onSelectMenuItem}
                                                key={item.title}
                                                isDrawerOpen={props.isDrawerOpen}
                                                setIsDrawerOpen={props.setIsDrawerOpen}
                                                menuItem={item}
                                                theme={theme}
                                            />
                                        ) : null
                                    )}
                                </Stack>
                            </Stack>
                        ))}
                </Stack>
                <Stack className={cx(classes.FooterMenuContainer)}>
                    <Divider className={cx(classes.FooterMenuDivider)} />
                    {props.menuItems.map(
                        (menuItem) =>
                            menuItem.isFooterMenuItem && (
                                <MainMenuItem
                                    onSelectMenuItem={onSelectMenuItem}
                                    key={menuItem.title}
                                    isDrawerOpen={props.isDrawerOpen}
                                    setIsDrawerOpen={props.setIsDrawerOpen}
                                    menuItem={menuItem}
                                    theme={theme}
                                />
                            )
                    )}
                    <MainMenuItem
                        onSelectMenuItem={() => setShowSupportForm({ showSupportForm: true, contactType: SupportEmailRecipient.Support })}
                        isDrawerOpen={props.isDrawerOpen}
                        setIsDrawerOpen={props.setIsDrawerOpen}
                        menuItem={{ icon: Help, isSelected: showSupportForm.showSupportForm, title: 'Help & Support', isFooterMenuItem: true }}
                        theme={theme}
                    />
                    <UserProfile
                        keycloak={props.keycloak}
                        setAuthenticated={props.setAuthenticated}
                        logoutUrl={props.logoutUrl}
                        userName={props.userName}
                        themeState={props.themeState}
                        setThemeState={props.setThemeState}
                        selectedMenuItem={props.selectedMenuItem}
                        isDrawerOpen={props.isDrawerOpen}
                        profilePhotoUrl={props.profilePhotoUrl}
                    />
                </Stack>
            </Drawer>
        </Box>
    );
};

const useStyles = makeStyles<IMiniDrawerProps>()((theme, props) => ({
    VegaIconOpen: { height: '3rem', marginBlock: theme.spacing(0.5) },
    VegaIconClosed: {
        width: '4.75rem',
        height: '3rem',
        display: 'block',
        marginLeft: '.3rem',
    },
    DrawerHeader: {
        marginBottom: '1rem',
    },
    FooterMenuContainer: {
        marginLeft: `${props.isDrawerOpen ? '-1rem' : ''}`,
        marginTop: 'auto',
        marginBottom: '0.5rem',
    },
    HeaderMenuContainer: {
        marginLeft: `${props.isDrawerOpen ? '-1rem' : ''}`,
    },
    FooterMenuDivider: {
        backgroundColor: theme.palette.grey[100],
        marginLeft: `-1rem`,
        marginRight: '-1rem',
        marginBottom: '0.5rem',
    },
}));

export { CustomDrawer };
