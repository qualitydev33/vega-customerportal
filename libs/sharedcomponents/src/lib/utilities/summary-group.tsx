import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Box, Chip, Grid, Typography } from '@mui/material';
import {ArrowUpward} from '@mui/icons-material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISummaryGroupProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    progress?: object|undefined
}

const SummaryGroup: React.FC<ISummaryGroupProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return (
        <Grid spacing={1} container direction={'row'} alignItems={'center'}>
            <Grid item>
                <Box className={cx(classes.IconBox)}>{props.icon}</Box>
            </Grid>
            <Grid item xs={6} container>
                <Grid item xs={12}>
                    <Typography variant={'h6'}>{props.title}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant={'subtitle2'}>{props.subtitle}</Typography>
                </Grid>
            </Grid>
            
            {props.progress &&<Grid> <Chip
            // eslint-disable-next-line @typescript-eslint/no-empty-function
                onDelete={()=>{}} 
                label="12%"
                className={cx(classes.ProgressIcon)}
                deleteIcon={<ArrowUpward color='success' />}
                />
            </Grid>}
        </Grid>
    );
};

const useStyles = makeStyles<ISummaryGroupProps>()((theme, props) => ({
    IconBox: {
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[500],
        color: theme.palette.grey[900],
        borderRadius: '8px',
        width: '3rem',
        height: '3rem',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
    },
    ProgressIcon:{
        color: theme.palette.success.light,
        background: 'rgba(111, 192, 139, 0.3)'        
    }
}));

export { SummaryGroup };
