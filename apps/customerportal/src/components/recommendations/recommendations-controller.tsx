import React, { useEffect, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { QuicksightReportsController } from '../quicksight-reports-controller/quicksight-reports-controller';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRecommendationsControllerProps {}

const RecommendationsController: React.FC<IRecommendationsControllerProps> = (props) => {
    return <QuicksightReportsController folderNames={['recommendations']} />;
};

const useStyles = makeStyles<IRecommendationsControllerProps>()((theme, props) => ({}));

export { RecommendationsController };
