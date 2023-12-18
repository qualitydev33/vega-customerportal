import { PaletteMode } from '@mui/material';
import { atom } from 'recoil';
import { menuItems } from '../components/admin-layout/menu-items';
import { CustomSnackBarOptions, MenuItemState } from '@vegaplatformui/sharedcomponents';
import { GeminiMenuItem } from '@vegaplatformui/sharedassets';

export const themeState = atom<PaletteMode>({
    key: 'themeState',
    default: 'light',
});

export const menuExpandState = atom({
    key: 'menuExpandState',
    default: true,
});

export const isLoading = atom({
    key: 'loading',
    default: false,
});

export const pageWrapperMargin = atom({
    key: 'pageWrapperMargin',
    default: '',
});

export const authenticationState = atom({
    key: 'authenticationState',
    default: false,
});

export const menuItemState = atom<GeminiMenuItem>({
    key: 'menuItemState',
    default: undefined,
});

export const SnackBarOptions = atom<CustomSnackBarOptions>({
    key: 'SnackBarOptions',
    default: {
        snackBarProps: {},
        alertProps: {},
        message: '',
    },
});
