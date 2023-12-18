import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { DialogContent, Divider, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import { AwsLogo, AzureLogo, GcpLogo } from '@vegaplatformui/sharedassets';
import { CancelButton } from '@vegaplatformui/utils';
import { ArrowForwardIos, FileCopy } from '@mui/icons-material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISelectProviderAccountCardProps {
    onCloseDialog(): void;
    onChangeCloudProvider(event: React.MouseEvent<HTMLElement>, cloudProvider: string | undefined): void;
    onOpenBulkImportProviderDialog: () => void;
    cloudProvider: string | undefined;
    isCloudProviderSelected: boolean;
    setOnSubmitClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectProviderAccountCard: React.FC<ISelectProviderAccountCardProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const control = {
        value: props.cloudProvider,
        onChange: props.onChangeCloudProvider,
    };

    return (
        <DialogContent className={cx(classes.DrawerContent, classes.FormContentWindow)}>
            {/*<Typography className={cx(classes.DialogInstruction)} variant={'subtitle1'} fontWeight={'600'}>*/}
            {/*    Select your cloud service provider*/}
            {/*</Typography>*/}
            <List component='nav'>
                <ListItemButton
                    key='aws'
                    onClick={(event) => {
                        props.setOnSubmitClicked(true);
                        props.onChangeCloudProvider(event, 'aws');
                    }}
                >
                    <ListItemText>
                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                            <Stack spacing={3} direction={'row'} alignItems={'center'}>
                                <AwsLogo className={cx(classes.CloudProviderIcon)} />
                                <Typography variant={'subtitle1'}>Amazon Web Services</Typography>
                            </Stack>
                            <Stack direction={'row'} justifyContent={'flex-end'}>
                                <ArrowForwardIos fontSize={'small'} className={cx(classes.ArrowIcon)} />
                            </Stack>
                        </Stack>
                    </ListItemText>
                </ListItemButton>
                <Divider />
                <ListItemButton
                    divider
                    key='azure'
                    onClick={(event) => {
                        props.setOnSubmitClicked(true);
                        props.onChangeCloudProvider(event, 'azure');
                    }}
                >
                    <ListItemText>
                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                            <Stack spacing={3} direction={'row'} alignItems={'center'}>
                                <AzureLogo className={cx(classes.CloudProviderIcon)} />
                                <Typography variant={'subtitle1'}>Microsoft Azure</Typography>
                            </Stack>
                            <ArrowForwardIos fontSize={'small'} className={cx(classes.ArrowIcon)} />
                        </Stack>
                    </ListItemText>
                </ListItemButton>
                <Divider />
                <ListItemButton
                    divider
                    key='gcp'
                    onClick={(event) => {
                        props.setOnSubmitClicked(true);
                        props.onChangeCloudProvider(event, 'gcp');
                    }}
                >
                    <ListItemText>
                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                            <Stack spacing={3} direction={'row'} alignItems={'center'}>
                                <GcpLogo className={cx(classes.CloudProviderIcon)} />
                                <Typography variant={'subtitle1'}>Google Cloud Platform</Typography>
                            </Stack>
                            <ArrowForwardIos fontSize={'small'} className={cx(classes.ArrowIcon)} />
                        </Stack>
                    </ListItemText>
                </ListItemButton>
                <Divider />
                <ListItemButton
                    divider
                    key='bulk'
                    onClick={(event) => {
                        props.onOpenBulkImportProviderDialog();
                    }}
                >
                    <ListItemText>
                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                            <Stack spacing={3} direction={'row'} alignItems={'center'}>
                                <FileCopy fontSize={'large'} className={cx(classes.CloudProviderIcon)} />
                                <Typography variant={'subtitle1'}>Bulk Provider Import</Typography>
                            </Stack>
                            <ArrowForwardIos fontSize={'small'} className={cx(classes.ArrowIcon)} />
                        </Stack>
                    </ListItemText>
                </ListItemButton>
                <Divider />
            </List>
            {/*<ToggleButtonGroup onClick={() => props.setOnSubmitClicked(true)} fullWidth={true} size='large' {...control} aria-label='Large sizes'>*/}
            {/*    [*/}
            {/*    <ToggleButton className={cx(classes.AwsButton)} value='aws' key='aws' fullWidth={true}>*/}
            {/*        <Stack>*/}
            {/*            <AwsLogo className={cx(classes.CloudProviderIcon)} />*/}
            {/*            <Typography>AWS</Typography>*/}
            {/*        </Stack>*/}
            {/*    </ToggleButton>*/}
            {/*    ,*/}
            {/*    <ToggleButton className={cx(classes.GcpButton)} value='gcp' key='gcp'>*/}
            {/*        <Stack>*/}
            {/*            <GcpLogo className={cx(classes.CloudProviderIcon)} />*/}
            {/*            <Typography>GCP</Typography>*/}
            {/*        </Stack>*/}
            {/*    </ToggleButton>*/}
            {/*    ,*/}
            {/*    <ToggleButton className={cx(classes.AzureButton)} value='azure' key='azure'>*/}
            {/*        <Stack>*/}
            {/*            <AzureLogo className={cx(classes.AzureIcon)} />*/}
            {/*            <Typography>Azure</Typography>*/}
            {/*        </Stack>*/}
            {/*    </ToggleButton>*/}
            {/*    ]*/}
            {/*</ToggleButtonGroup>*/}
        </DialogContent>
    );
};

const useStyles = makeStyles<ISelectProviderAccountCardProps>()((theme, props) => ({
    CloudProviderIcon: {
        width: '2rem',
    },
    AzureIcon: {
        width: '7rem',
        marginBottom: '1rem',
    },
    AwsButton: { borderRadius: '0px', border: '1px solid rgba(0, 0, 0, 0.12)', marginRight: '2rem', textTransform: 'none' },
    GcpButton: {
        borderRadius: '0px',
        borderLeft: '1px solid rgba(0, 0, 0, 0.12) !important',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        marginRight: '2rem',
        textTransform: 'none',
    },
    AzureButton: { borderLeft: '1px solid rgba(0, 0, 0, 0.12) !important', textTransform: 'none' },
    DialogInstruction: {
        marginBottom: '1rem',
    },
    ArrowIcon: {
        color: theme.palette.grey[300],
    },
    DrawerContent: {
        marginLeft: '3rem',
    },
    FormContentWindow: {
        width: '90%',
    },
}));

export { SelectProviderAccountCard };
