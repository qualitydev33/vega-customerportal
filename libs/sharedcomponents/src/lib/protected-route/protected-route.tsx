import { Navigate, Outlet } from 'react-router-dom';
import Keycloak from 'keycloak-js';

interface ProtectedRouterType {
    redirectPath?: string;
    keycloak: Keycloak;
    layoutComponent: React.ElementType;
}

export const ProtectedRoute = ({ redirectPath = '/landing', keycloak, layoutComponent }: ProtectedRouterType) => {
    if (!keycloak.authenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    const LayoutComponent = layoutComponent;

    return (
        <LayoutComponent>
            <Outlet />
        </LayoutComponent>
    );
};
