import React, { Dispatch, useReducer } from 'react';
import Keycloak from 'keycloak-js';
import { AxiosResponse } from 'axios';
import { useEffect, useRef } from 'react';
import { GeminiMenuItem } from '@vegaplatformui/sharedassets';
import { styled } from '@mui/material/styles';
import { Button, ButtonProps, Paper, PaperProps, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import { grey } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import dayjs from 'dayjs';
import 'dayjs/plugin/timezone';

export const GenerateKeycloakClient = (config: string): Keycloak => {
    const client = new Keycloak(config);
    return client;
};

export const GenerateRandomString = (length: number): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
};

export type GeminiResponse<T> = Promise<AxiosResponse<T>>;

export function usePrevious(value: any) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export const selectNewMenuItem = (
    menuItems: GeminiMenuItem[],
    menuItemToUpdate: GeminiMenuItem,
    setSidebarMenuItems: React.Dispatch<React.SetStateAction<GeminiMenuItem[]>>
) => {
    //make deep copy to operate on
    const updatedMenuItems = menuItems.map((a) => Object.assign({}, a));

    //replace nested object in menuItems with selected menuItem using recursion
    updatedMenuItems &&
        updatedMenuItems.forEach(function iter(item: GeminiMenuItem) {
            if (item.title === menuItemToUpdate.title) {
                item.isSelected = true;
            } else {
                item.isSelected = false;
            }
            Array.isArray(item.subMenu) && item.subMenu.forEach(iter);
        });

    setSidebarMenuItems([...updatedMenuItems]);
};

export const selectNewMenuItemByRoute = (
    menuItems: GeminiMenuItem[],
    menuItemToUpdateRoute: string,
    setSidebarMenuItems: React.Dispatch<React.SetStateAction<GeminiMenuItem[]>>
) => {
    //make deep copy to operate on
    const updatedMenuItems = menuItems.map((a) => Object.assign({}, a));

    //replace nested object in menuItems with selected menuItem using recursion
    updatedMenuItems &&
        updatedMenuItems.forEach(function iter(item: GeminiMenuItem) {
            if (item.route === menuItemToUpdateRoute) {
                item.isSelected = true;
            } else {
                item.isSelected = false;
            }
            Array.isArray(item.subMenu) && item.subMenu.forEach(iter);
        });

    setSidebarMenuItems([...updatedMenuItems]);
};

export const CancelButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(grey[500]),
    backgroundColor: grey[300],
    '&:hover': {
        backgroundColor: grey[500],
    },
}));

export const StyledIconButton = styled(IconButton)({
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
});

/**
 * Custom hook to update cron value and input value.
 *
 * Cannot use InputRef to update the value because of a change in antd 4.19.0.
 *
 * @param defaultValue - The default value of the input and cron component.
 * @returns - The cron and input values with the dispatch function.
 */
export function useCronReducer(defaultValue: string): [
    {
        inputValue: string;
        cronValue: string;
    },
    Dispatch<{
        type: 'set_cron_value' | 'set_input_value' | 'set_values';
        value: string;
    }>
] {
    const [values, dispatchValues] = useReducer(
        (
            prevValues: {
                inputValue: string;
                cronValue: string;
            },
            action: {
                type: 'set_cron_value' | 'set_input_value' | 'set_values';
                value: string;
            }
        ) => {
            switch (action.type) {
                case 'set_cron_value':
                    return {
                        inputValue: prevValues.inputValue,
                        cronValue: action.value,
                    };
                case 'set_input_value':
                    return {
                        inputValue: action.value,
                        cronValue: prevValues.cronValue,
                    };
                case 'set_values':
                    return {
                        inputValue: action.value,
                        cronValue: action.value,
                    };
            }
        },
        {
            inputValue: defaultValue,
            cronValue: defaultValue,
        }
    );

    return [values, dispatchValues];
}

export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function dateToCron(inputDate: Date, timezone: string) {
    const date = dayjs.tz(inputDate, timezone);
    if (date !== undefined) {
        const minutes = date.tz().minute();
        const hours = date.tz().hour();
        const days = date.tz().date();
        const months = date.tz().month() + 1;
        const dayOfWeek = date.tz().day();

        return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
    }
    return undefined;
}

export function fieldToStr(str: string) {
    return str
        .split('_')
        .map((item) => capitalizeFirstLetter(item))
        .join(' ');
}

export const getDetailsFromAzureId = (
    azureId: string | undefined
): { subscriptionId: string; resourceGroup: string; provider: string; name: string } => {
    if (!azureId) {
        return { subscriptionId: '', resourceGroup: '', provider: '', name: '' };
    } else {
        const azureIdSplit = azureId.split('/');
        return { subscriptionId: azureIdSplit[2], resourceGroup: azureIdSplit[4], provider: azureIdSplit[6], name: azureIdSplit[8] };
    }
};
