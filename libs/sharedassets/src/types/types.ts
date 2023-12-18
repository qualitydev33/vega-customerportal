import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export interface GeminiMenuItem {
    icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string };
    title: string;
    route?: string;
    subMenu?: GeminiSubMenuItem[];
    isSelected: boolean;
    isFooterMenuItem?: boolean;
    isHeaderMenuItem?: boolean;
    heading?: string;
    trailingIcon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string };
}

export interface GeminiSubMenuItem {
    title: string;
    route: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string };
    subMenu?: GeminiSubMenuItem[];
    isSelected: boolean;
    trailingIcon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string };
}
