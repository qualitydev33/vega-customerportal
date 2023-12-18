import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';

import { QuicksightReportsController } from '../quicksight-reports-controller/quicksight-reports-controller';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IExecutiveKpiDashboardProps {}

const ExecutiveKpiController: React.FC<IExecutiveKpiDashboardProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return <QuicksightReportsController folderNames={['executivekpis']} />;
};

const useStyles = makeStyles<IExecutiveKpiDashboardProps>()((theme, props) => ({}));

export { ExecutiveKpiController };
