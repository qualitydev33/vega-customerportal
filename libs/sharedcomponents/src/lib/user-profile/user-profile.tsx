import React, { useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Avatar, Box, Grid, IconButton, ListItemButton, ListItemIcon, Menu, MenuItem, PaletteMode, Stack, Switch, useTheme } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styled } from '@mui/material/styles';
import { sessionTexts } from '@vegaplatformui/utils';
import Keycloak from 'keycloak-js';
import { SetterOrUpdater } from 'recoil';
import { SelectedLinkType } from '@vegaplatformui/sharedcomponents';
import { GeminiMenuItem } from '@vegaplatformui/sharedassets';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserProfileProps {
    keycloak: Keycloak;
    setAuthenticated: SetterOrUpdater<boolean>;
    logoutUrl: string;
    userName: string | undefined;
    themeState: PaletteMode;
    setThemeState: SetterOrUpdater<PaletteMode>;
    selectedMenuItem: GeminiMenuItem;
    isDrawerOpen: boolean;
    profilePhotoUrl: string;
}

const NavStyledTypo = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
}));

const ProfileMenuItem = styled(MenuItem)(({ theme }) => ({
    '& .MuiSvgIcon-root': {
        fill: theme.palette.action.active,
    },
}));

const ThemeSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase': {
        color: `${theme.palette.secondary.contrastText} !important`,
        '&.Mui-checked': {
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.action.active,
            },
            '&:hover': {
                backgroundColor: 'rgba(0,0,0,0)',
            },
        },
    },
    '&:hover .MuiSwitch-switchBase': {
        backgroundColor: 'rgba(0,0,0,0)',
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.action.active,
    },
}));

const UserProfile: React.FC<IUserProfileProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [anchorProfile, setAnchorProfile] = useState<null | HTMLElement>(null);
    const openProfile = Boolean(anchorProfile);
    const theme = useTheme();
    const profileMenu = Boolean(anchorProfile);

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorProfile(event.currentTarget);
    };
    const handleProfileClose = () => {
        setAnchorProfile(null);
    };

    const onMyProfileClicked = () => {
        console.log('My Profile Clicked');
    };

    const onLogoutClicked = () => {
        props.keycloak.logout();
        // sessionStorage.removeItem(sessionTexts.keycloak);
        sessionStorage.removeItem(sessionTexts.authenticated);
        props.setAuthenticated(false);
        sessionStorage.setItem(sessionTexts.route, props.logoutUrl);
    };

    return (
        <>
            <MenuItem onClick={handleProfileClick}>
                <Stack spacing={props.profilePhotoUrl ? 0.25 : 0} direction={'row'} alignItems={'center'}>
                    {props.profilePhotoUrl ? (
                        <Avatar className={cx(classes.ProfileIcon, classes.ProfileUrlIcon)} src={props.profilePhotoUrl} alt={`profile avatar`} />
                    ) : (
                        <AccountCircleIcon className={cx(classes.ProfileIcon)} />
                    )}
                    {props.isDrawerOpen && (
                        <Stack className={cx(classes.MainMenuStack)} justifyContent={'flex-start'} direction='row' alignItems='center' spacing={6.1}>
                            <Typography className={cx(classes.NameText)} variant='body1'>
                                {props.userName}
                            </Typography>
                            <LogoutIcon fontSize={'small'} />
                        </Stack>
                    )}
                </Stack>
            </MenuItem>
            <Menu
                anchorEl={anchorProfile}
                id='account-menu'
                open={profileMenu}
                onClose={handleProfileClose}
                PaperProps={{
                    elevation: 0,
                    className: cx(classes.ProfileMenuPaper),
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <ProfileMenuItem onClick={() => onLogoutClicked()}>
                    <LogoutIcon />
                    <NavStyledTypo variant='body2' className={cx(classes.ProfileMenuPaperIcons)}>
                        Log Out
                    </NavStyledTypo>
                </ProfileMenuItem>
            </Menu>
        </>
    );
};

const useStyles = makeStyles<IUserProfileProps>()((theme, props) => ({
    NameText: {
        marginRight: 'auto',
    },
    ProfileIcon: {
        minWidth: 0,
        marginRight: props.selectedMenuItem && props.selectedMenuItem.isSelected ? '1rem' : 0,
        justifyContent: 'center',
    },
    ProfileUrlIcon: {
        width: 20,
        height: 20,
        marginLeft: '0.1rem',
    },
    ProfileMenuPaper: {
        overflow: 'visible',
        mt: 1.5,
        padding: '0.25rem',
        borderRadius: '6px',
        boxShadow: '0px 8px 9px -5px rgba(19, 19, 51, 0.2), 0px 15px 22px 2px rgba(19, 19, 51, 0.14), 0px 1px 18px 5px rgba(19, 19, 51, 0.12)',
        color: theme.palette.text.secondary,
        '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.secondary,
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
        },
        '& .MuiList-root': {
            padding: 0,
        },
        '& .MuiMenuItem-root:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    },
    ProfileMenuPaperIcons: { marginLeft: '.5rem' },
    ProfileMenuDivider: {
        margin: '0 !important',
        backgroundColor: theme.palette.mode === 'light' ? '#CECEDF' : '#3A3B84',
    },
    ProfileMenuItem: {
        '&:hover': {
            backgroundColor: 'rgba(0,0,0,0)',
        },
    },
    ProfileMenuTypography: {
        color: theme.palette.mode === 'light' ? theme.palette.text.primary : theme.palette.text.disabled,
    },
    MainMenuStack: {
        width: props.isDrawerOpen ? '11.75rem' : 'auto',
    },
}));

export { UserProfile };
