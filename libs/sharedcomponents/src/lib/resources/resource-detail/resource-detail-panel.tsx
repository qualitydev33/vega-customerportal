import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Grid, Stack, Button, Typography, FormControlLabel, Switch, Skeleton } from '@mui/material';
import { IResource } from '@vegaplatformui/models';
import { CloudProviderIcon } from '../../utilities/logo-selector';
import { ParkingToggle } from '../../parking/parking-toggle';
import { RecommendationsApi } from '@vegaplatformui/apis';
import { getDetailsFromAzureId } from '@vegaplatformui/utils';
import { d } from '@pmmmwh/react-refresh-webpack-plugin/types/options';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ResourceDetailPanelProps {
    resource?: IResource;
    isLoading: boolean;
    onParkingScheduleByResourceId: (resourceId: string) => void;
    recommendationsApi: RecommendationsApi;
}

const renderSkeleton = (lines = 1) => {
    return <Skeleton variant='rectangular' animation='wave' width={250} height={30 * lines} />;
};

const ResourceDetailPanel: React.FC<ResourceDetailPanelProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return (
        <Stack gap={2}>
            <Typography fontWeight={600} variant={'h6'}>
                Details
            </Typography>
            <Grid container direction={'row'}>
                <Grid item className={cx(classes.label)}>
                    <Typography>Cloud Account</Typography>
                </Grid>
                <Grid item>
                    {props.isLoading ? (
                        renderSkeleton()
                    ) : (
                        <Stack direction={'row'}>
                            {props.resource && props.resource.provider_str && <CloudProviderIcon cloudProvider={props.resource.provider_str} />}
                            <Typography className={cx(classes.provider)}> {props.resource?.cloud_account_id}</Typography>
                        </Stack>
                    )}
                </Grid>
            </Grid>
            <Grid container direction={'row'}>
                <Grid item className={cx(classes.label)}>
                    <Typography>Instance Type</Typography>
                </Grid>
                <Grid item>
                    <Typography>{props.isLoading ? renderSkeleton() : props.resource?.type_str}</Typography>
                </Grid>
            </Grid>
            {/*            <Grid container direction={'row'}>
                <Grid item className={cx(classes.label)}>
                    <Typography>Cost/Month</Typography>
                </Grid>
                <Grid item>
                    <Typography>{props.isLoading ? renderSkeleton() : FormatNumberUSDHundredth(props.resource ? props.resource.cost : 0)}</Typography>
                </Grid>
            </Grid>*/}
            <Grid container direction={'row'}>
                <Grid item className={cx(classes.label)}>
                    <Typography>Region</Typography>
                </Grid>
                <Grid item>
                    <Typography>{props.isLoading ? renderSkeleton() : props.resource?.region}</Typography>
                </Grid>
            </Grid>
            {props.resource?.provider_str === 'AZURE' && (
                <>
                    <Grid container direction={'row'}>
                        <Grid item className={cx(classes.label)}>
                            <Typography>Resource Group</Typography>
                        </Grid>
                        <Grid item>
                            <Typography>
                                {props.isLoading ? renderSkeleton() : getDetailsFromAzureId(props.resource.resource_id).resourceGroup}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container direction={'row'}>
                        <Grid item className={cx(classes.label)}>
                            <Typography>Provider</Typography>
                        </Grid>
                        <Grid item>
                            <Typography>{props.isLoading ? renderSkeleton() : getDetailsFromAzureId(props.resource.resource_id).provider}</Typography>
                        </Grid>
                    </Grid>
                </>
            )}
            {props.resource?.os_type && (
                <Grid container direction={'row'}>
                    <Grid item className={cx(classes.label)}>
                        <Typography>OS Type</Typography>
                    </Grid>
                    <Grid item>
                        <Typography>{props.isLoading ? renderSkeleton() : props.resource.os_type}</Typography>
                    </Grid>
                </Grid>
            )}
            {props.resource?.is_parking_capable && (
                <Grid container direction={'row'}>
                    <Grid item className={cx(classes.label)}>
                        <Typography>Status</Typography>
                    </Grid>
                    <Grid item>
                        {props.isLoading ? (
                            renderSkeleton(4)
                        ) : (
                            <>
                                <ParkingToggle recommendationsApi={props.recommendationsApi} isLoading={props.isLoading} resource={props.resource} />
                                {/* <Button
                            className={cx(classes.parkingScheduleButton)}
                            variant={'contained'}
                            onClick={() => props.onParkingScheduleByResourceId(props.resource?.resource_id || '')}
                        >
                            SEE PARKING SCHEDULE
                        </Button> */}
                            </>
                        )}
                    </Grid>
                </Grid>
            )}
        </Stack>
    );
};

const useStyles = makeStyles<ResourceDetailPanelProps>()((theme, props) => ({
    label: {
        width: '200px',
        color: theme.palette.secondary.main,
    },
    provider: {
        marginLeft: theme.spacing(1),
    },
    parkingScheduleButton: {
        marginTop: theme.spacing(2),
        backgroundColor: theme.palette.grey[100],
        color: theme.palette.grey[900],
        '&:hover': {
            backgroundColor: theme.palette.grey[200],
        },
    },
}));

export { ResourceDetailPanel };
