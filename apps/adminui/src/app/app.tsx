import { CssBaseline, PaletteMode } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { authenticationState, themeState } from '../recoil/atom';
import { createContext, useEffect, useMemo } from 'react';
import { sessionTexts } from '@vegaplatformui/utils';
import { useKeycloak } from '@react-keycloak-fork/web';
import { useRecoilState } from 'recoil';
import { Routes } from '../routes/routes';
import { RouteUrls } from '../routes/routeUrls';
import { useGeminiTheme } from '@vegaplatformui/styling';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const ColorModeContext = createContext({ toggleColorMode: () => {} });
export default function App() {
    const navigate = useNavigate();
    const [mode, setMode] = useRecoilState(themeState);
    const { keycloak } = useKeycloak();
    const [authenticated, setAuthenticated] = useRecoilState(authenticationState);

    const colorMode = useMemo(
        () => ({
            // The dark mode switch would invoke this method
            toggleColorMode: () => {
                setMode((prevMode: PaletteMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [setMode]
    );

    /*    //keycloak auth
    useEffect(() => {
        if (keycloak.authenticated) {
            sessionStorage.setItem(sessionTexts.authenticated, JSON.stringify(keycloak.authenticated));
            setAuthenticated(keycloak.authenticated);
            const currentRoute = sessionStorage.getItem(sessionTexts.route) || RouteUrls.dashboard;
            navigate(`/${currentRoute}`);
        }
    }, [keycloak.authenticated, navigate, setAuthenticated]);*/

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={useGeminiTheme(mode).theme}>
                <CssBaseline />
                <Routes />
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
