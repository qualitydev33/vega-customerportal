import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, Grid, Tab, Tabs } from '@mui/material';
import { makeStyles } from '@vegaplatformui/styling';
import {
    ResourceReportsPanel,
    ResourceDetailPanel,
    ResourceContainersPanel,
    ResourceHistoryPanel,
    ResourceRecommendationsPanel,
    ResourceStoragePanel,
    ResourceUtilizationPanel,
    ReturnToResources,
    SnackBarOptions,
    vegaTableControls,
    defaultVegaTableControl,
    useTableUtilities,
} from '@vegaplatformui/sharedcomponents';
import { useKeycloak } from '@react-keycloak-fork/web';
import { ContainerApi, RecommendationsApi } from '@vegaplatformui/apis';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useErrorHandlingV2 } from '@vegaplatformui/sharedcomponents';
import { IRecommendation, IResource, IResourceContainersInfo } from '@vegaplatformui/models';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ArrowBack, Close } from '@mui/icons-material';
import { AxiosResponse } from 'axios';
import { DrawerScheduler } from 'libs/sharedcomponents/src/lib/drawer-scheduler/drawer-scheduler';

const resourceDetailTabs = [
    { label: 'Details', id: 'details' },
    // { label: 'Reports', id: 'reports' },
    // { label: 'Recommendations', id: 'recommendations' },
    // { label: 'Containers', id: 'containers' },
    // { label: 'Storage', id: 'storage' },
    // { label: 'Utilization', id: 'utilization' },
    // { label: 'History', id: 'history' },
];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IResourceDetailControllerProps {}

const ResourceDetailController: React.FC<IResourceDetailControllerProps> = (props) => {
    const { keycloak } = useKeycloak();
    const { classes, cx } = useStyles(props);
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const defaultCurrentTab = location.state ? location.state.tab : resourceDetailTabs[0].id;
    const setSnackbarOptions = useSetRecoilState(SnackBarOptions);
    const [withErrorHandlingV2] = useErrorHandlingV2();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentTab, setCurrentTab] = useState(defaultCurrentTab);
    const [resourcesByResourcePoolID, setResourcesByResourcePoolID] = useState<IResource[]>([]);
    const [recommendations, setRecommendations] = useState<IRecommendation[]>([]);
    const resourcesDetailPanelTableUtilities = useTableUtilities('resource-recommendation-panel-table');
    const [resource, setResource] = useState<IResource | undefined>(undefined);
    const [resourceContainer, setResourceContainer] = useState<IResourceContainersInfo | undefined>(undefined);
    const [isDrawerScheduleOpen, setIsDrawerScheduleOpen] = useState<boolean>(false);

    const containerApi = useMemo(() => {
        const containerApiInstance = new ContainerApi();
        containerApiInstance.token = keycloak.token ?? '';
        return containerApiInstance;
    }, [keycloak.token]);

    const recommendationsApi = useMemo(() => {
        const recommendationsApiInstance = new RecommendationsApi();
        recommendationsApiInstance.token = keycloak.token ?? '';
        return recommendationsApiInstance;
    }, [keycloak.token]);

    const getResourceDetail = () => {
        withErrorHandlingV2(async () => {
            setIsLoading(true);
            const resourceId = params.id ?? '';
            const res = await containerApi.getResourceById(resourceId);
            setResource(res.data);
            setIsLoading(false);
        }, 'Getting Resource by ID failed.');
    };

    const getResourceFamily = async () => {
        setIsLoading(true);
        let res: AxiosResponse<any, any>;
        await withErrorHandlingV2(async () => {
            const resourceId = params.id ?? '';
            res = await containerApi.getResourceById(resourceId);
            setResource(res.data);
        }, 'Getting Resource by pool ID failed');

        await withErrorHandlingV2(async () => {
            const familyResponse = await containerApi.getFamilyByResourcePoolId(res.data.resource_pool_id);
            setResourceContainer(familyResponse.data);
        }, 'Getting family info failed by resource pool id');

        await withErrorHandlingV2(async () => {
            const resourcesResponse = await containerApi.getResourcesByResourcePoolId(res.data.resource_pool_id);
            setResourcesByResourcePoolID(resourcesResponse.data);
        }, 'Getting resources failed by resource pool id');
        setIsLoading(false);
    };

    const getRecommendationsByResourceID = () => {
        withErrorHandlingV2(async () => {
            setIsLoading(true);
            const resourceId = params.id ?? '';
            const res = await recommendationsApi.getRecommendationsByResourceID(resourceId);
            if (res.status !== 200) {
                setIsLoading(false);
                return;
            }
            setRecommendations(res.data);
            setIsLoading(false);
        }, 'Getting Recommendations by Resource ID failed.');
    };

    const handlePark = () => {
        setSnackbarOptions({
            snackBarProps: { open: true, autoHideDuration: 6000 },
            alertProps: { severity: 'warning' },
            message: `Feature not currently implemented`,
        });
    };

    const handleTabChange = (event: React.ChangeEvent<unknown>, newValue: string) => {
        setCurrentTab(newValue);
    };

    const onCloseDrawerScheduler = useCallback(() => {
        setIsDrawerScheduleOpen(false);
    }, []);

    const onParkingScheduleByResourceId = useCallback((resourceId: string) => {
        setIsDrawerScheduleOpen(true);
    }, []);

    useEffect(() => {
        getResourceDetail();
        if (currentTab === 'recommendations') {
            getRecommendationsByResourceID();
        } else if (currentTab === 'containers') {
            getResourceFamily();
        }
    }, [currentTab]);

    return (
        <>
            <Card elevation={0}>
                <CardContent>
                    <ReturnToResources navigate={navigate} resource={resource} />
                    <Grid container direction='column' marginTop={3}>
                        {/*<Grid xs={12} item>*/}
                        {/*    <Tabs variant='scrollable' value={currentTab} onChange={handleTabChange}>*/}
                        {/*        {resourceDetailTabs.map((currentTab) => (*/}
                        {/*            <Tab key={currentTab.id} label={currentTab.label.toUpperCase()} value={currentTab.id} />*/}
                        {/*        ))}*/}
                        {/*    </Tabs>*/}
                        {/*</Grid>*/}
                        {/*This grid item had the tab panel styling on it when classes were active*/}
                        <Grid item xs={12}>
                            {currentTab === 'details' ? (
                                <ResourceDetailPanel
                                    recommendationsApi={recommendationsApi}
                                    isLoading={isLoading}
                                    resource={resource}
                                    onParkingScheduleByResourceId={onParkingScheduleByResourceId}
                                />
                            ) : currentTab === 'reports' ? (
                                <ResourceReportsPanel />
                            ) : currentTab === 'recommendations' ? (
                                <ResourceRecommendationsPanel isLoading={isLoading} recommendations={recommendations} />
                            ) : currentTab === 'containers' ? (
                                <ResourceContainersPanel
                                    isLoading={isLoading}
                                    resourceContainer={resourceContainer}
                                    resourceSiblings={resourcesByResourcePoolID}
                                />
                            ) : currentTab === 'storage' ? (
                                <ResourceStoragePanel isLoadingDiskDataGrid={false} isLoadingSnapshotsDataGrid={false} />
                            ) : (
                                // : currentTab === 'utilization' ?
                                //     <ResourceUtilizationPanel />
                                // : currentTab === 'history' ?
                                //     <ResourceHistoryPanel />
                                <div>Unknown section</div>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <DrawerScheduler
                width={'60%'}
                isOpen={isDrawerScheduleOpen}
                enableEditAttachResourcesDrawer={false}
                scheduleToEdit={undefined}
                resources={[]}
                isLoading={false}
                onCloseDrawer={onCloseDrawerScheduler}
                onCancel={onCloseDrawerScheduler}
                onSave={() => {}}
            />
        </>
    );
};

const useStyles = makeStyles<IResourceDetailControllerProps>()((theme, props) => ({
    Tabpanel: {
        paddingBlock: theme.spacing(2),
    },
}));

export { ResourceDetailController };
