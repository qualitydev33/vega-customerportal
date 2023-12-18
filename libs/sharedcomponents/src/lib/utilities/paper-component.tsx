import React from 'react';
import { Paper, PaperProps } from '@mui/material';
import Draggable from 'react-draggable';

export function PaperComponent(props: PaperProps, handleName: string) {
    const nodeRef = React.useRef(null);
    return (
        <Draggable nodeRef={nodeRef} handle={handleName} cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper ref={nodeRef} {...props} />
        </Draggable>
    );
}
