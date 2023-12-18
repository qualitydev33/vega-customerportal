import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import {
    Button,
    ButtonProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Drawer,
    Grid,
    IconButton,
    Paper,
    PaperProps,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import Draggable from 'react-draggable';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { LinkAwsAccountDrawer } from './link-aws-account-drawer';
import { CustomSnackBarOptions } from '@vegaplatformui/sharedcomponents';
import { LinkAwsAccountForm, LinkAzureAccountForm, LinkGcpAccountForm } from '@vegaplatformui/models';
import { LinkAzureAccountDrawer } from './link-azure-account-drawer';
import { LinkGcpAccountDrawer } from './link-gcp-account-drawer';
import { SelectProviderAccountCard } from './select-provider-account-card';
import { SetterOrUpdater } from 'recoil';
import { Close } from '@mui/icons-material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICloudProviderSelecterDialogProps {
    isDialogOpen: boolean;
    onCloseDialog: () => void;
    onCloseLinkAwsDialog: () => void;
    onCloseLinkAzureDialog: () => void;
    onCloseLinkGcpDialog: () => void;
    onOpenBulkImportProviderDialog: () => void;
    onSubmitLinkAwsAccountForm: (data: LinkAwsAccountForm) => void;
    onSubmitLinkAzureAccountForm: (data: LinkAzureAccountForm) => void;
    onSubmitLinkGcpAccountForm: (data: LinkGcpAccountForm) => void;
    setSnackbarOptions: SetterOrUpdater<CustomSnackBarOptions>;
    serviceAccountJson: string;
    setServiceAccountJson: React.Dispatch<React.SetStateAction<string>>;
}

function PaperComponent(props: PaperProps) {
    const nodeRef = React.useRef(null);
    return (
        <Draggable nodeRef={nodeRef} handle='#choose-cloud-provider-dialog' cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper ref={nodeRef} {...props} />
        </Draggable>
    );
}

const CancelButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(grey[500]),
    backgroundColor: grey[300],
    '&:hover': {
        backgroundColor: grey[500],
    },
}));

const CloudProviderSelecterDrawer: React.FC<ICloudProviderSelecterDialogProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [cloudProvider, setCloudProvider] = React.useState<string | undefined>(undefined);
    const [isCloudProviderSelected, setIsCloudProviderSelected] = React.useState(false);
    const [onSubmitClicked, setOnSubmitClicked] = React.useState(false);

    const onChangeCloudProvider = (event: React.MouseEvent<HTMLElement>, cloudProvider: string | undefined) => {
        if (cloudProvider !== null) {
            setIsCloudProviderSelected(true);
        } else {
            setIsCloudProviderSelected(false);
        }
        setCloudProvider(cloudProvider);
    };

    const onCloseDialog = () => {
        props.onCloseDialog();
        setIsCloudProviderSelected(false);
        setCloudProvider(undefined);
    };

    return (
        <>
            <LinkAwsAccountDrawer
                onBackDrawer={() => {
                    setOnSubmitClicked(false);
                    setCloudProvider('');
                }}
                onCloseDialog={() => {
                    setOnSubmitClicked(false);
                    setCloudProvider('');
                    onCloseDialog();
                }}
                isDialogOpen={onSubmitClicked && cloudProvider === 'aws'}
                onSubmitLinkAwsAccountForm={props.onSubmitLinkAwsAccountForm}
                setSnackbarOptions={props.setSnackbarOptions}
            />
            <LinkAzureAccountDrawer
                isDialogOpen={onSubmitClicked && cloudProvider === 'azure'}
                onBackDrawer={() => {
                    setOnSubmitClicked(false);
                    setCloudProvider('');
                }}
                onCloseDialog={() => {
                    setOnSubmitClicked(false);
                    setCloudProvider('');
                    onCloseDialog();
                }}
                onSubmitLinkAzureAccountForm={props.onSubmitLinkAzureAccountForm}
                setSnackbarOptions={props.setSnackbarOptions}
            />
            <LinkGcpAccountDrawer
                isDialogOpen={onSubmitClicked && cloudProvider === 'gcp'}
                onBackDrawer={() => {
                    setOnSubmitClicked(false);
                    setCloudProvider('');
                    props.setServiceAccountJson(``);
                }}
                onCloseDialog={() => {
                    setOnSubmitClicked(false);
                    setCloudProvider('');
                    onCloseDialog();
                    props.setServiceAccountJson(``);
                }}
                onSubmitLinkGcpAccountForm={props.onSubmitLinkGcpAccountForm}
                setSnackbarOptions={props.setSnackbarOptions}
                serviceAccountJson={props.serviceAccountJson}
                setServiceAccountJson={props.setServiceAccountJson}
            />
            <Drawer
                PaperProps={{
                    className: cx(classes.DrawerPaper),
                }}
                className={cx(classes.DrawerRoot)}
                anchor={'right'}
                open={props.isDialogOpen}
                onClose={onCloseDialog}
                aria-labelledby='choose-cloud-provider-drawer'
            >
                <DialogTitle className={cx(classes.DrawerContent)} variant={'h6'} id='choose-cloud-provider-dialog'>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        Link Provider Account
                        <IconButton className={cx(classes.CloseButton)} onClick={onCloseDialog}>
                            <Close color={'secondary'} />
                        </IconButton>
                    </Stack>
                    <Typography variant={'body2'}>Select a cloud service provider.</Typography>
                </DialogTitle>
                <SelectProviderAccountCard
                    onCloseDialog={onCloseDialog}
                    onChangeCloudProvider={onChangeCloudProvider}
                    cloudProvider={cloudProvider}
                    isCloudProviderSelected={isCloudProviderSelected}
                    setOnSubmitClicked={setOnSubmitClicked}
                    onOpenBulkImportProviderDialog={props.onOpenBulkImportProviderDialog}
                />
                {/*<DialogActions className={cx(classes.DialogActions)}>*/}
                {/*    <CancelButton variant={'contained'} color={'secondary'} autoFocus onClick={onCloseDialog}>*/}
                {/*        Cancel*/}
                {/*    </CancelButton>*/}
                {/*    /!*<Button variant={'contained'} onClick={() => setOnSubmitClicked(true)} disabled={!isCloudProviderSelected}>*!/*/}
                {/*    /!*    Select Provider*!/*/}
                {/*    /!*</Button>*!/*/}
                {/*</DialogActions>*/}
            </Drawer>
        </>
    );
};

const useStyles = makeStyles<ICloudProviderSelecterDialogProps>()((theme, props) => ({
    DrawerRoot: {
        zIndex: '1300 !important' as any,
    },
    DrawerContent: {
        marginTop: '2rem',
        marginLeft: '3rem',
    },
    DialogActions: {
        marginRight: '1rem',
    },
    CloseButton: { float: 'right', marginRight: '-1.5rem', marginTop: '-5.5rem' },
    DrawerPaper: { width: '35%' },
}));

export { CloudProviderSelecterDrawer };
