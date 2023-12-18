import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Box, Tab, Tabs } from '@mui/material';
import { RecommendationDetailsContentTable } from './recommendation-details-content-table';
import { RecommendationDetailsContentTableScheduled } from './recommendation-details-content-table-scheduled/recommendation-details-content-table-scheduled';
import { IGetRecommendationResponse, IRecommendation } from '@vegaplatformui/models';
import { RecommendationsApi } from '@vegaplatformui/apis';
import { RecommendationDetailsParkingSchedulesTable } from './recommendation-details-content-table-scheduled/recommendation-details-parking-schedules-table';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRecommendationsDetailsContentTabsProps {
    recommendation: IGetRecommendationResponse;
    recommendationApi: RecommendationsApi;
    loadRecommendation: () => void;
}

const RecommendationDetailsContentTabs: React.FC<IRecommendationsDetailsContentTabsProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const getScheduledTable = () => {
        switch (props.recommendation.rec.rec_type) {
            case 'Stop Instance':
                return (
                    <RecommendationDetailsParkingSchedulesTable
                        loadRecommendation={props.loadRecommendation}
                        recommendation={props.recommendation}
                        recommendationApi={props.recommendationApi}
                    />
                );
                break;
            default:
                return (
                    <RecommendationDetailsContentTableScheduled
                        loadRecommendation={props.loadRecommendation}
                        recommendationApi={props.recommendationApi}
                        recommendation={props.recommendation}
                    />
                );
                break;
        }
    };

    return (
        <Box className={cx(classes.Container)}>
            <Box className={cx(classes.TabsContainer)}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label='To Do' />
                    <Tab label='Scheduled' />
                </Tabs>
            </Box>
            {value === 0 && (
                <RecommendationDetailsContentTable
                    loadRecommendation={props.loadRecommendation}
                    recommendationsApi={props.recommendationApi}
                    recommendation={props.recommendation}
                />
            )}
            {value === 1 && getScheduledTable()}
        </Box>
    );
};

const useStyles = makeStyles<IRecommendationsDetailsContentTabsProps>()((theme, props) => ({
    Container: { width: '100%' },
    TabsContainer: { borderBottom: 1, borderColor: 'divider' },
}));

export { RecommendationDetailsContentTabs };
