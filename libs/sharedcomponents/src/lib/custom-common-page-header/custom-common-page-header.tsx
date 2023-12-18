import React, { useEffect, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Grid, Paper } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICustomCommonPageHeaderProps {
    //ToDo: Going to just take some input to use and display the "<tab> common page header". And at some point if the drop down is the same for every page then that would not really need a props then potentially?
    message: string | React.ReactNode;
    justifyContent?:string
}
const CustomCommonPageHeader: React.FC<ICustomCommonPageHeaderProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [justifyContent,setJustifyContent] = useState('center');
    useEffect(()=>{
        if(props.justifyContent!==null){
            setJustifyContent(props.justifyContent as string)
        }
    },[props])
    return (
        <Paper elevation={0}>
            <Grid direction={'row'} justifyContent={justifyContent} container>
                <Grid className={cx(classes.GridItem)} item>
                    {props.message}
                </Grid>
            </Grid>
        </Paper>
    );
};

const useStyles = makeStyles<ICustomCommonPageHeaderProps>()((theme, props) => ({
    GridItem: {
        marginTop: '.75rem',
        marginBottom: '.75rem',
        marginRight:'.75rem'
    },
}));

export { CustomCommonPageHeader };
