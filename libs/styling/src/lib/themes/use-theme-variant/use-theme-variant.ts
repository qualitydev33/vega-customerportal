import { GeminiThemeType } from '../geminiThemeType';
import createPalette from '@mui/material/styles/createPalette';
import createTypography from '@mui/material/styles/createTypography';

export interface UseLightPalette {
    theme: GeminiThemeType;
}

// ToDo seperate out these variants further
export function useThemeVariant(mode: string): UseLightPalette {
    const lightPalette = createPalette({
        mode: 'light',
        common: {
            black: '#131333',
            white: '#FFFFFF',
        },
        primary: {
            main: '#7C3AED',
            light: '#a78bfa',
            dark: '#6d28d9',
            contrastText: '#F7F5FE',
        },
        secondary: {
            main: '#1A1B60',
            light: '#272987',
            dark: '#0D0E30',
            contrastText: '#F1F3F9',
        },
        error: {
            main: '#DA4167',
            light: '#E47792',
            dark: '#AA2244',
            contrastText: '#F1F3F9',
        },
        warning: {
            main: '#FAB616',
            light: '#FCCD5F',
            dark: '#DC9B04',
            contrastText: '#131333',
        },
        info: {
            main: '#00AADF',
            light: '#1FCBFF',
            dark: '#008DB8',
            contrastText: '#F1F3F9',
        },
        success: {
            main: '#57A773',
            light: '#87C09B',
            dark: '#3F7853',
            contrastText: '#F1F3F9',
        },
        grey: {
            50: '#F1F3F9',
            100: '#DEDEE3',
            200: '#BCBCC7',
            300: '#8E8EA0',
            400: '#69697F',
            500: '#5A5A72',
            600: '#494A64',
            700: '#373854',
            800: '#232443',
            900: '#131333',
        },
        text: {
            primary: '#131333',
            secondary: '#55566C',
            disabled: 'rgba(26, 27, 96, 0.28)',
        },
        background: {
            paper: '#FFFFFF',
            default: '#F1F3F9',
        },
        action: {
            active: 'rgba(26, 27, 96, 0.54)',
            hover: 'rgba(19, 19, 51, 0.04)',
            hoverOpacity: 0.04,
            selected: 'rgba(90, 90, 114, 0.08)',
            selectedOpacity: 0.08,
            disabled: 'rgba(19, 19, 51, 0.26)',
            disabledBackground: 'rgba(19, 19, 51, 0.12)',
            disabledOpacity: 0.38,
            focus: 'rgba(19, 19, 51, 0.12)',
            focusOpacity: 0.12,
            activatedOpacity: 0.12,
        },
    });

    const lightTheme = {
        mode: mode,
        palette: lightPalette,
        shadows: [
            'none',
            '0px 3px 5px -1px rgba(19,19,51,0.2),0px 6px 10px 0px rgba(19,19,51,0.14),0px 1px 18px 0px rgba(19,19,51,0.12)',
            '0px 8px 9px -5px rgba(19,19,51,0.2),0px 15px 22px 2px rgba(19,19,51,0.14),0px 6px 28px 5px rgba(19,19,51,0.12)',
            '0px 11px 15px -7px rgba(19,19,51,0.2),0px 24px 38px 3px rgba(19,19,51,0.14),0px 9px 46px 8px rgba(19,19,51,0.12)',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
        ],
    } as GeminiThemeType;

    const darkPalette = createPalette({
        mode: 'dark',
        common: {
            black: '#131333',
            white: '#F8F8FF',
        },
        primary: {
            main: '#2979F1',
            light: '#79ABF6',
            dark: '#0C54C0',
            contrastText: '#F1F3F9',
        },
        secondary: {
            main: '#1A1B60',
            light: '#272987',
            dark: '#0D0E30',
            contrastText: '#F1F3F9',
        },
        error: {
            main: '#DA4167',
            light: '#E47792',
            dark: '#AA2244',
            contrastText: '#F1F3F9',
        },
        warning: {
            main: '#FAB616',
            light: '#FCCD5F',
            dark: '#DC9B04',
            contrastText: '#131333',
        },
        info: {
            main: '#00C2FF',
            light: '#A5E4F3',
            dark: '#1AA4C7',
            contrastText: '#F1F3F9',
        },
        success: {
            main: '#57A773',
            light: '#87C09B',
            dark: '#3F7853',
            contrastText: '#F1F3F9',
        },
        grey: {
            50: '#EEEEFA',
            100: '#DDDDF5',
            200: '#CECFEC',
            300: '#BABADE',
            400: '#A1A1CE',
            500: '#7C7DB8',
            600: '#6162A8',
            700: '#494A90',
            800: '#3B3C7D',
            900: '#131333',
        },
        text: {
            primary: '#F8F8FF',
            secondary: '#A7A4E1',
            disabled: '#7472A4',
        },
        background: {
            paper: '#3B3C7D',
            default: '#1A1B60',
        },
        action: {
            active: 'rgba(248, 248, 255, 0.56)',
            hover: 'rgba(41, 121, 241, 0.08)',
            hoverOpacity: 0.08,
            selected: 'rgba(41, 121, 241, 0.16)',
            selectedOpacity: 0.16,
            disabled: 'rgba(124, 125, 184, 0.3)',
            disabledBackground: 'rgba(124, 125, 184, 0.12)',
            disabledOpacity: 0.38,
            focus: 'rgba(124, 125, 184, 0.12)',
            focusOpacity: 0.12,
            activatedOpacity: 0.12,
        },
    });

    const darkTheme = {
        mode: mode,
        palette: darkPalette,
        shadows: [
            'none',
            '0px 3px 5px -1px rgba(19,19,51,0.2),0px 6px 10px 0px rgba(19,19,51,0.14),0px 1px 18px 0px rgba(19,19,51,0.12)',
            '0px 8px 9px -5px rgba(19,19,51,0.2),0px 15px 22px 2px rgba(19,19,51,0.14),0px 6px 28px 5px rgba(19,19,51,0.12)',
            '0px 11px 15px -7px rgba(19,19,51,0.2),0px 24px 38px 3px rgba(19,19,51,0.14),0px 9px 46px 8px rgba(19,19,51,0.12)',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
        ],
    } as GeminiThemeType;

    const theme = mode === 'dark' ? darkTheme : lightTheme;

    return { theme };
}

export default useThemeVariant;
