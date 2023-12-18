import { render } from '@testing-library/react';
import { CustomKeycloakProvider } from './custom-keycloak-provider';

describe('CustomKeycloakProvider', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<CustomKeycloakProvider config={'ToDo add config for testing'} />);
        expect(baseElement).toBeTruthy();
    });
});
