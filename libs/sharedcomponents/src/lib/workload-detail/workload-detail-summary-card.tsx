import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Card, CardContent, Stack } from '@mui/material';
import { SummaryGroup } from '../utilities/summary-group';
import { CloudCircle, FormatListNumbered, Savings } from '@mui/icons-material';
import { IVegaContainer } from '@vegaplatformui/models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IWorkloadSummaryCardProps {
    workloads: IVegaContainer[];
}

const WorkloadDetailSummaryCard: React.FC<IWorkloadSummaryCardProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return (
        <Card elevation={0}>
            <CardContent>
                <Stack direction={'row'} spacing={3} justifyContent={'space-around'} alignItems={'center'}>
                    {/*<SummaryGroup icon={<Savings />} title={'*$$*'} subtitle={'Total Cost'} />*/}
                    <SummaryGroup
                        icon={<FormatListNumbered />}
                        title={(props.workloads.length - 1).toString()}
                        subtitle={'Resource Pools & Children'}
                    />
                    {/* <SummaryGroup icon={<CloudCircle />} title={'*$$*'} subtitle={'Possible Savings'} />*/}
                </Stack>
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles<IWorkloadSummaryCardProps>()((theme, props) => ({}));

export { WorkloadDetailSummaryCard };
