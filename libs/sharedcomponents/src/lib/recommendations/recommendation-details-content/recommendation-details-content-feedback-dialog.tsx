import React, { useEffect } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Icon,
    IconButton,
    Radio,
    RadioGroup,
    Stack,
    TextField,
} from '@mui/material';
import { CancelButton } from '@vegaplatformui/utils';
import { Close } from '@mui/icons-material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRecommendationDetailsContentFeedbackDialogProps {
    isDialogOpen: boolean;
    onCloseDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const RecommendationDetailsContentFeedbackDialog: React.FC<IRecommendationDetailsContentFeedbackDialogProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        setOpen(props.isDialogOpen);
    }, [props.isDialogOpen]);

    const onCloseDialog = () => {
        setOpen(false);
        props.onCloseDialog(false);
    };

    return (
        <Dialog fullWidth open={open} onClose={setOpen}>
            <DialogTitle textAlign={'center'}>
                {'Was this recommendation helpful?'}
                <IconButton onClick={onCloseDialog} size={'small'} className={cx(classes.CloseIcon)}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={1} direction={'column'} alignItems={'center'} justifyContent={'center'}>
                    <FormControl>
                        <RadioGroup row>
                            <FormControlLabel value='no' control={<Radio />} label='No' />
                            <FormControlLabel value='yes' control={<Radio />} label='Yes' />
                        </RadioGroup>
                    </FormControl>
                    <TextField fullWidth label='How can we improve?' multiline rows={4} placeholder='Type response here' />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button disableElevation variant={'contained'} onClick={onCloseDialog} autoFocus>
                    Submit Feedback
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const useStyles = makeStyles<IRecommendationDetailsContentFeedbackDialogProps>()((theme, props) => ({
    CloseIcon: {
        position: 'absolute',
        top: 4,
        right: 4,
    },
}));

export { RecommendationDetailsContentFeedbackDialog };
