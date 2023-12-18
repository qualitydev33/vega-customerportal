import React, { useEffect, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';

import { QuicksightReportsController } from '../quicksight-reports-controller/quicksight-reports-controller';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAnomaliesControllerProps {}

const AnomaliesController: React.FC<IAnomaliesControllerProps> = (props) => {
    return <QuicksightReportsController folderNames={['anomalies']} />;
};

const useStyles = makeStyles<IAnomaliesControllerProps>()((theme, props) => ({}));

export { AnomaliesController };
