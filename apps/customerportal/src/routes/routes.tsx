// eslint-disable-next-line @typescript-eslint/no-empty-interface
import { Route, useNavigate, Routes as RRoutes } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak-fork/web';
import { RouteUrls } from './routeUrls';
import { AuthController, ProtectedRoute, ShowSupportForm } from '@vegaplatformui/sharedcomponents';
import { PortalLayoutController } from '../components/portal-layout/portal-layout-controller';
import { ExecutiveKpiController } from '../components/executive-kpis/executive-kpi-controller';
import { FileDownloadsController } from '../components/file-downloads/file-downloads-controller';
import { FileTransferController } from '../components/file-transfer/file-transfer-controller';
import React from 'react';
import { AnomaliesControllerOld } from '../components/anomalies/anomalies-controller-old';
import { CostNavigatorController } from '../components/cost-navigator/cost-navigator-controller';
import { TagManagerController } from '../components/tag-manager/tag-manager-controller';
import { sessionTexts } from '@vegaplatformui/utils';
import { RecommendationsController } from '../components/recommendations/recommendations-controller';
//import { CloudProviderAccountsController } from '../components/cloud-provider-accounts/cloud-provider-accounts-controller';
import { ContactSupportController } from '../components/contact-support/contact-support-controller';
import { useRecoilValue } from 'recoil';
import { SpacesController } from '../components/spaces/spaces-controller';
import { ResourcesController } from '../components/resources/resources-controller';
import { CloudHeroesController } from '../components/cloud-heroes/cloud-heroes-controller';
import { SettingsController } from '../components/settings/settings-controller';
import { ResourceDetailController } from '../components/resources/resources-detail-controller';
import { BusinessGroupingsController } from '../components/business-units/business-groupings-controller';
import { AnomaliesController } from '../components/anomalies/anomalies-controller';
import { TakeActionController } from '../components/take-action-controller/take-action-controller';
import { Stack, Typography } from '@mui/material';
import { VScoreController } from '../components/v-score/v-score-controller';
import { ParkingController } from '../components/parking/parking-controller';
import { ForecastingController } from '../components/forecasting/forecasting-controller';
import { TagManagementController } from '../components/tag-manager/tag-management-controller';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRoutesProps {}

const Routes: React.FC<IRoutesProps> = (props) => {
    const { keycloak } = useKeycloak();
    const showSupportForm = useRecoilValue(ShowSupportForm);

    return (
        <RRoutes data-testid='routes'>
            <Route
                path='/*'
                element={<AuthController authenticatedRedirectPath={sessionStorage.getItem(sessionTexts.route) || RouteUrls.navigator} />}
            />
            <Route element={<ProtectedRoute keycloak={keycloak} layoutComponent={PortalLayoutController} />}>
                <Route path={RouteUrls.executivekpis} element={<ExecutiveKpiController />} />
                <Route path={RouteUrls.tagManagement} element={<TagManagementController />} />
                <Route path={RouteUrls.forecasting} element={<ForecastingController />} />
                <Route path={RouteUrls.navigator} element={<CostNavigatorController />} />
                <Route path={RouteUrls.anomalies} element={<AnomaliesController />} />
                <Route path={RouteUrls.optimize} element={<div>Optimize</div>} />
                <Route path={RouteUrls.operate} element={<div>Operate</div>} />
                <Route path={RouteUrls.fileDownloads} element={<FileDownloadsController />} />
                <Route path={RouteUrls.fileTransfer} element={<FileTransferController />} />
                <Route path={RouteUrls.tagManager} element={<TagManagerController />} />
                <Route path={RouteUrls.recommendations} element={<RecommendationsController />} />
                {/*<Route path={RouteUrls.cloudAccounts} element={<CloudProviderAccountsController />} />*/}
                <Route path={RouteUrls.spaces} element={<SpacesController />} />
                <Route path={RouteUrls.resources} element={<ResourcesController />} />
                <Route path={RouteUrls.resourcesDetail} element={<ResourceDetailController />} />
                <Route path={RouteUrls.cloudHeroSummaries} element={<CloudHeroesController />} />
                <Route path={RouteUrls.settings.url} element={<SettingsController />} />
                <Route path={RouteUrls.takeAction} element={<TakeActionController />} />
                <Route path={RouteUrls.businessGroupings} element={<BusinessGroupingsController />} />
                <Route path={RouteUrls.vScore} element={<VScoreController />} />
                <Route path={RouteUrls.parking} element={<ParkingController />} />

                {/*Stubbed out routes to support refresh/nav*/}
                <Route path={RouteUrls.organize} element={<div>{RouteUrls.organize}</div>} />

                <Route path={RouteUrls.workloads} element={<div>{RouteUrls.workloads}</div>} />
                <Route path={RouteUrls.resourcePools} element={<div>{RouteUrls.resourcePools}</div>} />
                <Route path={RouteUrls.vLabels} element={<div>{RouteUrls.vLabels}</div>} />

                <Route path={RouteUrls.vPolicies} element={<div>{RouteUrls.vPolicies}</div>} />
                <Route path={RouteUrls.quotasBudgets} element={<div>{RouteUrls.quotasBudgets}</div>} />
                <Route path={RouteUrls.tagManagement} element={<div>{RouteUrls.tagManagement}</div>} />

                <Route path={RouteUrls.alerting} element={<div>{RouteUrls.alerting}</div>} />
                <Route path={RouteUrls.contacts} element={<div>{RouteUrls.contacts}</div>} />
                <Route path={RouteUrls.hushes} element={<div>{RouteUrls.hushes}</div>} />
                <Route path={RouteUrls.myFiles} element={<div>{RouteUrls.myFiles}</div>} />
                <Route path={RouteUrls.cloudHeroBadges} element={<div>{RouteUrls.cloudHeroBadges}</div>} />
            </Route>
        </RRoutes>
    );
};

export { Routes };
