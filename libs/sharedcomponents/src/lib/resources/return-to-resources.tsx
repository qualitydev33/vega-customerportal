import React from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { Button, Card, CardContent, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { ArrowBack, Refresh } from '@mui/icons-material';
import { NavigateFunction } from 'react-router-dom';
import { IResource } from '@vegaplatformui/models';
import { getDetailsFromAzureId } from '@vegaplatformui/utils';
import { StyledToolTip } from '../utilities/styled-tooltip';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IReturnToResourcesProps {
    resource?: IResource;
    navigate: NavigateFunction;
}

const ReturnToResources: React.FC<IReturnToResourcesProps> = (props) => {
    const commonStyles = useCommonStyles();
    const { classes, cx } = useStyles(props);
    return (
        <Grid wrap='nowrap' container direction='row' justifyContent={'space-between'} alignItems='center' spacing={2}>
            <Grid zeroMinWidth item xs={8}>
                <StyledToolTip
                    disableHoverListener={props.resource?.provider_str !== 'AZURE'}
                    title={props.resource?.resource_id}
                    placement='top-start'
                >
                    <Typography className={cx(classes.ResourceIdTypography)} fontWeight={600} variant={'h5'}>
                        {props.resource?.resource_id ? (
                            props.resource.provider_str === 'AZURE' ? (
                                getDetailsFromAzureId(props.resource.resource_id).name
                            ) : (
                                props.resource?.resource_id
                            )
                        ) : (
                            <Skeleton variant='rectangular' animation='wave' width={400} height={40} />
                        )}
                    </Typography>
                </StyledToolTip>
                {/*<Typography variant={'subtitle1'}>Vega does resource discovery every 30 minutes</Typography>*/}
            </Grid>
            <Grid container justifyContent='flex-end' alignItems='center' className={cx(classes.ButtonContainer)} item xs={4}>
                <Button
                    className={commonStyles.cx(commonStyles.classes.LowercaseTextButton, classes.BackToResourcesButton)}
                    variant='text'
                    startIcon={<ArrowBack />}
                    onClick={() => props.navigate(`/resource`)}
                >
                    Back To All Resources
                </Button>
                <Button
                    startIcon={<Refresh />}
                    className={commonStyles.cx(commonStyles.classes.GreyButton, commonStyles.classes.LowercaseTextButton, classes.RefreshButton)}
                    variant={'contained'}
                    disabled={true}
                >
                    Refresh
                </Button>
            </Grid>
        </Grid>
    );
};

const useStyles = makeStyles<IReturnToResourcesProps>()((theme, props) => ({
    BackToResourcesButton: {
        minWidth: '187px',
        whiteSpace: 'nowrap',
    },
    RefreshButton: {
        minWidth: '107px',
    },
    ResourceIdTypography: { overflowWrap: 'break-word' },
    ButtonContainer: { marginLeft: 'auto' },
}));

export { ReturnToResources };
