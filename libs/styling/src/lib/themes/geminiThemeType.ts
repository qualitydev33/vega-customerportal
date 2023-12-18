import { Palette, Shadows } from '@mui/material';
import { TypographyOptions } from '@mui/material/styles/createTypography';

export interface GeminiThemeType {
    mode: string;
    palette: Palette;
    typography: TypographyOptions;
    shadows: Shadows;
}
