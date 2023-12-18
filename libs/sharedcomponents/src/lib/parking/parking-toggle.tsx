import { IResource } from '@vegaplatformui/models';
import { alpha, styled } from '@mui/material/styles';
import { FormControlLabel, Grid, Skeleton, Switch } from '@mui/material';
import { green, pink } from '@mui/material/colors';
import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { RecommendationsApi } from '@vegaplatformui/apis';
import { useSnackbar } from 'notistack';

interface IParkingToggleProps {
    resource: IResource;
    isLoading: boolean;
    recommendationsApi: RecommendationsApi;
}

const ParkSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase': {
        color: pink[600],
    },
    '& .MuiSwitch-switchBase + .MuiSwitch-track': {
        backgroundColor: pink[600],
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: green[600],
        '&:hover': {
            backgroundColor: alpha(green[600], theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: green[600],
    },
}));

const renderSkeleton = (lines = 1) => {
    return <Skeleton variant='rectangular' animation='wave' width={250} height={30 * lines} />;
};

const ParkingToggle: React.FC<IParkingToggleProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [isRunning, setIsRunning] = React.useState<boolean>(props.resource?.is_running || false);
    const [isLoading, setIsLoading] = React.useState<boolean>(props.isLoading);
    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        setIsLoading(props.isLoading);
    }, [props.isLoading]);

    const onClickParkingToggle = () => {
        setIsLoading(true);
        if (!isRunning) {
            props.recommendationsApi
                .postTakeImmediateAction({
                    resourceId: props.resource.id,
                    action: 'unpark',
                })
                .then((response) => {
                    enqueueSnackbar('Your resource is unparking.', {
                        autoHideDuration: 5000,
                        variant: 'info',
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    });
                    setIsRunning(true);
                })
                .catch((error) => {
                    enqueueSnackbar(`There was an error unparking your resource: ${error}`, {
                        autoHideDuration: 5000,
                        variant: 'error',
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    });
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            props.recommendationsApi
                .postTakeImmediateAction({
                    resourceId: props.resource.id,
                    action: 'park',
                })
                .then((response) => {
                    enqueueSnackbar('Your resource is parking.', {
                        autoHideDuration: 5000,
                        variant: 'info',
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    });
                    setIsRunning(false);
                })
                .catch((error) => {
                    enqueueSnackbar(`There was an error parking your resource: ${error}`, {
                        autoHideDuration: 5000,
                        variant: 'error',
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    });
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    return props.resource?.is_parking_capable ? (
        <FormControlLabel
            control={<ParkSwitch onClick={onClickParkingToggle} checked={isRunning} />}
            label={!isRunning ? 'Stopped' : 'Running'}
            labelPlacement='end'
            disabled={isLoading}
        />
    ) : (
        <></>
    );
};

const useStyles = makeStyles<IParkingToggleProps>()((theme, props) => ({
    label: {
        width: '200px',
        color: theme.palette.secondary.main,
    },
    provider: {
        color: theme.palette.primary.main,
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

export { ParkingToggle };
