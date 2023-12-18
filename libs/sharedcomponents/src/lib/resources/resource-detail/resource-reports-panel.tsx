import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Stack, Typography } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ResourceCostPanelProps {}

const ResourceReportsPanel: React.FC<ResourceCostPanelProps> = (props) => {
    const { classes, cx } = useStyles(props);
    return (
        <Stack>
            <Typography>quicksight</Typography>
        </Stack>
    );
};


const useStyles = makeStyles<ResourceCostPanelProps>()((theme, props) => ({}));

export { ResourceReportsPanel };