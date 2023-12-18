import { ThemeProvider } from '@mui/material/styles';
import { makeStyles, useGeminiTheme } from '@vegaplatformui/styling';
import { Button, CssBaseline, List, ListItem, ListItemText, PaletteMode, styled, useTheme } from '@mui/material';
import { createContext, useEffect, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { themeState } from '../recoil/atom';
import { Routes } from '../routes/routes';
import { LicenseInfo } from '@mui/x-data-grid-premium';
import * as process from 'process';
import { useKeycloak } from '@react-keycloak-fork/web';
import { CustomSnackbar, DiscoveryDetails, SnackBarOptions } from '@vegaplatformui/sharedcomponents';
import useWebSocket from 'react-use-websocket';
import { DiscoveryEvents, IDiscoveryResponse } from '@vegaplatformui/models';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MaterialDesignContent, SnackbarProvider, useSnackbar } from 'notistack';

dayjs.extend(utc);
dayjs.extend(timezone);

// eslint-disable-next-line @typescript-eslint/no-empty-function
const ColorModeContext = createContext({ toggleColorMode: () => {} });
export function App() {
    const [colorMode, setColorMode] = useRecoilState(themeState);
    LicenseInfo.setLicenseKey(process.env.NX_MUI_LICENSE || ' ');
    const [snackbarOptions, setSnackbarOptions] = useRecoilState(SnackBarOptions);
    const { classes, cx } = useStyles();
    const [loginDisclosure, setLoginDisclosure] = useState([
        'Not fully implemented: Ability to take actions on resources',
        'Not fully implemented: Ability vOperate-Parking',
        'Not fully implemented: Resource Pool creation',
        'Not fully implemented: Multi-Factor Authentication and SSO',
        `Bugs/Issues: The list of all known issues may found by selecting the button on the upper right corner, "Bug List"`,
    ]);
    const [discoveryDetails, setDiscoveryDetails] = useRecoilState(DiscoveryDetails);
    const defaultWebsocketUrl = process.env.NX_WEBSOCKET_URL!;
    const { keycloak } = useKeycloak();
    const theme = useTheme();

    useEffect(() => {
        switch (keycloak.token) {
            case undefined:
                return setDiscoveryDetails({ ...discoveryDetails, shouldConnect: false });
            default:
                return setDiscoveryDetails({ ...discoveryDetails, shouldConnect: true });
        }
    }, [keycloak.token]);

    const { sendJsonMessage } = useWebSocket(
        defaultWebsocketUrl,
        {
            // protocols: ['Authorization', `${keycloak.token}`],
            queryParams: {
                token: defaultWebsocketUrl === process.env.NX_WEBSOCKET_URL! ? `${keycloak.token}` : '',
                //client_id: localStorage.getItem('websocket_client_id') ?? 'null',
            }, //retryOnError: false,
            share: true,
            onOpen: (event) => {
                // const clientId = localStorage.getItem('websocket_client_id') ?? null;
                // sendJsonMessage({ event: DiscoveryEvents.NewConnection, data: { client_id: clientId } });
            },
            onMessage: (event) => {
                const data: IDiscoveryResponse = JSON.parse(event.data);
                switch (data.event) {
                    case DiscoveryEvents.ClientDisconnected:
                        setDiscoveryDetails({ ...discoveryDetails });
                        setSnackbarOptions({
                            snackBarProps: { open: true, autoHideDuration: 5000 },
                            alertProps: { severity: 'error' },
                            message: `There Was A Problem With Resource Discovery, The Client Disconnected`,
                        });
                        break;
                    case DiscoveryEvents.AuthenticationFailed:
                        setDiscoveryDetails({ ...discoveryDetails });
                        setSnackbarOptions({
                            snackBarProps: { open: true, autoHideDuration: 5000 },
                            alertProps: { severity: 'error' },
                            message: `There Was A Problem With Resource Discovery, Authentication Failed`,
                        });
                        break;
                    case DiscoveryEvents.ClientConnected:
                        //localStorage.setItem('websocket_client_id', JSON.stringify(data.data.client_id!));
                        setDiscoveryDetails({ ...discoveryDetails, client_id: data.data.client_id! });
                        break;
                    case DiscoveryEvents.DiscoveryInProgress:
                        setDiscoveryDetails({ ...discoveryDetails, is_discovery: true });
                        setSnackbarOptions({
                            snackBarProps: { open: true, autoHideDuration: 5000 },
                            alertProps: { severity: 'info' },
                            message: `Resource Discovery Currently In Progress`,
                        });
                        break;
                    case DiscoveryEvents.DiscoveryStarted:
                        setDiscoveryDetails({ ...discoveryDetails, is_discovery: true, request_id: data.data.request_id! });
                        setSnackbarOptions({
                            snackBarProps: { open: true, autoHideDuration: 5000 },
                            alertProps: { severity: 'info' },
                            message: `Resource Discovery Started`,
                        });
                        break;
                    case DiscoveryEvents.DiscoveryRequestFailed:
                        setDiscoveryDetails({ ...discoveryDetails, is_discovery: false, request_id: '' });
                        setSnackbarOptions({
                            snackBarProps: { open: true, autoHideDuration: 5000 },
                            alertProps: { severity: 'error' },
                            message: `Resource Discovery Request Failed`,
                        });
                        break;
                    case DiscoveryEvents.DiscoveryComplete:
                        setDiscoveryDetails({ ...discoveryDetails, is_discovery: false, request_id: '' });
                        setSnackbarOptions({
                            snackBarProps: { open: true, autoHideDuration: 5000 },
                            alertProps: { severity: 'info' },
                            message: `Resource Discovery Complete`,
                        });
                        break;
                    case DiscoveryEvents.DiscoveryCompleteWithFailures:
                        setDiscoveryDetails({ ...discoveryDetails, is_discovery: false, request_id: '' });
                        setSnackbarOptions({
                            snackBarProps: { open: true, autoHideDuration: 5000 },
                            alertProps: { severity: 'warning' },
                            message: `Resource Discovery Complete With Errors`,
                        });
                        break;
                    case DiscoveryEvents.DiscoveryCooldown:
                        setDiscoveryDetails({
                            ...discoveryDetails,
                            in_cooldown: true,
                            datetime_in_30min:
                                data.data.cooldown_time_remaining !== undefined
                                    ? //The message sends back the number of seconds left in the cooldown so I have to get the current timestamp and add the milliseconds left
                                      Date.now() + Number(data.data.cooldown_time_remaining) * 1000
                                    : Date.now() + 30 * 60000, // Date.parse(data.data.cooldown_time_remaining * 1000 ?? new Date(Date.now() + 30 * 60000).toString()),
                        });
                        setSnackbarOptions({
                            snackBarProps: { open: true, autoHideDuration: 5000 },
                            alertProps: { severity: 'warning' },
                            message: `Discovery Has Ran Recently, Please Wait To Run Again`,
                        });
                        break;
                    default:
                        break;
                }
            },
            onClose: (event) => {
                setDiscoveryDetails({ ...discoveryDetails, is_discovery: false, request_id: '' });
            },
            onError: (e) => {
                setDiscoveryDetails({ ...discoveryDetails, is_discovery: false, request_id: '' });
            },
            shouldReconnect: (closeEvent) => {
                return true;
            },
        },
        discoveryDetails.shouldConnect
    );

    // useEffect(() => {
    //     setSnackbarOptions({
    //         snackBarProps: { open: true },
    //         alertProps: { severity: 'warning' },
    //         message: (
    //             <List
    //                 sx={{
    //                     listStyleType: 'disc',

    //                     marginTop: '1rem',
    //                     pl: 4,
    //                 }}
    //             >
    //                 {loginDisclosure.map((item) => (
    //                     <ListItem key={item} className={cx(classes.listItem)}>
    //                         <ListItemText>{item}</ListItemText>
    //                     </ListItem>
    //                 ))}
    //             </List>
    //         ),
    //     });
    // }, []);

    const colorModeToggle = useMemo(
        () => ({
            // The dark mode switch would invoke this method
            toggleColorMode: () => {
                setColorMode((prevMode: PaletteMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [setColorMode]
    );

    const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
        '&.notistack-MuiContent-success': {
            backgroundColor: theme.palette.success.main,
        },
        '&.notistack-Snackbar': {
            width: '80% !important',
        },
        '&.notistack-MuiContent-error': {
            backgroundColor: theme.palette.error.main,
        },
        '&.notistack-MuiContent-info': {
            borderRadius: '4px',
            boxShadow: 'none',
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '0.875rem',
            lineHeight: 1.43,
            backgroundColor: 'rgb(232, 249, 255)',
            display: 'flex',
            padding: '6px 16px',
            color: 'rgb(12, 81, 102)',
            textAlign: 'center',
            width: '80% !important',
        },
    }));

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ColorModeContext.Provider value={colorModeToggle}>
                <ThemeProvider theme={useGeminiTheme(colorMode).theme}>
                    <CssBaseline />
                    <SnackbarProvider
                        Components={{
                            info: StyledMaterialDesignContent,
                            error: StyledMaterialDesignContent,
                            success: StyledMaterialDesignContent,
                            warning: StyledMaterialDesignContent,
                        }}
                        maxSnack={5}
                    >
                        <Routes data-testid={'routes'} />
                    </SnackbarProvider>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </LocalizationProvider>
    );
}

const useStyles = makeStyles()((theme) => ({
    listItem: {
        display: 'list-item',
        padding: 0,
    },
    variantError: {
        backgroundColor: theme.palette.error.main,
    },
    variantInfo: {
        backgroundColor: '#E5FFF3',
        color: '#343434',
    },
}));

export default App;
