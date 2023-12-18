import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import { RecoilRoot } from 'recoil';
import Keycloak, { KeycloakProfile } from 'keycloak-js';

jest.mock('@react-keycloak-fork/web', () => ({ useKeycloak: mockUseKeycloak }));
let authenticated = false;

function mockUseKeycloak() {
    const token = 'A random string that is non zero length';
    const userProfile: KeycloakProfile = {
        username: 'test',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
    };
    const realmAccess = { roles: ['user'] };

    const authClient: Keycloak = {
        authenticated: authenticated,
        hasRealmRole(ignored: string) {
            return true;
        },
        hasResourceRole(ignored: string) {
            return true;
        },
        idToken: token,
        profile: userProfile,
        realm: 'TestRealm',
        realmAccess,
        refreshToken: token,
        token,
    } as Keycloak;
    return { initialized: true, keycloak: authClient };
}

const getApp = () => {
    return (
        <RecoilRoot>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </RecoilRoot>
    );
};

describe('App', () => {
    it('should render successfully', () => {
        const { baseElement } = render(getApp());
        expect(baseElement).toBeTruthy();
    });

    it('should not render the custom drawer when not authenticated', () => {
        authenticated = false;
        const { queryByTestId } = render(getApp());
        expect(queryByTestId('custom-drawer')).toBeFalsy();
    });

    it('should render the custom drawer when authenticated', () => {
        authenticated = true;
        const { queryByTestId } = render(getApp());
        expect(queryByTestId('custom-drawer')).toBeTruthy();
    });
});
