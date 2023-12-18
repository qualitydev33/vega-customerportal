import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Stack, Typography } from '@mui/material';
import { PageComingSoon } from '@vegaplatformui/sharedcomponents';
import { QuicksightReportsController } from '../quicksight-reports-controller/quicksight-reports-controller';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IVScoreControllerProps {}

const VScoreController: React.FC<IVScoreControllerProps> = (props) => {
    const { classes, cx } = useStyles(props);

    //return <PageComingSoon />;
    return <QuicksightReportsController folderNames={['v_score']} />;
};

const useStyles = makeStyles<IVScoreControllerProps>()((theme, props) => ({}));

export { VScoreController };
