import React, { useEffect } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { GridRowParams } from '@mui/x-data-grid-premium';
import { Box, Stack, Typography } from '@mui/material';
import { RecommendationDetailsContentTable } from './recommendation-details-content-table';
import { RecommendationDetailsContentTabs } from './recommendation-details-content-tabs';
import { IGetRecommendationResponse, IRecommendation } from '@vegaplatformui/models';
import { RecommendationsApi } from '@vegaplatformui/apis';
import { useSetRecoilState } from 'recoil';
import { SnackBarOptions } from '@vegaplatformui/sharedcomponents';
import { usePrevious } from '@vegaplatformui/utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRecommendationsDetailsContentProps {
    gridRowParams: GridRowParams<IRecommendation>; //ToDo type with row data
    recommendationApi: RecommendationsApi;
    onLoadingCallback: (isLoading: boolean) => void;
}

const RecommendationDetailsContent: React.FC<IRecommendationsDetailsContentProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [recommendation, setRecommendation] = React.useState<IGetRecommendationResponse>();
    const setSnackbarOptions = useSetRecoilState(SnackBarOptions);
    const previousRowId = usePrevious(props.gridRowParams.row.id);

    useEffect(() => {
        if (previousRowId !== props.gridRowParams.row.id) {
            props.onLoadingCallback(true);
            loadRecommendation();
        }
    }, [props.gridRowParams]);

    const loadRecommendation = () => {
        // setLoading(true);
        props.recommendationApi
            .getRecommendation(props.gridRowParams.row.id)
            .then((response) => {
                setRecommendation(response.data);
                // setLoading(false);
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `Error loading recommendation details: ${error.message}`,
                });
                //  setLoading(false);
            })
            .finally(() => props.onLoadingCallback(false));
    };

    return (
        <Stack className={cx(classes.Container)}>
            <Typography>{recommendation?.rec.recommendation_message}</Typography>
            {recommendation === undefined ? (
                <></>
            ) : (
                <RecommendationDetailsContentTabs
                    loadRecommendation={loadRecommendation}
                    recommendationApi={props.recommendationApi}
                    recommendation={recommendation!}
                />
            )}
        </Stack>
    );
};

const useStyles = makeStyles<IRecommendationsDetailsContentProps>()((theme, props) => ({
    Container: {
        paddingLeft: '.5rem',
        paddingTop: '1rem',
        paddingBottom: '1rem',
    },
}));

export { RecommendationDetailsContent };
