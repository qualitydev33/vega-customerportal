import { RouteUrls } from '../../routes/routeUrls';
import { GeminiMenuItem } from '@vegaplatformui/sharedassets';
import {
    Inventory,
    LocalParking,
    NearMe,
    Scoreboard,
    Settings,
    FormatListBulleted,
    Error,
    SwitchAccessShortcut,
    MilitaryTechSharp,
    FilePresent,
    DashboardCustomize,
    Style,
    Assessment,
} from '@mui/icons-material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';
// eslint-disable-next-line @typescript-eslint/ban-types
const emptyIcon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string } = () => null;
emptyIcon.muiName = 'SvgIcon';

export const menuItems: GeminiMenuItem[] = [
    /**
     * Inform
     */
    // {
    //     icon: DashboardCustomize,
    //     title: 'Dashboard',
    //     route: RouteUrls.dashboard,
    //     isSelected: false,
    //     heading: 'vInform',
    // },
    //{ title: 'Cloud Hero', route: RouteUrls.cloudHeroSummaries, icon: MilitaryTechSharp, isSelected: false, isHeaderMenuItem: true },
    { title: 'Executive KPIs', route: RouteUrls.executivekpis, icon: DashboardCustomize, isSelected: false, heading: 'vInform' },
    { title: 'Navigator', route: RouteUrls.navigator, icon: NearMe, isSelected: false, heading: 'vInform' },
    { title: 'Anomalies', route: RouteUrls.anomalies, icon: Error, isSelected: false, heading: 'vInform' },
    { title: 'Forecasting', route: RouteUrls.forecasting, icon: Assessment, isSelected: false, heading: 'vInform' },

    // { title: 'vScore', route: RouteUrls.vScore, icon: Scoreboard, isSelected: false, heading: 'vInform' },
    {
        title: 'Organize',
        route: RouteUrls.organize,
        icon: Inventory,
        isSelected: false,
        heading: 'vInform',
        subMenu: [
            { title: 'Spaces', route: RouteUrls.spaces, icon: emptyIcon, isSelected: false },

            { title: 'Business Groupings', route: RouteUrls.businessGroupings, icon: emptyIcon, isSelected: false },

            // { title: 'Cloud Accounts', route: RouteUrls.cloudAccounts, icon: emptyIcon, isSelected: false },
            { title: 'Resources', route: RouteUrls.resources, icon: emptyIcon, isSelected: false },
            { title: 'Tag Management', route: RouteUrls.tagManagement, icon: emptyIcon, isSelected: false },

            /*                    { title: 'Workloads', route: RouteUrls.workloads, icon: AutoAwesomeMotion, isSelected: false },
           { title: 'Resource Pools', route: RouteUrls.resourcePools, icon: GroupWork, isSelected: false },
          { title: 'VLabels', route: RouteUrls.vLabels, icon: Label, isSelected: false },*/
        ],
    },
    // { title: 'Tag Manager', route: RouteUrls.tagManager, icon: Style, isSelected: false, heading: 'Inform' },
    /**
     * Optimize
     */
    { title: 'Recommendations', route: RouteUrls.recommendations, icon: FormatListBulleted, isSelected: false, heading: 'vOptimize' },

    {
        icon: LocalParking,
        title: 'Parking',
        route: RouteUrls.parking,
        isSelected: false,
        heading: 'vOperate',
    },
    /*
    { title: 'Take Action', route: RouteUrls.takeAction, icon: SwitchAccessShortcut, isSelected: false, heading: 'vOperate' },
*/

    {
        title: 'Settings',
        route: RouteUrls.settings.url,
        icon: Settings,
        isSelected: false,
        isFooterMenuItem: true,
    },
    {
        title: 'Transfer Files',
        route: RouteUrls.myFiles,
        icon: FilePresent,
        isSelected: false,
        isFooterMenuItem: true,
        subMenu: [
            { title: 'From Vega', route: RouteUrls.fileDownloads, icon: emptyIcon, isSelected: false /*trailingIcon: Download*/ },
            { title: 'To Vega', route: RouteUrls.fileTransfer, icon: emptyIcon, isSelected: false /*trailingIcon: Upload*/ },
        ],
    },
    {
        title: 'Cloud Hero',
        route: RouteUrls.cloudHeroSummaries,
        icon: MilitaryTechSharp,
        isSelected: false,
        isFooterMenuItem: true,
    },
];
