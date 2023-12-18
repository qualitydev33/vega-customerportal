import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    TextField,
    Theme,
    Typography,
    useTheme,
} from '@mui/material';
import { IBusinessGrouping, IBusinessGroupingForm, IBusinessGroupingType, IUser } from '@vegaplatformui/models';
import { makeStyles } from '@vegaplatformui/styling';
import { CancelButton } from '@vegaplatformui/utils';
import React, { FormEventHandler, SetStateAction, useRef, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Form, FormField } from '@vegaplatformui/sharedcomponents';
import { LinkAwsAccountForm } from '@vegaplatformui/models';
import { BusinessGroupingScopedUser } from './business-grouping-scoped-user';

export interface IBusinessGroupingAddUpdateDialog {
    onSubmitBusinessGroupingForm: (data: IBusinessGroupingForm) => void;
    groupingToEdit: IBusinessGrouping | undefined;
    businessGroupingTypes: IBusinessGroupingType[];
    isDialogOpen: boolean;
    onCloseDialog: () => void;
    setGroupingToEdit: React.Dispatch<SetStateAction<IBusinessGrouping | undefined>>;
    availableUsers: IUser[];
    setAvailableUsers: React.Dispatch<SetStateAction<IUser[]>>;
    businessGroupingUsers: IUser[];
    setBusinessGroupingUsers: React.Dispatch<SetStateAction<IUser[]>>;
    selectedBusinessGroupingType: number;
    setSelectedBusinessGroupingType: React.Dispatch<SetStateAction<number>>;
}

export const BusinessGroupingAddUpdateDialog: React.FC<IBusinessGroupingAddUpdateDialog> = (props) => {
    const { classes, cx } = useStyles(props);
    const theme = useTheme();
    const ref = useRef<any>({
        form: undefined,
    });
    const [selectedBusinessGroupingType, setSelectedBusinessGroupingType] = useState<string[]>([]);

    const onSubmitForm: SubmitHandler<IBusinessGroupingForm> = (data) => {
        const formToSubmit = { ...data, isEditAccount: props.groupingToEdit !== undefined };
        props.onSubmitBusinessGroupingForm(formToSubmit);
        props.onCloseDialog();
    };

    function getStyles(id: any, data: any[], theme: Theme) {
        return {
            fontWeight: data.filter((item) => item.id === id).length < 1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
        };
    }

    const onChangeForm: FormEventHandler<HTMLFormElement> = (event: any) => {
        const clonedBusinessGrouping = { ...ref.current.form } as any;
        clonedBusinessGrouping[event.target.name] = event.target.value;
        ref.current.form = { ...clonedBusinessGrouping };
    };

    const handleChangeSelectedBusinessGroupingType = (event: SelectChangeEvent<typeof selectedBusinessGroupingType>) => {
        const clonedBusinessGrouping = { ...ref.current.form } as any;
        clonedBusinessGrouping[event.target.name] = event.target.value;
        ref.current.form = { ...clonedBusinessGrouping };
    };

    return (
        <Dialog
            maxWidth={'md'}
            fullWidth
            open={props.isDialogOpen}
            onClose={props.onCloseDialog}
            aria-labelledby='business-grouping-add-update-dialog'
        >
            <DialogTitle variant={'h6'} style={{ cursor: 'move' }} id='business-grouping-add-update-dialog'>
                {props.groupingToEdit ? 'Edit' : 'Create'} Business Grouping
            </DialogTitle>
            <DialogContent sx={{ paddingLeft: 2.5 }}>
                <Form onSubmit={onSubmitForm} onChange={onChangeForm}>
                    {({ errors, register, watch, setValue }) => {
                        const name = watch('name');
                        const type = watch('type');
                        const users = watch('users');

                        return (
                            <>
                                <Grid container spacing={2} gap={1}>
                                    <Grid xs={12} item>
                                        <FormField label='Name' htmlFor='name'>
                                            <TextField
                                                placeholder='Business Grouping'
                                                id={'name'}
                                                variant='outlined'
                                                {...register('name', {
                                                    required: { value: true, message: 'Required' },
                                                    validate: (name: string) => {
                                                        if (name.match('(.*?)\\s(.*?)')) {
                                                            return 'Name should not contain any spaces';
                                                        }
                                                    },
                                                })}
                                                inputProps={{ readOnly: !!props.groupingToEdit }}
                                                error={!!errors.name}
                                                helperText={errors.name?.message}
                                                fullWidth
                                                size='small'
                                                defaultValue={props.groupingToEdit?.name ?? ''}
                                            />
                                        </FormField>
                                    </Grid>
                                    <Grid xs={12} item>
                                        <FormField label='Business Grouping Type' htmlFor='type'>
                                            <Select
                                                fullWidth
                                                size='small'
                                                labelId='type'
                                                id='type'
                                                {...register('type', {
                                                    required: true,
                                                    onChange: (event: any) => {
                                                        props.setSelectedBusinessGroupingType(event.target.value);
                                                        handleChangeSelectedBusinessGroupingType(event);
                                                    },
                                                })}
                                                value={props.selectedBusinessGroupingType}
                                            >
                                                {props.businessGroupingTypes.map((businessGroupingTypes) => (
                                                    <MenuItem
                                                        style={getStyles(businessGroupingTypes.id, props.businessGroupingTypes, theme)}
                                                        key={'business_account_type_' + businessGroupingTypes.id}
                                                        value={businessGroupingTypes.id}
                                                    >
                                                        {businessGroupingTypes.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormField>
                                    </Grid>
                                    <BusinessGroupingScopedUser
                                        selectedUsers={props.businessGroupingUsers}
                                        setSelectedUsers={props.setBusinessGroupingUsers}
                                        availableUsers={props.availableUsers}
                                        setAvailableUsers={props.setAvailableUsers}
                                    />
                                </Grid>
                                <DialogActions className={cx(classes.DialogActions)}>
                                    <CancelButton
                                        disableElevation={true}
                                        variant={'contained'}
                                        color={'secondary'}
                                        autoFocus
                                        onClick={props.onCloseDialog}
                                    >
                                        Cancel
                                    </CancelButton>
                                    <Button disableElevation={true} type={'submit'} variant={'contained'}>
                                        {props.groupingToEdit ? 'Save Changes' : 'Create Grouping'}
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

const useStyles = makeStyles<IBusinessGroupingAddUpdateDialog>()((theme, props) => ({
    DialogActions: {
        marginTop: '1rem',
        marginRight: '-.5rem',
    },
    DialogActionsButtons: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 10,
    },
    FormTitle: {
        fontWeight: 600,
        marginTop: '1rem',
        marginBottom: '.5rem',
    },
}));
