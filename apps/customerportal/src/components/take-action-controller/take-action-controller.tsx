import React, { useEffect, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { useSetRecoilState } from 'recoil';
import {
    RecommendationsCard,
    RecommendationsSummaryCard,
    SnackbarErrorOutput,
    SnackBarOptions,
    useTableUtilities,
} from '@vegaplatformui/sharedcomponents';
import { useKeycloak } from '@react-keycloak-fork/web';
import { IGetRecommendationsOverviewResponse, IPostTakeActionRequest, IRecommendation } from '@vegaplatformui/models';
import { ActionsApi, RecommendationsApi } from '@vegaplatformui/apis';
import { Box } from '@mui/material';
import { IRecommendationsControllerProps } from '../recommendations/recommendations-controller';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITakeActionControllerProps {}

const TakeActionController: React.FC<ITakeActionControllerProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const setSnackbarOptions = useSetRecoilState(SnackBarOptions);
    const { keycloak } = useKeycloak();
    const [recommendations, setRecommendations] = useState<IRecommendation[]>([]);
    const [recommendationsSummary, setRecommendationsSummary] = useState<IGetRecommendationsOverviewResponse>();
    const recommendationsTableUtilities = useTableUtilities('recommendations-table');
    const recommendationsApi = new RecommendationsApi();
    recommendationsApi.token = keycloak.token ?? '';
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);
        loadRecommendations().catch((error) => {
            setSnackbarOptions({
                snackBarProps: { open: true, autoHideDuration: 6000 },
                alertProps: { severity: 'error' },
                message: `There was a problem getting recommendations: ${SnackbarErrorOutput(error)}`,
            });
            setIsLoading(false);
        });
    }, [recommendationsTableUtilities.currentTableControl]);

    const loadRecommendations = async () => {
        if (recommendationsTableUtilities.currentTableControl) {
            const recsResponse = await recommendationsApi.getRecommendations({
                paginationModel: recommendationsTableUtilities.currentTableControl.paginationModel,
                sortModel: recommendationsTableUtilities.currentTableControl.sortModel,
                filterModel: recommendationsTableUtilities.currentTableControl.filterModel,
            });
            const recsSummaryResponse = await recommendationsApi.getRecommendationsOverview();
            setRecommendations(recsResponse.data.recommendations ?? []);
            recommendationsTableUtilities.updateTotalRows(recsResponse.data.total_rows);
            setRecommendationsSummary(recsSummaryResponse.data);
            setIsLoading(false);
        }
    };

    return (
        <Box>
            <RecommendationsSummaryCard recommendationsSummary={recommendationsSummary} />
            <RecommendationsCard isLoading={isLoading} recommendationApi={recommendationsApi} rows={recommendations}></RecommendationsCard>
        </Box>
    );
};

const useStyles = makeStyles<ITakeActionControllerProps>()((theme, props) => ({
    GridItem: {
        marginTop: '.75rem',
        marginBottom: '.75rem',
    },
    Paper: {
        height: 'auto',
    },
}));
export { TakeActionController };
