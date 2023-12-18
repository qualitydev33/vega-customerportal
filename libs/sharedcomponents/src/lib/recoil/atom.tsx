import { atom } from 'recoil';
import React, { useState } from 'react';
import { IQuickSightReportProps } from '../quicksight-reports/quicksight-report';
import { CustomSnackBarOptions } from '../custom-snackbar/custom-snackbar';
import { IDiscoveryDetails, SupportEmailRecipient } from '@vegaplatformui/models';
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid-premium';
import { GridFilterModel } from '@mui/x-data-grid';
import { JsonValue, WebSocketHook } from 'react-use-websocket/dist/lib/types';

export const CommonPageHeader = atom<React.ReactNode>({
    key: 'CommonPageHeader',
    default: undefined,
});

export const OrganizationId = atom<string>({ key: 'OrganizationId', default: '' });

export const ViewPortHeightAndWidth = atom<{ height: number; width: number }>({
    key: 'ReportsHeightAndWidth',
    default: {
        height: 0,
        width: 0,
    },
});

export const QuicksightReportLoading = atom<boolean>({
    key: 'QuicksightReportLoading',
    default: false,
});

export const OrgKeycloakRealm = atom<string>({
    key: 'OrgKeycloakRealm',
    default: undefined,
});

export const ShowSupportForm = atom<{ showSupportForm: boolean; contactType: SupportEmailRecipient }>({
    key: 'ShowSupportForm',
    default: { showSupportForm: false, contactType: SupportEmailRecipient.Support },
});

export const ApplicationError = atom<Error | undefined>({
    key: 'ApplicationError',
    default: undefined,
});

export const SnackBarOptions = atom<CustomSnackBarOptions>({
    key: 'snackBarOptions',
    default: {
        snackBarProps: {},
        alertProps: {},
        message: '',
    },
});

export const ProfilePhotoUrl = atom<string>({
    key: 'ProfilePhotoUrl',
    default: '',
});

export const DiscoveryDetails = atom<IDiscoveryDetails>({
    key: 'DiscoveryDetails',
    default: {
        in_cooldown: false,
        is_discovery: false,
        request_id: '',
        client_id: '',
        datetime_in_30min: 0,
        shouldConnect: false,
    },
});

export const vegaTableControls = atom<IVegaTableControls[]>({
    dangerouslyAllowMutability: true,
    key: 'VegaTableControls',
    default: [],
});

export interface IVegaTableControls {
    key: string;
    value: IVegaTableControl;
}

export interface IVegaTableControl {
    totalRows?: number;
    paginationModel: GridPaginationModel;
    filterModel: GridFilterModel;
    sortModel: GridSortModel;
}

export const defaultVegaTableControl: IVegaTableControl = {
    paginationModel: { page: 0, pageSize: 10 },
    filterModel: { items: [], quickFilterValues: [] },
    sortModel: [],
    totalRows: 0,
};

export const NotificationInboxAnchorElAtom = atom<HTMLElement | null>({
    key: 'NotificationInboxAnchorElAtom',
    default: null,
});
