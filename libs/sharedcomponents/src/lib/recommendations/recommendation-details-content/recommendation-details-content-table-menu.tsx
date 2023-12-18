import React, { Dispatch, SetStateAction, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Stack } from '@mui/material';
import { IGetRecommendationResponse, IResource, ResourcesEntity } from '@vegaplatformui/models';
import { RecommendationDetailsDialog } from './recommendation-details-dialog';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { RecommendationsApi } from '@vegaplatformui/apis';
import { IParkingScheduleForm, SnackBarOptions, StyledToolTip } from '@vegaplatformui/sharedcomponents';
import { StyledIconButton } from '@vegaplatformui/utils';
import { PlayArrow, Schedule } from '@mui/icons-material';
import { DrawerScheduler } from '../../drawer-scheduler/drawer-scheduler';
import { useSetRecoilState } from 'recoil';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRecommendtionsDetailsContentTableMenuProps {
    recommendation: IGetRecommendationResponse;
    recommendationResources: IResource[];
    setSelectedResources: React.Dispatch<React.SetStateAction<IResource[]>>;
    selectedResources: IResource[];
    onClearResources: Dispatch<SetStateAction<GridRowSelectionModel>>;
    recommendationsApi: RecommendationsApi;
    isDisabled?: boolean;
    loadRecommendation: () => void;
}

const RecommendationDetailsContentTableMenu: React.FC<IRecommendtionsDetailsContentTableMenuProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [showRecDetailsDialog, setShowRecDetailsDialog] = useState(false);
    const [dialogToShow, setDialogToShow] = useState('');
    const [showDrawerScheduler, setShowDrawerScheduler] = useState(false);
    const setSnackbarOptions = useSetRecoilState(SnackBarOptions);
    const [isLoading, setIsLoading] = useState(false);

    const onCloseDialog = () => {
        props.setSelectedResources([]);
        setShowRecDetailsDialog(false);
        setTimeout(() => {
            props.onClearResources([]);
            props.setSelectedResources([]); //TioDo do we want to do this (clears the selected resources)
            setDialogToShow('');
        }, 200);
    };

    const onClickScheduleRecommendation = () => {
        switch (props.recommendation.rec.rec_type) {
            case 'Stop Instance':
                setShowDrawerScheduler(true);
                break;
            default:
                setDialogToShow('isScheduled');
                setShowRecDetailsDialog(true);
                break;
        }
    };

    const onClickActionNowRecommendation = () => {
        setDialogToShow('isActionNow');
        setShowRecDetailsDialog(true);
    };

    const onClickHushRecommendation = () => {
        setDialogToShow('isHushed');
        setShowRecDetailsDialog(true);
    };

    const onClickSaveSchedule = (schedule: IParkingScheduleForm) => {
        props.recommendationsApi
            .postParking({
                recommendation_id: props.recommendation.rec.id,
                name: schedule.name,
                description: schedule.description,
                resources: schedule.selectedResources,
                scheduled_on_times: schedule.schedule,
                num_hourly_chunks: schedule.intervals,
                is_active: true,
                observe_daylight_savings: schedule.isDaylightSavings,
                utc_offset: schedule.timezone?.offset,
            })
            .then((response) => {
                props.setSelectedResources([]);
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: `Schedule created.`,
                });
                setShowDrawerScheduler(false);
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `Error creating schedule: ${error}.`,
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <>
            <DrawerScheduler
                isServerPaginated={false}
                onCancel={() => setShowDrawerScheduler(false)}
                isOpen={showDrawerScheduler}
                width={'60%'}
                resources={props.recommendation.resources.filter((resource) => {
                    if (!resource.is_actioned) {
                        return resource;
                    }
                })}
                isLoading={isLoading}
                onCloseDrawer={() => setShowDrawerScheduler(false)}
                onSave={onClickSaveSchedule}
                selectedResources={props.selectedResources}
            />
            <RecommendationDetailsDialog
                loadRecommendation={props.loadRecommendation}
                isScheduled={dialogToShow === 'isScheduled'}
                isActionNow={dialogToShow === 'isActionNow'}
                isHushed={dialogToShow === 'isHushed'}
                onCloseDialog={onCloseDialog}
                showDialog={showRecDetailsDialog}
                recommendationResources={props.recommendationResources}
                recommendation={props.recommendation}
                recommendationsApi={props.recommendationsApi}
            />
            {/*            <Menu*/}
            {/*                id='basic-menu'*/}
            {/*                anchorEl={props.anchorEl}*/}
            {/*                open={open}*/}
            {/*                onClose={props.onCloseMenu}*/}
            {/*                MenuListProps={{*/}
            {/*                    'aria-labelledby': 'basic-button',*/}
            {/*                }}*/}
            {/*            >*/}
            {/*                <MenuItem onClick={onClickScheduleRecommendation}>Schedule</MenuItem>*/}
            {/*                <MenuItem onClick={onClickActionNowRecommendation}>Take action now</MenuItem>*/}
            {/*                /!**/}
            {/*                <MenuItem onClick={onClickHushRecommendation}>Hush</MenuItem>*/}
            {/**!/*/}
            {/*            </Menu>*/}
            <Stack direction={'row'} spacing={0.5}>
                <StyledToolTip title={'Schedule'}>
                    <StyledIconButton disabled={props.isDisabled} onClick={onClickScheduleRecommendation}>
                        <Schedule />
                    </StyledIconButton>
                </StyledToolTip>

                <StyledToolTip title={'Action Now'}>
                    <StyledIconButton disabled={props.isDisabled} onClick={onClickActionNowRecommendation}>
                        <PlayArrow />
                    </StyledIconButton>
                </StyledToolTip>
            </Stack>
        </>
    );
};

const useStyles = makeStyles<IRecommendtionsDetailsContentTableMenuProps>()((theme, props) => ({}));

export { RecommendationDetailsContentTableMenu };
