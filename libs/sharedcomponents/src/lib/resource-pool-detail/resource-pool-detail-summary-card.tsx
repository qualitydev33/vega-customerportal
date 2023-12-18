import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Card, CardContent, Stack } from '@mui/material';
import { SummaryGroup } from '../utilities/summary-group';
import { CloudCircle, FormatListNumbered, Savings } from '@mui/icons-material';
import { IVegaContainer } from '@vegaplatformui/models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IResourcePoolDetailSummaryCardProps {
    resourcePool: IVegaContainer[];
}

const ResourcePoolDetailSummaryCard: React.FC<IResourcePoolDetailSummaryCardProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return (
        <Card elevation={0}>
            <CardContent>
                <Stack direction={'row'} spacing={3} justifyContent={'space-around'} alignItems={'center'}>
                    {/*
                    <SummaryGroup icon={<Savings />} title={'*Savings Potential*'} subtitle={'Possible Monthly Savings'} />
*/}
                    <SummaryGroup icon={<FormatListNumbered />} title={(props.resourcePool.length - 1).toString()} subtitle={'Resources'} />
                    <SummaryGroup icon={<CloudCircle />} title={'*Resources*'} subtitle={'Affected Resources'} />
                </Stack>
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles<IResourcePoolDetailSummaryCardProps>()((theme, props) => ({}));

export { ResourcePoolDetailSummaryCard };
