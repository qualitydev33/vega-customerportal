import React, { useEffect } from 'react';
import { useCommonStyles, makeStyles } from '@vegaplatformui/styling';
import { DataGridPremium, GridCallbackDetails, GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid-premium';
import { GridActionsCellItem, GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';
import { AutoAwesome, Delete, Edit, MoreHoriz, Storage, TrafficSharp } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { IGetRecommendationResponse, IRecommendation, IResource, ResourcesEntity } from '@vegaplatformui/models';
import { EditRecommendationScheduleDialog } from './edit-recommendation-schedule-dialog';
import { RecommendationsApi } from '@vegaplatformui/apis';
import { useRecoilState } from 'recoil';
import { SnackBarOptions, StyledToolTip } from '@vegaplatformui/sharedcomponents';
import { dateToCron, ITimeZone } from '@vegaplatformui/utils';
import parser from 'cron-parser';
import { wait } from 'amazon-quicksight-embedding-sdk/dist/commons';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRecommendationsDetailsContentTableScheduledProps {
    recommendation: IGetRecommendationResponse;
    recommendationApi: RecommendationsApi;
    loadRecommendation: () => void;
}

const RecommendationDetailsContentTableScheduled: React.FC<IRecommendationsDetailsContentTableScheduledProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();
    const [selectedResources, setSelectedResources] = React.useState<IResource[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isEditRecommendationScheduleDialogOpen, setIsEditRecommendationScheduleDialogOpen] = React.useState<boolean>(false);
    const [isParkingScheduleDialogOpen, setIsParkingScheduleDialogOpen] = React.useState<boolean>(false);
    const [snackbarOptions, setSnackbarOptions] = useRecoilState(SnackBarOptions);
    const resourcesToDisplay = props.recommendation.resources.filter((resource) => {
        if (resource.schedule !== undefined && resource.schedule !== null) {
            return resource;
        }
    });

    const baseColumnOptions: Partial<GridColDef> = {
        align: 'left',
        headerAlign: 'left',
        flex: 1,
    };

    const onClickDeleteSchedules = (resource?: IResource) => {
        setIsLoading(true);
        props.recommendationApi
            .deleteScheduledActions(resource !== undefined ? [resource] : selectedResources)
            .then(async () => {
                await wait(1000);
                props.loadRecommendation();
                setSelectedResources([]);
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: `${resourcesToDisplay.length > 1 ? 'Schedules' : 'Schedule'} deleted successfully`,
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `Error deleting ${resourcesToDisplay.length > 1 ? 'Schedules' : 'Schedule'}: ${error.message}`,
                });
            })
            .finally(() => setIsLoading(false));
    };

    const columns: GridColDef[] = [
        {
            field: 'resource_id',
            headerName: 'Resource',
            ...baseColumnOptions,
        },
        {
            field: 'region',
            headerName: 'Location',
            ...baseColumnOptions,
        },
        {
            field: 'schedule',
            headerName: 'Date Scheduled',
            ...baseColumnOptions,
            valueFormatter: ({ value }) =>
                Intl.DateTimeFormat('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }).format(parser.parseExpression(value).next().toDate()),
        },
        {
            field: 'usage',
            headerName: 'Usage',
            ...baseColumnOptions,
        },
        {
            field: 'individual_vega_savings',
            headerName: 'Individual Vega Savings',
            ...baseColumnOptions,
        },
        {
            field: 'Actions',
            filterable: false,
            sortable: false,
            renderHeader: () =>
                resourcesToDisplay?.length > 0 && selectedResources.length > 1 ? (
                    <>
                        <StyledToolTip title={resourcesToDisplay.length > 1 ? 'Edit Schedules' : 'Edit Schedule'}>
                            <IconButton onClick={onClickEditSchedule}>
                                <Edit />
                            </IconButton>
                        </StyledToolTip>
                        <StyledToolTip title={resourcesToDisplay.length > 1 ? 'Delete Schedules' : 'Delete Schedule'}>
                            <IconButton onClick={() => onClickDeleteSchedules()}>
                                <Delete />
                            </IconButton>
                        </StyledToolTip>
                    </>
                ) : (
                    <></>
                ),
            flex: 1,
            align: 'right',
            renderCell: (params: GridRenderCellParams<IResource>) => (
                <strong>
                    <StyledToolTip title={'Edit'}>
                        <IconButton
                            disabled={selectedResources.length > 1}
                            onClick={(event) => onClickEditSchedule(event, params.row)}
                            tabIndex={params.hasFocus ? 0 : -1}
                        >
                            <Edit />
                        </IconButton>
                    </StyledToolTip>
                    <StyledToolTip title={'Delete'}>
                        <IconButton onClick={() => onClickDeleteSchedules(params.row)}>
                            <Delete />
                        </IconButton>
                    </StyledToolTip>
                </strong>
            ),
            ...baseColumnOptions,
        },
    ];

    const onRowSelectionModelChange = (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => {
        setSelectedResources(rowSelectionModel.map((id: GridRowId) => props.recommendation.resources.find((row: any) => row.id === id)) as any);
    };

    const onClickEditSchedule = (event: React.MouseEvent<HTMLButtonElement>, resource?: IResource) => {
        resource && setSelectedResources([resource]);

        switch (props.recommendation.rec.rec_type) {
            case 'Stop Instance': {
                setIsParkingScheduleDialogOpen(true);
                break;
            }
            default: {
                if (resource !== undefined) {
                    setSelectedResources([resource]);
                }
                setIsEditRecommendationScheduleDialogOpen(true);
                break;
            }
        }
    };

    const onClickSaveSchedules = (date: Date, timezone: ITimeZone | undefined) => {
        props.recommendationApi
            .putTakeAction({
                recommendationId: props.recommendation.rec.id,
                resources: selectedResources,
                schedule: dateToCron(date, timezone!.tzCode),
                timezone: timezone?.tzCode,
            })
            .then((response) => {
                setIsParkingScheduleDialogOpen(false);
                setSelectedResources([]);
                props.loadRecommendation();
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: `Your schedule for your ${
                        selectedResources && selectedResources.length > 1 ? 'Resources have' : 'Resource has'
                    } been edited`,
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem editing your schedule: ${error}`,
                });
            })
            .finally(() => {
                setIsEditRecommendationScheduleDialogOpen(false);
            });
    };

    return (
        <>
            <EditRecommendationScheduleDialog
                isDialogOpen={isEditRecommendationScheduleDialogOpen}
                onCloseDialog={() => setIsEditRecommendationScheduleDialogOpen(false)}
                selectedResources={selectedResources}
                onClickSaveSchedule={onClickSaveSchedules}
            />
            <DataGridPremium
                rowThreshold={0}
                className={cx(commonStyles.classes.DataGrid)}
                disableColumnMenu
                autoHeight={true}
                loading={isLoading}
                pageSizeOptions={[5, 10, 15]}
                density={'standard'}
                columns={columns}
                rows={resourcesToDisplay}
                checkboxSelection
                onRowSelectionModelChange={onRowSelectionModelChange}
                disableRowSelectionOnClick={true}
            />
        </>
    );
};

const useStyles = makeStyles<IRecommendationsDetailsContentTableScheduledProps>()((theme, props) => ({}));

export { RecommendationDetailsContentTableScheduled };
