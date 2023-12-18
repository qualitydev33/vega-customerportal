import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Button, Card, DialogContent, DialogTitle, Drawer, IconButton, List, ListItem, Stack, Switch, TextField, Typography } from '@mui/material';
import { ICloudProviderAccount } from '@vegaplatformui/models';
import { Form, FormField, StyledToolTip, useFetchFileBlobAndDownload } from '@vegaplatformui/sharedcomponents';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { VegaInformYaml } from '@vegaplatformui/sharedassets';
import { ArrowBack, Close, Download } from '@mui/icons-material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICloudProviderDiscoveryResultsDrawerProps {
    account: ICloudProviderAccount | undefined;
    test: string[];
    onBackDrawer: () => void;
    isDrawerOpen: boolean;
}

const CloudProviderDiscoveryResultsDrawer: React.FC<ICloudProviderDiscoveryResultsDrawerProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return (
        <Drawer
            PaperProps={{
                className: cx(classes.DrawerPaper),
            }}
            classes={{ root: cx(classes.DrawerRoot) }}
            anchor={'right'}
            open={props.isDrawerOpen}
            onClose={props.onBackDrawer}
            aria-labelledby='provider-discovery-results-drawer'
        >
            <DialogTitle variant={'h6'} id={'provider-discovery-results-title'}>
                <Grid container>
                    <Grid xs={10}>
                        <Stack className={cx(classes.DrawerTitle)} direction={'row'} justifyContent='flex-start' alignItems='flex-start' spacing={1}>
                            <IconButton onClick={props.onBackDrawer}>
                                <ArrowBack color={'secondary'} />
                            </IconButton>
                            <Stack direction={'column'}>
                                {props.account !== undefined ? props.account.account_id + "'s" : ''} Discovery Messages
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <Stack
                    className={cx(classes.DrawerContainer, classes.ContentWindow)}
                    direction='column'
                    justifyContent='flex-start'
                    alignItems='flex-start'
                    spacing={2}
                >
                    <Stack spacing={1}>
                        <Typography className={cx(classes.FormTitle)} variant={'body1'}>
                            Messages
                        </Typography>
                        {/*<Stack direction='column' justifyContent='center' alignItems='flex-start' spacing={2}>*/}
                        {/*    {props.test.map((message) => (*/}
                        {/*        <Typography variant={'body2'}>{message}</Typography>*/}
                        {/*    ))}*/}
                        {/*</Stack>*/}
                        <List className={cx(classes.IntructionList)}>
                            <Stack
                                className={cx(classes.InstructionStack)}
                                direction='column'
                                justifyContent='center'
                                alignItems='flex-start'
                                spacing={1.5}
                            >
                                {props.test.map((message) => (
                                    <ListItem key={message} className={cx(classes.InstructionStep)}>
                                        <Typography variant={'body2'}>{message}</Typography>
                                    </ListItem>
                                ))}
                            </Stack>
                        </List>
                    </Stack>
                </Stack>
            </DialogContent>
        </Drawer>
    );
};

const useStyles = makeStyles<ICloudProviderDiscoveryResultsDrawerProps>()((theme, props) => ({
    FormTitle: {
        fontWeight: 600,
        marginTop: '1rem',
        marginBottom: '.5rem',
    },
    DrawerRoot: {
        zIndex: '1300 !important' as any,
    },
    DrawerTitle: {},
    DrawerContainer: {
        marginLeft: '3rem',
    },
    ContentWindow: {
        width: '90%',
    },
    DrawerPaper: { width: '35%' },
    IntructionList: { listStyleType: 'disc', pl: 1 },
    InstructionStack: { marginLeft: '1.2rem' },
    InstructionStep: { display: 'list-item' },
}));

export { CloudProviderDiscoveryResultsDrawer };
