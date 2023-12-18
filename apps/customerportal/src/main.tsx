import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';
import { CustomKeycloakProvider } from '@vegaplatformui/sharedcomponents';
import { RecoilRoot } from 'recoil';
import 'react-js-cron/dist/styles.css';
import '../../../global.css';
import { pdfjs } from 'react-pdf';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import 'react-js-cron/dist/styles.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <RecoilRoot>
        <CustomKeycloakProvider authServerUrl={`https://${process.env.NX_AUTH_SERVER_URL!}/`} authClientId={process.env.NX_AUTH_RESOURCE!}>
            <StrictMode>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </LocalizationProvider>
            </StrictMode>
        </CustomKeycloakProvider>
    </RecoilRoot>
);

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();
