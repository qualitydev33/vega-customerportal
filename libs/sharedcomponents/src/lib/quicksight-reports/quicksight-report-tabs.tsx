import React, { useState } from 'react';
import { Grid, Tab, Tabs, Typography } from '@mui/material';
import { IDashboard } from '@vegaplatformui/models';
import { makeStyles } from '@vegaplatformui/styling';
import { QuicksightReport, QuicksightReportLoading } from '@vegaplatformui/sharedcomponents';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { capitalizeFirstLetter } from '@vegaplatformui/utils';

export interface IQuicksightReportTabsProps {
    reports: IDashboard[];
    dashboardUrl: string;
}

const QuicksightReportTabs: React.FC<IQuicksightReportTabsProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [currentTab, setCurrentTab] = useState(0);
    const [dashboardLoading, setDashboardLoading] = useRecoilState(QuicksightReportLoading);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setCurrentTab(newValue);
        setDashboardLoading(true);
    };

    return props.reports && props.reports.length > 1 ? (
        <Grid container spacing={2} direction={'column'} className={cx(classes.tabsContainer)}>
            <Grid item xs={12}>
                <Tabs
                    variant={'scrollable'}
                    id={'reportTabs'}
                    value={currentTab}
                    onChange={handleTabChange}
                    aria-label='Select the report you want to work with'
                >
                    {props.reports &&
                        props.reports.length > 0 &&
                        props.reports.map((dashboard, index) => (
                            <Tab
                                disabled={dashboardLoading}
                                id={`${dashboard.name}-${index}`}
                                key={index}
                                label={capitalizeFirstLetter(dashboard.name)}
                                value={index}
                            />
                        ))}
                </Tabs>
            </Grid>
            <Grid item xs={12}>
                {props.reports && props.reports.length > 0 ? (
                    <QuicksightReport
                        isTabbed={props.reports.length > 1}
                        dashboardUrl={props.dashboardUrl}
                        dashboardId={props.reports && props.reports.length > 0 ? props.reports[currentTab].dashboardId : ''}
                    />
                ) : (
                    <Typography>
                        Sorry, this page isn't ready yet or you might not have permission to view it. Please check back later or contact support if
                        you believe this is an error.
                    </Typography>
                )}
            </Grid>
        </Grid>
    ) : props.reports && props.reports.length > 0 ? (
        <QuicksightReport
            isTabbed={props.reports.length > 1}
            dashboardUrl={props.dashboardUrl}
            dashboardId={props.reports && props.reports.length > 0 ? props.reports[currentTab].dashboardId : ''}
        />
    ) : (
        <Typography>
            Sorry, this page isn't ready yet or you might not have permission to view it. Please check back later or contact support if you believe
            this is an error.
        </Typography>
    );
};

const useStyles = makeStyles<IQuicksightReportTabsProps>()((theme, props) => ({
    tabsContainer: {
        marginTop: '-2rem',
    },
}));

export { QuicksightReportTabs };
