// eslint-disable-next-line @typescript-eslint/no-empty-interface
import { Route, Routes as RRoutes } from 'react-router-dom';
import { DashboardPage } from '../pages/dashboard-page';
import { OrganizationsPage } from '../pages/organizations-page';
import { ProfilePage } from '../pages/profile-page';
import { useKeycloak } from '@react-keycloak-fork/web';
import { RouteUrls } from './routeUrls';
import { AdminLayoutController } from '../components/admin-layout/admin-layout-controller';
import { AuthController, ProtectedRoute } from '@vegaplatformui/sharedcomponents';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRoutesProps {}

const Routes: React.FC<IRoutesProps> = (props) => {
    const { keycloak } = useKeycloak();

    return (
        <RRoutes>
            <Route path='/*' element={<AuthController authenticatedRedirectPath={RouteUrls.dashboard} />} />
            <Route element={<ProtectedRoute keycloak={keycloak} layoutComponent={AdminLayoutController} />}>
                <Route path={RouteUrls.dashboard} element={<DashboardPage />} />
                <Route path={RouteUrls.organizations} element={<OrganizationsPage />} />
                <Route path={RouteUrls.profile} element={<ProfilePage />} />
            </Route>
        </RRoutes>
    );
};

export { Routes };
