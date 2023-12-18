import { MenuList } from '@mui/material';
import styled from '@emotion/styled';
import { makeStyles } from '@vegaplatformui/styling';

export const useCommonDrawerStyles = makeStyles<{ isDrawerOpen: boolean; isCollapsible: boolean }>()((theme, { isDrawerOpen, isCollapsible }) => ({
    SelectedMenuItem: {
        '&.Mui-selected': {
            backgroundColor: 'rgba(237, 233, 254, 0.8)',
            color: '#7C3AED',
            '&:hover': {
                backgroundColor: 'rgba(237, 233, 254, 0.9) !important',
            },
            '& .MuiSvgIcon-root': {
                fill: '#7C3AED',
            },
        },
    },
    SelectedSuperMenuItem: {
        '&.Mui-selected': {
            backgroundColor: 'rgba(237, 233, 254, 0.8)',
            color: '#7C3AED',
            '&:hover': {
                backgroundColor: 'rgba(237, 233, 254, 0.9) !important',
            },
            '& .MuiSvgIcon-root': {
                fill: '#7C3AED',
            },
        },
    },
    HideSelectedMenuItem: {
        '&.Mui-selected': {
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            color: theme.palette.grey[400],
            '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.0) !important',
            },
            '& .MuiSvgIcon-root': {
                fill: theme.palette.grey[400],
            },
        },
    },
    SuperMenuItemOpen: {
        width: '100%',
        padding: '10px 16px',
        height: '44px',
    },
    SuperMenuItemClosed: {
        padding: '12px 16px',
    },
    MenuItemHover: {
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    },
    MenuItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        padding: 0,
        marginBottom: '0.25rem',
        '& .MuiSvgIcon-root': {
            fill: theme.palette.grey[400],
        },
    },
    MainMenuItem: {
        width: '100%',
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    SubMenuIcon: {
        maxWidth: '1rem',
        marginRight: '1rem',
        width: '24px',
        height: '24px',
    },
    CommonMenuStyling: {
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
    },
}));
