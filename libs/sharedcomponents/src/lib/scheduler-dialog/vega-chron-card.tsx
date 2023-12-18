import React, { useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Card, Grid, IconButton, MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material';
import { Remove } from '@mui/icons-material';
import { Cron, CronError } from 'react-js-cron';
import { FormField, ParkingType, VegaSchedule } from '@vegaplatformui/sharedcomponents';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IChronCardProps {
    scheduleValue: VegaSchedule;
    scheduleValues: VegaSchedule[];
    setScheduleValues: React.Dispatch<React.SetStateAction<VegaSchedule[]>>;
}

const VegaChronCard: React.FC<IChronCardProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [parkingType, setParkingType] = useState<ParkingType>(ParkingType.Park);
    const [error, onError] = useState<CronError>();
    return (
        <Grid container direction={'column'} spacing={3}>
            <Grid container>
                <Grid item xs={6}>
                    <FormField label='Schedule Type' htmlFor='scheduleType'>
                        <Select
                            size={'small'}
                            defaultValue={props.scheduleValue.parkingType ?? parkingType}
                            onChange={(event: SelectChangeEvent<ParkingType>) => {
                                setParkingType(event.target.value as ParkingType);
                            }}
                        >
                            <MenuItem value={ParkingType.Unpark}>Unpark</MenuItem>
                            <MenuItem value={ParkingType.Park}>Park</MenuItem>
                        </Select>
                    </FormField>
                </Grid>
                <Grid item xs={6} alignItems={'flex-end'}>
                    <Stack direction={'column'} alignItems={'flex-end'}>
                        <IconButton
                            className={cx(classes.RemoveChronButton)}
                            onClick={() => {
                                //I am not sure how to do this removal process
                                const index = props.scheduleValues.indexOf(props.scheduleValue);
                                if (index > -1) {
                                    props.scheduleValues.splice(index);
                                }
                                props.setScheduleValues(props.scheduleValues);
                            }}
                        >
                            <Remove />
                        </IconButton>
                    </Stack>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Card elevation={0} style={{ overflowY: 'visible' }}>
                    <Cron
                        value={props.scheduleValue.chronTime}
                        setValue={() => {
                            //I also need to figure out how to correctly set the value of the chron. Without this being set after changing it enough it gets reset to the original value
                        }}
                        mode={'multiple'}
                        onError={onError}
                        displayError={true}
                    />
                </Card>
            </Grid>
        </Grid>
    );
};

const useStyles = makeStyles<IChronCardProps>()((theme, props) => ({
    RemoveChronButton: {
        marginRight: '1rem',
    },
}));

export { VegaChronCard };
