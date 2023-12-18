import React from 'react';
import { styled } from '@mui/material/styles';
import { Tooltip, tooltipClasses, TooltipProps } from '@mui/material';

export const StyledToolTip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: theme.palette.grey[900],
        },
        [`& .${tooltipClasses.arrow}`]: {
            color: theme.palette.grey[900],
        },
    })
);
