import React, { useEffect, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { QuicksightReportsController } from '../quicksight-reports-controller/quicksight-reports-controller';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IForecastingControllerProps {}

const ForecastingController: React.FC<IForecastingControllerProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return <QuicksightReportsController folderNames={['forecasting']} />;
};

const useStyles = makeStyles<IForecastingControllerProps>()((theme, props) => ({}));

export { ForecastingController };
