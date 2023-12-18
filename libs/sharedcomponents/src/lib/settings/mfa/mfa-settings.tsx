import React, { useState, useEffect } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Grid, Stack, Switch, Typography, useTheme, Button } from '@mui/material';
import { Form, FormField } from '@vegaplatformui/sharedcomponents';
import { SubmitHandler } from 'react-hook-form';
import { CancelButton } from '@vegaplatformui/utils';
import { IUserSettingMFAStatusEnum } from '@vegaplatformui/models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MFASettingsProps {
    status: IUserSettingMFAStatusEnum;
    onSubmit: (data: string) => void;
}

const MFASettings: React.FC<MFASettingsProps> = (props) => {
    const { cx, classes } = useStyles();
    const theme = useTheme();

    const [mfaStatus, setMFAStatus] = useState<IUserSettingMFAStatusEnum>(IUserSettingMFAStatusEnum.DISABLED);
    const [isChangedFormState, setIsChangedFormState] = useState(false);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMFAStatus(event.target.checked ? IUserSettingMFAStatusEnum.REQUIRED : IUserSettingMFAStatusEnum.DISABLED);
        setIsChangedFormState(true);
    };

    const onSubmit: SubmitHandler<any> = (data) => {
        props.onSubmit(mfaStatus);
        setIsChangedFormState(false);
    };

    useEffect(() => {
        setMFAStatus(props.status);
    }, [props.status]);

    return (
        <Stack>
            <Form onSubmit={onSubmit}>
                {({ errors, register, watch, setValue, formState, reset }) => {
                    return (
                        <Stack rowGap={3} mt={2}>
                            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                <Stack>
                                    <Typography variant='body1' fontWeight={600}>
                                        Enable Multi-factor Authentication (MFA)
                                    </Typography>
                                    <Typography variant='body2' color={theme.palette.grey[600]}>
                                        Prevent unauthorized access to accounts by requiring authentication codes when signing in.
                                    </Typography>
                                </Stack>
                                <Switch checked={mfaStatus === IUserSettingMFAStatusEnum.REQUIRED} onChange={onChange} />
                            </Stack>

                            <Stack columnGap={2} direction={'row'} justifyContent={'end'}>
                                <CancelButton
                                    onClick={() => {
                                        setMFAStatus(props.status);
                                        setIsChangedFormState(false);
                                    }}
                                    variant='contained'
                                    color='inherit'
                                    disabled={!isChangedFormState}
                                    type='button'
                                >
                                    Cancel
                                </CancelButton>
                                <Button variant='contained' disabled={!isChangedFormState} type='submit'>
                                    Save
                                </Button>
                            </Stack>
                        </Stack>
                    );
                }}
            </Form>
        </Stack>
    );
};

const useStyles = makeStyles()((theme) => ({}));

export { MFASettings };
