import { useMemo } from 'react';
import { Theme } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import 'typeface-inter';
import type {} from '@mui/x-data-grid-premium/themeAugmentation';
import type {} from '@mui/x-date-pickers/themeAugmentation';

import useThemeVariant from '../use-theme-variant/use-theme-variant';
import { getGridBooleanOperators, GridLogicOperator } from '@mui/x-data-grid';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseGeminiTheme {
    theme: Theme;
}

export function useGeminiTheme(mode: string): UseGeminiTheme {
    const themeVariant = useThemeVariant(mode);
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    ...themeVariant.theme.palette,
                },
                typography: {
                    fontFamily: 'Inter',
                },
                components: {
                    MuiButtonBase: {
                        defaultProps: {
                            disableRipple: true,
                        },
                    },
                    MuiButton: { defaultProps: { variant: 'contained' }, styleOverrides: { root: { textTransform: 'capitalize' } } },
                    MuiSelect: { defaultProps: { size: 'small' } },
                    MuiFormHelperText: {
                        styleOverrides: {
                            contained: {
                                marginLeft: 0,
                                marginRight: 0,
                            },
                        },
                    },
                    MuiTab: {
                        styleOverrides: {
                            root: {
                                textTransform: 'none',
                            },
                        },
                    },
                    MuiDateTimePicker: { defaultProps: { label: '00:00 AM/PM' } },
                    MuiDataGrid: {
                        defaultProps: {
                            paginationModel: {
                                pageSize: 10,
                                page: 0,
                            },
                            slotProps: {
                                baseButton: { variant: 'text' },
                            },
                            componentsProps: {
                                columnsPanel: {},
                            },
                        },
                        styleOverrides: {
                            row: {
                                '&.Mui-selected': { backgroundColor: `${themeVariant.theme.palette.primary.light}40` },
                                '&:hover': {
                                    backgroundColor: `${themeVariant.theme.palette.primary.light}20`,
                                },
                            },
                        },
                    },
                },
            }),
        [mode]
    );

    return { theme };
}

export default useGeminiTheme;
