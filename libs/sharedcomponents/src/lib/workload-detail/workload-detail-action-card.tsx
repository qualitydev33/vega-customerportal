import React, { ReactElement } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Button, ButtonTypeMap, Card, CardContent, ExtendButtonBase, Grid, Stack, Typography } from '@mui/material';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IWorkloadActionCardProps {
    actionTitle: string;
    actionDescription: string;
    actionButtons: EmotionJSX.Element[];
}

const WorkloadDetailActionCard: React.FC<IWorkloadActionCardProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return (
        <Card elevation={0}>
            <CardContent>
                <Grid container alignItems={'center'}>
                    <Grid item xs={6}>
                        <Stack spacing={1} direction={'column'}>
                            <Typography variant={'h6'} fontWeight={600}>
                                {props.actionTitle}
                            </Typography>
                            <Typography variant={'subtitle1'}>{props.actionDescription}</Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack spacing={1} direction={'row'} justifyContent={'flex-end'}>
                            {props.actionButtons.map((actionButton) => actionButton)}
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles<IWorkloadActionCardProps>()((theme, props) => ({}));

export { WorkloadDetailActionCard };
