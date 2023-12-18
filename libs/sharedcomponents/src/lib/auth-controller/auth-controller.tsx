import React, { useEffect } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak-fork/web';
import { sessionTexts } from '@vegaplatformui/utils';

export interface IAuthControllerProps {
    authenticatedRedirectPath: string;
}

const AuthController: React.FC<IAuthControllerProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const navigate = useNavigate();
    const { keycloak } = useKeycloak();

    useEffect(() => {
        if (keycloak.authenticated) {
            sessionStorage.setItem(sessionTexts.authenticated, JSON.stringify(keycloak.authenticated));
            const currentRoute = sessionStorage.getItem(sessionTexts.route) || props.authenticatedRedirectPath;
            navigate(`${currentRoute}`);
        }
    }, [keycloak.authenticated, navigate]);

    return <></>;
};

const useStyles = makeStyles<IAuthControllerProps>()((theme, props) => ({}));

export { AuthController };
