import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DomainIcon from '@mui/icons-material/Domain';
import GroupsIcon from '@mui/icons-material/Groups';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import LabelIcon from '@mui/icons-material/Label';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import { RouteUrls } from '../../routes/routeUrls';
import { GeminiMenuItem } from '@vegaplatformui/sharedassets';

export const menuItems: GeminiMenuItem[] = [
    {
        icon: DashboardIcon,
        title: 'Dashboard',
        route: RouteUrls.dashboard,
        isSelected: true,
    },
    {
        icon: DomainIcon,
        title: 'Organizations',
        route: RouteUrls.organizations,
        isSelected: false,
    },
];
