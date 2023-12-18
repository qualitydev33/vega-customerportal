import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Stack } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ResourceUtilizationPanelProps {}

const ResourceUtilizationPanel: React.FC<ResourceUtilizationPanelProps> = (props) => {
    const { classes, cx } = useStyles(props);
    return (
        <Stack></Stack>
    );
};


const useStyles = makeStyles<ResourceUtilizationPanelProps>()((theme, props) => ({}));

export { ResourceUtilizationPanel };