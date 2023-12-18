import React, { useEffect, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { ITagManagerControllerProps } from './tag-manager-controller';
import { QuicksightReportsController } from '../quicksight-reports-controller/quicksight-reports-controller';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITagManagementDashboardProps {}

const TagManagementController: React.FC<ITagManagerControllerProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return <QuicksightReportsController folderNames={['tagmanagement']} />;
};

const useStyles = makeStyles<ITagManagementDashboardProps>()((theme, props) => ({}));

export { TagManagementController };
