import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Stack } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ResourceHistoryPanelProps {}

const ResourceHistoryPanel: React.FC<ResourceHistoryPanelProps> = (props) => {
    const { classes, cx } = useStyles(props);
    return (
        <Stack></Stack>
    );
};


const useStyles = makeStyles<ResourceHistoryPanelProps>()((theme, props) => ({}));

export { ResourceHistoryPanel };