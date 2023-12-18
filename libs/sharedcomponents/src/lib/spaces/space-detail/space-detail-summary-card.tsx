import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Card, CardContent, Stack } from '@mui/material';
import { SummaryGroup } from '../../utilities/summary-group';
import { CloudCircle, FormatListNumbered, Savings } from '@mui/icons-material';
import { IVegaContainer } from '@vegaplatformui/models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISpaceDetailSummaryCardProps {
    spaces: IVegaContainer[];
}

const SpaceDetailSummaryCard: React.FC<ISpaceDetailSummaryCardProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return (
        <Card elevation={0}>
            <CardContent>
                <Stack direction={'row'} spacing={3} justifyContent={'space-around'} alignItems={'center'}>
                    {/*
                    <SummaryGroup icon={<Savings />} title={'*Savings Potential*'} subtitle={'Possible Monthly Savings'} />
*/}
                    <SummaryGroup icon={<FormatListNumbered />} title={(props.spaces.length - 1).toString()} subtitle={'Workloads and Children'} />
                    <SummaryGroup icon={<CloudCircle />} title={'*Resources*'} subtitle={'Affected Resources'} />
                </Stack>
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles<ISpaceDetailSummaryCardProps>()((theme, props) => ({}));

export { SpaceDetailSummaryCard };
