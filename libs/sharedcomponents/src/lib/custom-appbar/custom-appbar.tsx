import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar/AppBar';
import { IconButton, PaletteMode, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { NotificationInboxAnchorElAtom, StyledToolTip } from '@vegaplatformui/sharedcomponents';
import Toolbar from '@mui/material/Toolbar';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import { ChevronLeft, ChevronRight, Notifications, ReportProblem, TurnedIn } from '@mui/icons-material';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { GeminiMenuItem } from '@vegaplatformui/sharedassets';
import { INotification, INotificationStatusEnum } from '@vegaplatformui/models';
import { NotificationsAPI } from '@vegaplatformui/apis';
import { useKeycloak } from '@react-keycloak-fork/web';

//ToDo how to centralize these values?
const openDrawerWidth = 274;
const closedDrawerWidth = 88;

export interface ICustomAppBarProps {
    selectedMenuItem: GeminiMenuItem;
    menuItems: GeminiMenuItem[];
    themeState: PaletteMode;
    isDrawerOpen: boolean;
    setIsDrawerOpen: SetterOrUpdater<boolean>;
}

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    background: theme.palette.background.default,
    boxShadow: 'none',

    ...(open
        ? {
              marginLeft: openDrawerWidth,
              width: `calc(100% - ${openDrawerWidth}px)`,
              transition: theme.transitions.create(['all'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
              }),
          }
        : {
              marginLeft: closedDrawerWidth,
              width: `calc(100% - ${closedDrawerWidth}px)`,
              transition: theme.transitions.create(['all'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
              }),
          }),
}));

const StyledIconButton = styled(IconButton)({
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
});

const NavToolBar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
}));

const CircularIconButton = styled(IconButton)(({ theme }) => ({
    height: '1.75rem',
    width: '1.75rem',
    backgroundColor: theme.palette.common.white,
    borderRadius: '16px',
    boxShadow: theme.shadows[2],
    '&:hover': {
        backgroundColor: theme.palette.grey.A200,
    },
}));

const CustomAppBar: React.FC<ICustomAppBarProps> = (props) => {
    const theme = useTheme();
    const { cx, classes } = useStyles(props);
    const commonStyles = useCommonStyles();

    const [notificationInboxAnchorEl, setNotificationInboxAnchorEl] = useRecoilState(NotificationInboxAnchorElAtom);

    const handleDrawer = () => {
        props.setIsDrawerOpen(!props.isDrawerOpen);
    };
    return (
        <>
            <AppBar position='fixed' open={props.isDrawerOpen} theme={theme}>
                <NavToolBar className={cx(classes.NavToolBar)}>
                    <Stack spacing={1} direction={'row'} className={cx(classes.SidebarControl)}>
                        <CircularIconButton onClick={handleDrawer}>
                            {props.isDrawerOpen ? (
                                <StyledToolTip key={'minimize'} arrow={true} title={'Minimise sidebar'}>
                                    <ChevronLeft className={cx(classes.IconFillBlack)} />
                                </StyledToolTip>
                            ) : (
                                <StyledToolTip key={'expand'} arrow={true} title={'Expand sidebar'}>
                                    <ChevronRight className={cx(classes.IconFillBlack)} />
                                </StyledToolTip>
                            )}
                        </CircularIconButton>
                        <Stack alignItems={'center'} spacing={1} direction={'row'}>
                            {props.selectedMenuItem && props.selectedMenuItem.icon && (
                                <props.selectedMenuItem.icon data-testid={'page-icon'} className={cx(classes.IconFillBlack)} />
                            )}
                            <Typography data-testid={'page-title'} variant={'h6'} className={cx(classes.LocationText)}>
                                {props.selectedMenuItem && props.selectedMenuItem.title}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack direction={'row'} spacing={1}>
                        {/*<StyledToolTip arrow={true} title={'Known issues'}>*/}
                        {/*    <IconButton*/}
                        {/*        role={'link'}*/}
                        {/*        onClick={() => {*/}
                        {/*            window.open(*/}
                        {/*                'https://vegacloud-my.sharepoint.com/:x:/g/personal/brent_vegacloud_io/Ef1MDflQpAtMm9I4mOQZD_wB_fpkEJpV2GTvXq0Bg7TLfw?e=SluXBH'*/}
                        {/*            );*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        <TurnedIn />*/}
                        {/*    </IconButton>*/}
                        {/*</StyledToolTip>*/}
                        <StyledToolTip arrow={true} title={'Click here to view your notifications and stay up-to-date with important updates.'}>
                            <IconButton onClick={(evt) => setNotificationInboxAnchorEl(evt.currentTarget)}>
                                <Notifications />
                            </IconButton>
                        </StyledToolTip>
                    </Stack>
                </NavToolBar>
            </AppBar>
        </>
    );
};

const useStyles = makeStyles<ICustomAppBarProps>()((theme, props) => ({
    SidebarControl: { marginLeft: '-2.5rem' },
    IconFillBlack: {
        fill: props.themeState === 'light' ? theme.palette.text.primary : theme.palette.text.secondary,
    },
    LocationText: { color: props.themeState === 'light' ? theme.palette.text.primary : theme.palette.text.secondary },
    TitleText: {
        marginTop: '-4.5rem',
    },
    NavToolBar: {
        borderBottom: `1px solid ${theme.palette.grey[100]}`,
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.background.paper : 'rgba(0,0,0,0)',
    },
}));

export { CustomAppBar };
