import { render } from '@testing-library/react';
import { CustomAppBar } from '@vegaplatformui/sharedcomponents';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';

describe('Custom AppBar', () => {
    it('should render successfully', () => {
        const { baseElement } = getAppBar();
        expect(baseElement).toBeTruthy();
    });

    it('Should pass the selected link onto the title', () => {
        const appBar = getAppBar();

        const spanTextContent = appBar.getByTestId('page-title').textContent;
        expect(spanTextContent).toEqual(menuItems.primaryMenuItems[1].title);
    });

    it('should render the right icon for the selected link', () => {
        const appBar = getAppBar();

        const svgIcon = appBar.getByTestId('page-icon');
        expect(svgIcon).toBeTruthy();
    });
});

const menuItems = {
    primaryMenuItems: [
        {
            icon: DashboardIcon,
            title: 'Dashboard',
            route: 'dashboard',
        },
        {
            icon: CenterFocusStrongIcon,
            title: 'Spaces',
            route: 'spaces',
        },
    ],
    secondaryMenuItems: [],
    integrationMenuItems: [],
};
const getAppBar = () => {
    return render(
        <CustomAppBar
            themeState={'light'}
            selectedMenuItem={{
                title: menuItems.primaryMenuItems[1].title,
                route: menuItems.primaryMenuItems[1].route,
                icon: menuItems.primaryMenuItems[1].icon,
            }}
            menuItems={menuItems}
            isDrawerOpen={false}
            setIsDrawerOpen={() => {}}
        />
    );
};
