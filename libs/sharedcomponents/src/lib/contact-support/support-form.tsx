import React, { FormEventHandler, useRef, useState } from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import {
    Button,
    Collapse,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    LinearProgress,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { Form, FormField } from '@vegaplatformui/sharedcomponents';
import Keycloak from 'keycloak-js';
import { Close } from '@mui/icons-material';
import { ContactSupportForm, ContactSupportTopic, SupportEmailRecipient } from '@vegaplatformui/models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISupportFormProps {
    show: boolean;
    onClose: () => void;
    isSending: boolean;
    onSubmitFeedback: (data: ContactSupportForm) => void;
    keycloak: Keycloak;
    contactType: SupportEmailRecipient;
    selectedTopic: string;
    setSelectedTopic: React.Dispatch<React.SetStateAction<string>>;
}

const SupportForm: React.FC<ISupportFormProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();
    const ref = useRef<any>({
        form: undefined,
    });

    const onChangeForm: FormEventHandler<HTMLFormElement> = (event: any) => {
        const clonedSupportForm = { ...ref.current.form } as any;
        clonedSupportForm[event.target.name] = event.target.value;
        ref.current.form = { ...clonedSupportForm };
    };

    const handleChangeSelectedContactSupportType = (event: SelectChangeEvent<ContactSupportTopic>) => {
        const clonedSupportForm = { ...ref.current.form } as any;
        clonedSupportForm[event.target.name] = event.target.value;
        ref.current.form = { ...clonedSupportForm };
    };

    const onClose = () => {
        props.onClose();
    };

    return (
        <Dialog open={props.show} onClose={onClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
            <Stack justifyContent={'space-between'} direction={'row'}>
                <DialogTitle variant={'h5'}>
                    Contact Us
                    <Stack justifyContent={'flex-start'} alignItems={'center'} direction={'row'}>
                        <Typography variant='body2' color='textSecondary' component='p'>
                            Fill out the form and our team will get back to you within 24 hours.
                        </Typography>
                    </Stack>
                </DialogTitle>
                <IconButton onClick={onClose} size={'small'} className={cx(classes.CloseIcon)}>
                    <Close />
                </IconButton>
            </Stack>
            <Collapse in={props.isSending}>
                <LinearProgress variant='indeterminate' />
            </Collapse>
            <DialogContent className={cx(classes.DialogContent)}>
                <Grid>
                    <Form onSubmit={props.onSubmitFeedback} onChange={onChangeForm}>
                        {({ errors, register, watch, setValue }) => {
                            const topic = watch('topic');
                            const firstName = watch('firstName');
                            const lastName = watch('lastName');
                            const email = watch('email');
                            const subject = watch('subject');
                            const feedback = watch('feedback');

                            return (
                                <>
                                    <Grid container spacing={1}>
                                        <Grid xs={12} sm={6} item>
                                            <FormField label='First Name' htmlFor='firstName'>
                                                <TextField
                                                    placeholder='Enter first name'
                                                    id={'firstName'}
                                                    variant='outlined'
                                                    {...register('firstName', { required: true })}
                                                    error={!!errors.firstName}
                                                    helperText={errors.firstName?.message}
                                                    fullWidth
                                                    value={props.keycloak.idTokenParsed?.given_name}
                                                />
                                            </FormField>
                                        </Grid>
                                        <Grid xs={12} sm={6} item>
                                            <FormField label='Last Name' htmlFor='lastName'>
                                                <TextField
                                                    id={'lastName'}
                                                    placeholder='Enter last name'
                                                    variant='outlined'
                                                    fullWidth
                                                    {...register('lastName', { required: true })}
                                                    error={!!errors.lastName}
                                                    helperText={errors.lastName?.message}
                                                    value={props.keycloak.idTokenParsed?.family_name}
                                                />
                                            </FormField>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormField label='Email' htmlFor='email'>
                                                <TextField
                                                    id={'email'}
                                                    type='email'
                                                    placeholder='Enter email'
                                                    variant='outlined'
                                                    fullWidth
                                                    {...register('email', { required: true })}
                                                    error={!!errors.email}
                                                    helperText={errors.email?.message}
                                                    value={props.keycloak.idTokenParsed?.email}
                                                />
                                            </FormField>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormField label='Topic' htmlFor='topic'>
                                                <Select
                                                    id={'topic'}
                                                    variant='outlined'
                                                    fullWidth
                                                    {...register('topic', {
                                                        onChange: (event: any) => {
                                                            props.setSelectedTopic(event.target.value);
                                                            handleChangeSelectedContactSupportType(event);
                                                        },
                                                    })}
                                                    inputProps={{ readOnly: props.contactType === SupportEmailRecipient.CloudHero }}
                                                    error={!!errors.topic}
                                                    value={
                                                        props.contactType === SupportEmailRecipient.CloudHero
                                                            ? ContactSupportTopic.CloudHero
                                                            : props.selectedTopic
                                                    }
                                                >
                                                    <MenuItem value={'default'} disabled>
                                                        Select a topic
                                                    </MenuItem>
                                                    <MenuItem value={ContactSupportTopic.Billing}>{ContactSupportTopic.Billing}</MenuItem>
                                                    <MenuItem value={ContactSupportTopic.Tech}>{ContactSupportTopic.Tech}</MenuItem>
                                                    <MenuItem value={ContactSupportTopic.CloudHero}>{ContactSupportTopic.CloudHero}</MenuItem>
                                                </Select>
                                            </FormField>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormField label='Subject' htmlFor='subject'>
                                                <TextField
                                                    id={'subject'}
                                                    placeholder='Enter the subject'
                                                    variant='outlined'
                                                    fullWidth
                                                    {...register('subject', { required: true })}
                                                    error={!!errors.subject}
                                                    helperText={errors.subject?.message}
                                                />
                                            </FormField>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormField label='Feedback' htmlFor='feedback'>
                                                <TextField
                                                    id={'feedback'}
                                                    multiline
                                                    rows={4}
                                                    placeholder='Type your feedback here'
                                                    variant='outlined'
                                                    fullWidth
                                                    {...register('feedback', { required: true })}
                                                    error={!!errors.feedback}
                                                    helperText={errors.feedback?.message}
                                                />
                                            </FormField>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                disabled={props.selectedTopic === 'default' && props.contactType !== SupportEmailRecipient.CloudHero}
                                                type='submit'
                                                variant='contained'
                                                color='primary'
                                                fullWidth
                                            >
                                                Submit
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </>
                            );
                        }}
                    </Form>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

const useStyles = makeStyles<ISupportFormProps>()((theme, props) => ({
    CloseIcon: {
        position: 'absolute',
        top: 4,
        right: 4,
    },
    DialogContent: { marginTop: '-1.5rem' },
}));

export { SupportForm };
