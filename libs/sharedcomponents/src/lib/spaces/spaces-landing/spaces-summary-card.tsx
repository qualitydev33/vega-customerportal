import React, { useEffect, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { FormatListNumbered, CloudCircle, MonetizationOn, AccountTree, Savings } from '@mui/icons-material';
import { SummaryGroup } from '../../utilities/summary-group';
import { IVegaContainer } from '@vegaplatformui/models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISpacesSummaryCardProps {
    spaces: IVegaContainer[];
}

const SpacesSummaryCard: React.FC<ISpacesSummaryCardProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [ttlCost, setTtlCost] = useState(0);

    const [ttlSavings, setTtlSavings] = useState(0);

    useEffect(() => {
        let ttl = 0;
        let ttlSavings = 0;
        props.spaces.forEach((space: IVegaContainer) => {
            ttl = ttl + (space?.cost ?? 0);
        });

        props.spaces.forEach((space: IVegaContainer) => {
            ttlSavings = ttlSavings + ((space?.budget ?? 0) - (space?.cost ?? 0));
        });

        setTtlSavings(ttlSavings);
        setTtlCost(ttl);
    }, []);
    return (
        <Card elevation={0}>
            <CardContent>
                <Stack direction={'row'} spacing={3} justifyContent={'space-around'} alignItems={'center'}>
                    {/*                 <SummaryGroup
                        progress={{}}
                        icon={<MonetizationOn />}
                        title={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(ttlCost)}
                        subtitle={'Total Cost'}
                    />*/}
                    <SummaryGroup
                        icon={<AccountTree />}
                        title={props.spaces.filter((space) => space?.path.split('/').length < 2).length.toString()}
                        subtitle={'Spaces'}
                    />
                    {/*                    <SummaryGroup
                        icon={<Savings />}
                        title={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(ttlSavings)}
                        subtitle={'Monthly Savings'}
                    />*/}
                </Stack>
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles<ISpacesSummaryCardProps>()((theme, props) => ({}));

export { SpacesSummaryCard };
