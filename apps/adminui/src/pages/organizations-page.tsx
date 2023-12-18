import * as React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { makeStyles } from '@vegaplatformui/styling';
import { OrganizationListToolbar } from '../components/organization/organization-list-toolbar';
import { OrganizationList } from '../components/organization/organization-list';
import { LoadingComponent, TableSkeleton } from '@vegaplatformui/sharedcomponents';

export interface IOrganizationsPageProps extends React.PropsWithChildren {}

const useStyles = makeStyles<IOrganizationsPageProps>()((theme, props) => ({
    welcomeCard: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

const OrganizationsPage: React.FC<IOrganizationsPageProps> = (props) => {
    const { classes, cx } = useStyles(props);
    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card className={cx(classes.welcomeCard)} variant='outlined'>
                        <OrganizationListToolbar />
                        <br />
                        <LoadingComponent fallback={<TableSkeleton />}>
                            <OrganizationList />
                        </LoadingComponent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};
export { OrganizationsPage };
