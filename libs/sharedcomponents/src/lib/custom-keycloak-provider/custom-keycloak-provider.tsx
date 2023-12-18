import { ReactKeycloakProvider } from '@react-keycloak-fork/web';
import React, { useEffect } from 'react';
import Keycloak from 'keycloak-js';
import { OrgKeycloakRealm } from '../recoil/atom';
import { useSetRecoilState } from 'recoil';
import { sessionTexts } from '@vegaplatformui/utils';

export interface CustomKeycloakProviderProps extends React.PropsWithChildren {
    authServerUrl: string;
    authClientId: string;
    domainSlug?: string;
}

const CustomKeycloakProvider: React.FC<CustomKeycloakProviderProps> = (props) => {
    const [keycloak, setKeycloak] = React.useState<Keycloak | undefined>(undefined);
    const setOrgKeycloakRealm = useSetRecoilState(OrgKeycloakRealm);

    useEffect(() => {
        //ToDo Is this good enough to grab domain slug?
        const domainSlug = window.location.hostname.split('.')[0];
        const realm = getRealmFromDomainSlug(domainSlug);
        setKeycloak(new Keycloak({ realm: realm, url: props.authServerUrl, clientId: props.authClientId }));
    }, [props.authServerUrl, props.authClientId, setOrgKeycloakRealm]);

    //ToDo replace with actual api
    const getRealmFromDomainSlug = (domainSlug: string): string => {
        const realms = {
            admin: 'vegacloud',
            localhost: 'vegacloud',
            local: 'vegacloud',
            /*

            prod -
            local: 'lordofthewings',
            local: 'brentsawesometestorg',
            local: 'bentestorg',

            develop -
            local: 'alphatestorg',
            local: 'testrealmg44k0',
            local: 'TestCompany',
            local: 'testrealmjyse6',

            */
            gemini: 'gemini',
        };

        switch (domainSlug) {
            case 'admin':
                return realms.admin;
            case 'local':
                return realms.local;
            case 'localhost':
                return realms.localhost;
            case 'gemini':
                return realms.gemini;
            default:
                return domainSlug;
        }
    };

    return keycloak ? (
        <ReactKeycloakProvider data-testid={'keycloakProvider'} initOptions={{ onLoad: 'login-required' }} authClient={keycloak}>
            {props.children}
        </ReactKeycloakProvider>
    ) : (
        <></>
    );
};

export { CustomKeycloakProvider };
