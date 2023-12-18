import React, { useEffect } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import ScheduleSelector, { IScheduleSelectorProps } from 'react-schedule-selector/dist/lib/ScheduleSelector';
import { UTCDate } from '@date-fns/utc';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IWeeklySchedulerProps extends Partial<IScheduleSelectorProps> {
    selectedDates: Date[];
    onChangeSelectedDates: (dates: Date[]) => void;
}

const WeeklyScheduler: React.FC<IWeeklySchedulerProps> = (props) => {
    const daysOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const { classes, cx } = useStyles(props);

    return (
        <div className={cx(classes.Container)}>
            <ScheduleSelector
                key={`${props.hourlyChunks}-${props.selectedDates.length}`}
                startDate={new UTCDate(2023, 5, 18, 0, 0, 0, 0)}
                selectionScheme={props.selectionScheme!}
                dateFormat={'EEEE'}
                timeFormat={'HH:mm'}
                selection={props.selectedDates}
                numDays={7}
                minTime={0}
                maxTime={24}
                hourlyChunks={6}
                unselectedColor={'#F1EDFE'}
                selectedColor={'#7C3AED'}
                onChange={props.onChangeSelectedDates}
                renderDateLabel={(date: Date) => <span className={cx(classes.NormalText)}>{daysOfWeekNames[date.getDay()]}</span>}
                renderTimeLabel={(date: Date) => <span className={cx(classes.NormalText)}>{date.getHours().toString().padStart(2, '0')}:{date.getMinutes().toString().padStart(2, '0')}</span>}
                {...props}
            />
        </div>
    );
};

const useStyles = makeStyles<IWeeklySchedulerProps>()((theme, props) => ({
    Container: {
        cursor: 'grab',
        overflow: 'auto',
    },
    NormalText: {
        fontWeight: 500,
        fontSize: '1rem',
        textAlign: 'center'
    }
}));

export { WeeklyScheduler };
