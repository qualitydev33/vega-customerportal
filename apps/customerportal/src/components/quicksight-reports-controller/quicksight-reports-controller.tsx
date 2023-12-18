import React, { useEffect, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { useKeycloak } from '@react-keycloak-fork/web';
import { useSetRecoilState } from 'recoil';
import { QuicksightReportLoadingSkeleton, QuicksightReportTabs, SnackbarErrorOutput, SnackBarOptions } from '@vegaplatformui/sharedcomponents';
import { IDashboard } from '@vegaplatformui/models';
import { ReportsApi } from '@vegaplatformui/apis';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IQuicksightReportsControllerProps {
    folderNames: string[];
}

const QuicksightReportsController: React.FC<IQuicksightReportsControllerProps> = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const { keycloak } = useKeycloak();
    const [dashboardIds, setDashboardIds] = useState<string[]>([]);
    const [embeddedUrl, setEmbeddedUrl] = useState<string>('');
    const setSnackbarOptions = useSetRecoilState(SnackBarOptions);
    const [reports, setReports] = useState<IDashboard[]>([]);

    useEffect(() => {
        const reportsApi = new ReportsApi();
        reportsApi.token = keycloak.token ?? '';
        reportsApi
            .listDashboards({ folderNames: props.folderNames })
            .then((response) => {
                setReports(response.data);
                setDashboardIds(response.data?.map((dashboard) => dashboard.dashboardId));
                response.data.length > 0
                    ? reportsApi
                          .postEmbeddedURL(response.data.map((dashboard) => dashboard.dashboardId)[0])
                          .then((response) => {
                              setEmbeddedUrl(response.data);
                          })
                          .catch((error) => {
                              setSnackbarOptions({
                                  snackBarProps: { open: true, autoHideDuration: 6000 },
                                  alertProps: { severity: 'error' },
                                  message: `There was a problem getting embedded Url. ${SnackbarErrorOutput(error)}`,
                              });
                              setIsLoading(false);
                          })
                    : setIsLoading(false);
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem getting dashboard Ids. ${SnackbarErrorOutput(error)}`,
                });
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (embeddedUrl !== '' && embeddedUrl !== undefined) {
            setIsLoading(false);
        }
    }, [embeddedUrl]);

    return isLoading ? <QuicksightReportLoadingSkeleton /> : <QuicksightReportTabs reports={reports} dashboardUrl={embeddedUrl} />;
};

const useStyles = makeStyles<IQuicksightReportsControllerProps>()((theme, props) => ({}));

export { QuicksightReportsController };
