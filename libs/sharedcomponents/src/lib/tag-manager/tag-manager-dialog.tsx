import React, { FormEvent, FormEventHandler, useEffect, useRef } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import {
    Button,
    ButtonProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    PaperProps,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import { VegaTag } from './tag-manager-table';
import { Form, FormField } from '../forms';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { SubmitHandler } from 'react-hook-form';
import { CancelButton } from '@vegaplatformui/utils';
import { Delete, DeleteForever } from '@mui/icons-material';
import Draggable from 'react-draggable';

export interface ITagManagerDialogProps {
    isDialogOpen: boolean;
    onCloseDialog: () => void;
    vegaTagToEdit?: VegaTag;
    onSubmitTagForm: (data: VegaTag) => void;
}

function PaperComponent(props: PaperProps) {
    const nodeRef = React.useRef(null);
    return (
        <Draggable nodeRef={nodeRef} handle='#tag-manager-dialog' cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper ref={nodeRef} {...props} />
        </Draggable>
    );
}

const defaultTag: VegaTag = {
    id: '',
    key: '',
    values: [],
    resources: '',
    required: false,
    description: '',
    createdAt: '',
};

const TagManagerDialog: React.FC<ITagManagerDialogProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const ref = useRef({
        tagValueToAdd: '',
    });

    const [tagToEdit, setTagToEdit] = React.useState<VegaTag>(props.vegaTagToEdit ?? defaultTag);

    useEffect(() => {
        if (props.vegaTagToEdit) {
            setTagToEdit(props.vegaTagToEdit);
        }
    }, [props.vegaTagToEdit]);

    const onSubmitForm: SubmitHandler<VegaTag> = (data) => {
        const formToSubmit = { ...tagToEdit, ...data, isEditTag: props.vegaTagToEdit !== undefined };
        props.onSubmitTagForm(formToSubmit);
        props.onCloseDialog();
    };

    const onClickDeleteTagValue = (value: number) => {
        setTagToEdit({ ...tagToEdit, values: tagToEdit.values.filter((_, index) => index !== value) });
    };

    const onClickAddTagValue = () => {
        setTagToEdit({ ...tagToEdit, values: [...tagToEdit.values, ref.current.tagValueToAdd] });
        ref.current.tagValueToAdd = '';
    };

    const onClickRequired = () => {
        setTagToEdit({ ...tagToEdit, required: !tagToEdit.required });
    };

    const onCloseDialog = () => {
        setTagToEdit(defaultTag);
        ref.current.tagValueToAdd = '';
        props.onCloseDialog();
    };

    return (
        <Dialog fullWidth open={props.isDialogOpen} onClose={onCloseDialog} PaperComponent={PaperComponent} aria-labelledby='tag-manager-dialog'>
            <DialogTitle className={cx(classes.FormTitle)} id='tag-manager-dialog'>
                {props.vegaTagToEdit ? 'Edit Tag' : 'Create Tag'}
            </DialogTitle>
            <DialogContent>
                <Form onSubmit={onSubmitForm}>
                    {({ errors, register, watch, setValue }) => {
                        const key = watch('key');
                        const description = watch('description');
                        const required = watch('required');
                        const values = watch('values');

                        return (
                            <>
                                <Grid container spacing={2}>
                                    <Grid xs={12}>
                                        <FormField label='Key' htmlFor='key'>
                                            <TextField
                                                id={'key'}
                                                fullWidth={true}
                                                size='small'
                                                {...register('key', {
                                                    maxLength: { value: 128, message: 'Max length is 128 characters' },
                                                    required: 'Required',
                                                })}
                                                error={!!errors.key}
                                                defaultValue={tagToEdit.key}
                                                placeholder={'Key'}
                                                helperText={errors.key?.message}
                                            />
                                        </FormField>
                                    </Grid>
                                    <Grid xs={12}>
                                        <FormField label='Values' htmlFor='values'>
                                            <Stack direction={'row'} spacing={2}>
                                                <TextField
                                                    style={{ width: '77%' }}
                                                    id={'values'}
                                                    size='small'
                                                    {...register('values', {
                                                        onChange: (e) => {
                                                            ref.current.tagValueToAdd = e.target.value;
                                                        },
                                                        validate: (value) => {
                                                            const tagValues = tagToEdit.values.join(',') + value;
                                                            if (tagValues.length < 1) {
                                                                return 'Required';
                                                            } else if (tagValues.length > 255) {
                                                                return 'Max length is 255 characters';
                                                            }
                                                        },
                                                    })}
                                                    error={!!errors.values}
                                                    placeholder={'Values'}
                                                    defaultValue={ref.current.tagValueToAdd}
                                                    helperText={errors.values?.message}
                                                />
                                                <Button variant={'contained'} onClick={onClickAddTagValue}>
                                                    Add Value
                                                </Button>
                                            </Stack>
                                        </FormField>
                                        <Stack className={cx(classes.TagValuesStack)}>
                                            {tagToEdit.values.map((x, i) => {
                                                return (
                                                    <Stack key={i} direction={'row'} justifyContent={'space-between'}>
                                                        <Typography>{x}</Typography>
                                                        <IconButton onClick={() => onClickDeleteTagValue(i)}>
                                                            <DeleteForever />
                                                        </IconButton>
                                                    </Stack>
                                                );
                                            })}
                                        </Stack>
                                    </Grid>
                                    <Grid xs={12}>
                                        <FormField label='Description' htmlFor='description'>
                                            <TextField
                                                id={'description'}
                                                fullWidth={true}
                                                size='small'
                                                {...register('description', {
                                                    required: { value: true, message: 'Required' },
                                                })}
                                                error={!!errors.description}
                                                defaultValue={tagToEdit.description}
                                                placeholder={'Description'}
                                                helperText={errors.description?.message}
                                            />
                                        </FormField>
                                    </Grid>
                                    <Grid xs={12}>
                                        <FormField label='Required' htmlFor='required'>
                                            <Switch id={'required'} checked={tagToEdit.required} onClick={() => onClickRequired()} />
                                        </FormField>
                                    </Grid>
                                </Grid>
                                <DialogActions className={cx(classes.DialogActions)}>
                                    <CancelButton disableElevation={true} variant={'contained'} color={'secondary'} autoFocus onClick={onCloseDialog}>
                                        Cancel
                                    </CancelButton>
                                    <Button disableElevation={true} type={'submit'} variant={'contained'}>
                                        {props.vegaTagToEdit ? 'Edit' : 'Create'} Tag
                                    </Button>
                                </DialogActions>
                            </>
                        );
                    }}
                </Form>
            </DialogContent>
        </Dialog>
    );
};

const useStyles = makeStyles<ITagManagerDialogProps>()((theme, props) => ({
    FormStack: {
        marginTop: '1rem',
    },
    CancelButton: { color: theme.palette.grey[50] },
    DialogActions: {
        marginTop: '1rem',
        marginRight: '-.5rem',
    },
    FormTitle: {
        cursor: 'move',
        fontWeight: 600,
        marginTop: '1rem',
        marginBottom: '.5rem',
    },
    TagValuesStack: {
        marginTop: '1rem',
    },
}));

export { TagManagerDialog };
