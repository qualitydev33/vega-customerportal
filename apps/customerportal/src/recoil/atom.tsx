import { PaletteMode } from '@mui/material';
import { atom, selector, selectorFamily } from 'recoil';
import { GeminiMenuItem } from '@vegaplatformui/sharedassets';
import { ActionsApi, VegaApi } from '@vegaplatformui/apis';
import { IVegaContainer } from '@vegaplatformui/models';

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

export const spacesState = atom<IVegaContainer[]>({
    key: 'spacesState',
    default: [],
});
