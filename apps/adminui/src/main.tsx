import './assets/index.css';
import App from './app/app';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import reportWebVitals from './app/report-web-vitals';
import { CustomKeycloakProvider } from '@vegaplatformui/sharedcomponents';
import { StrictMode } from 'react';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <CustomKeycloakProvider authServerUrl={`https://${process.env.NX_AUTH_SERVER_URL!}/`} authClientId={process.env.NX_AUTH_RESOURCE!}>
        <StrictMode>
            <BrowserRouter>
                <RecoilRoot>
                    <App />
                </RecoilRoot>
            </BrowserRouter>
        </StrictMode>
    </CustomKeycloakProvider>
);

reportWebVitals();
