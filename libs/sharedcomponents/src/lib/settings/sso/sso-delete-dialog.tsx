import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Stack, Button } from '@mui/material';
import { IUserSettingSSO } from '@vegaplatformui/models';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';

interface SSODeleteDialogProps {
    selectedSSO: IUserSettingSSO;
    isOpen: boolean;
    onClose: () => void;
    onDelete: (alias: string) => void;
}

const SSODeleteDialog: React.FC<SSODeleteDialogProps> = (props) => {
    const commonStyles = useCommonStyles();
    return (
        <Dialog open={props.isOpen} onClose={props.onClose} fullWidth>
            <DialogTitle variant={'h6'} id='sso-delete-dialog'>
                Are you sure you want to delete "{props.selectedSSO.display_name}"?
            </DialogTitle>
            <DialogContent>
                <Typography>You cannot undo this action.</Typography>
            </DialogContent>
            <Stack direction={'row'} justifyContent={'flex-end'} columnGap={2} padding={2}>
                <Button variant='contained' className={commonStyles.classes.GreyButton} onClick={props.onClose}>
                    Cancel
                </Button>
                <Button color='error' variant='contained' onClick={() => props.onDelete(props.selectedSSO.alias)}>
                    Yes, Delete
                </Button>
            </Stack>
        </Dialog>
    );
};

const useStyles = makeStyles<SSODeleteDialogProps>()((theme, props) => ({}));

export { SSODeleteDialog };
