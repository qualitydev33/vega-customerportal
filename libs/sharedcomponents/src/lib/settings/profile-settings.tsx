import { Avatar, Button, Grid, Stack, TextField, Typography, Select, MenuItem, SelectChangeEvent, useTheme } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { Form, FormField } from '../forms';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IUserSettingAddress, IUserSettingProfile } from '@vegaplatformui/models';
import { CancelButton, fieldToStr, regexList, usStateList } from '@vegaplatformui/utils';
import { QuicksightReportLoadingSkeleton } from '@vegaplatformui/sharedcomponents';
import { countries } from 'countries-list';

export interface IProfileSettingsProps {
    isLoading: boolean;
    profile: IUserSettingProfile;
    address: IUserSettingAddress;
    onProfileUpdate: (data: IUserSettingProfile) => void;
    onAddressUpdate: (data: IUserSettingAddress) => void;
    onPhotoUpload: (data: File) => void;
    onPhotoRemove: () => void;
}

const profileFields = ['first_name', 'last_name', 'email', 'phone'] as const;
type ProfileFieldUnion = (typeof profileFields)[number];
const addressFields = ['street_address', 'city', 'zip_code'] as const;
type AddressFieldUnion = (typeof addressFields)[number];

const regex = {
    ...regexList,
    first_name: regexList.alphabetic,
    last_name: regexList.alphabetic,
    country: regexList.alphabetic_with_white_space,
    city: regexList.alphabetic_with_white_space,
    zip_code: regexList.number,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        },
    },
};

const ProfileSettings: React.FC<IProfileSettingsProps> = (props) => {
    const theme = useTheme();
    const countryOptions = Object.entries(countries).map(([code, country]) => ({
        code,
        country,
    }));

    const [addressFieldsBySelect, setAddressFieldsBySelect] = useState({
        state: props.address.state,
        country: props.address.country,
    });

    const [isProfileFieldsChanged, setisProfileFieldsChanged] = useState(false);
    const [isAddressFieldsBySelectChanged, setIsAddressFieldsBySelectChanged] = useState(false);
    const [disableStateSelect, setDisableStateSelect] = useState(false);

    const updatePhoto = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (evt.target.files?.length) {
            const file = evt.target.files[0];
            props.onPhotoUpload(file);
            evt.currentTarget.value = '';
        }
    };

    const handleSelect = (event: SelectChangeEvent<string>) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        setAddressFieldsBySelect((prev) => ({
            ...prev,
            [fieldName]: fieldValue,
        }));
        setIsAddressFieldsBySelectChanged(true);
        if (fieldName === 'country') {
            setDisableStateSelect(fieldValue !== 'US');
        }
    };

    const onProfileChange = () => {
        setisProfileFieldsChanged(true);
    };
    const onProfileSubmit: SubmitHandler<IUserSettingProfile> = (data) => {
        data.username = props.profile.username;
        setisProfileFieldsChanged(false);
        props.onProfileUpdate(data);
    };

    const onAddressSubmit: SubmitHandler<IUserSettingAddress> = (data) => {
        data.country = addressFieldsBySelect.country;
        data.state = addressFieldsBySelect.state;
        if (data.country !== 'US') data.state = '';
        props.onAddressUpdate(data);
    };

    useEffect(() => {
        setAddressFieldsBySelect((prev) => ({
            ...prev,
            country: props.address.country,
            state: props.address.state,
        }));
    }, [props.address]);

    return (
        <div>
            {/* Profile Info */}
            {props.isLoading ? (
                <QuicksightReportLoadingSkeleton />
            ) : (
                <>
                    <Form onSubmit={onProfileSubmit} onChange={onProfileChange}>
                        {({ errors, register, watch, setValue, formState, reset }) => {
                            return (
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Stack spacing={0.5}>
                                            <Typography variant='body1' fontWeight={600}>
                                                My Profile
                                            </Typography>
                                            <Typography variant='body2' color={theme.palette.grey[600]}>
                                                Manage your personal information.
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    {profileFields.map((profileField: ProfileFieldUnion, idx) => (
                                        <Grid item xs={12} sm={6} key={`${profileField}_${idx}`}>
                                            <FormField label={fieldToStr(profileField)} htmlFor={profileField}>
                                                <TextField
                                                    id={profileField}
                                                    size='small'
                                                    fullWidth={true}
                                                    {...register(profileField, {
                                                        required: {
                                                            value: profileField === 'phone' ? false : true,
                                                            message: 'Required',
                                                        },
                                                        validate: (value: string | undefined) => {
                                                            if (!String(value).match(regex[profileField]) && value) {
                                                                if (profileField === 'first_name' || profileField === 'last_name') {
                                                                    return 'Required to be alphabetic.';
                                                                }
                                                                if (profileField === 'email') {
                                                                    return 'Invalid emaill address.';
                                                                }
                                                                if (profileField === 'phone') {
                                                                    return 'Invalid phone number format. Please enter a 10-digit phone number, such as 2342813454';
                                                                }
                                                            }
                                                        },
                                                    })}
                                                    defaultValue={props.profile[profileField]}
                                                    error={!!errors[profileField]}
                                                    helperText={errors[profileField]?.message}
                                                />
                                            </FormField>
                                        </Grid>
                                    ))}
                                    <Grid item xs={12}>
                                        <FormField label='Photo' htmlFor='image'>
                                            <Grid container columnGap={1} direction='row' alignItems='flex-end'>
                                                {props.profile.image && (
                                                    <Grid item>
                                                        <Avatar
                                                            sx={{ width: 80, height: 80 }}
                                                            src={props.profile.image}
                                                            alt={`profile avatar ${props.profile.image}`}
                                                        />
                                                    </Grid>
                                                )}
                                                <Grid item>
                                                    <Button
                                                        disabled={props.profile.image ? true : false}
                                                        color='primary'
                                                        variant='contained'
                                                        component='label'
                                                        size='small'
                                                    >
                                                        Upload
                                                        <input
                                                            hidden
                                                            id='image'
                                                            type='file'
                                                            accept='image/*'
                                                            onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                                                                updatePhoto(evt);
                                                            }}
                                                        />
                                                    </Button>
                                                </Grid>
                                                {props.profile.image && (
                                                    <Grid item>
                                                        <Button
                                                            size='small'
                                                            variant='text'
                                                            onClick={() => {
                                                                props.onPhotoRemove();
                                                            }}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </FormField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={2} direction={'row'} justifyContent={'end'}>
                                            <CancelButton
                                                onClick={() => {
                                                    reset({
                                                        first_name: props.profile.first_name,
                                                        last_name: props.profile.last_name,
                                                        email: props.profile.email,
                                                        phone: props.profile.phone,
                                                    });
                                                    setisProfileFieldsChanged(false);
                                                }}
                                                disabled={!formState.isDirty || !isProfileFieldsChanged}
                                            >
                                                Cancel
                                            </CancelButton>
                                            <Button
                                                variant='contained'
                                                disabled={!formState.isDirty || !isProfileFieldsChanged}
                                                type='submit'
                                                disableElevation
                                            >
                                                Save
                                            </Button>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            );
                        }}
                    </Form>
                    {/* Address Info */}
                    <Form onSubmit={onAddressSubmit}>
                        {({ errors, register, watch, setValue, formState, reset }) => {
                            return (
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Stack spacing={0.5}>
                                            <Typography variant='body1' fontWeight={600}>
                                                Shipping Address
                                            </Typography>
                                            <Typography variant='body2' color={theme.palette.grey[600]}>
                                                This is where we'll send Cloud Heroes rewards.
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    {addressFields.map((addressField: AddressFieldUnion, idx) => (
                                        <Grid item xs={12} sm={6} key={`${addressField}_${idx}`}>
                                            <FormField label={fieldToStr(addressField)} htmlFor={addressField}>
                                                <TextField
                                                    id={addressField}
                                                    size='small'
                                                    fullWidth={true}
                                                    {...register(addressField, {
                                                        required: {
                                                            value: true,
                                                            message: 'Required',
                                                        },
                                                        validate: (value: string | undefined) => {
                                                            if (!String(value).match(regex[addressField])) {
                                                                if (addressField === 'street_address' || addressField === 'city') {
                                                                    return 'Required to be alphabetic.';
                                                                }
                                                                if (addressField === 'zip_code') {
                                                                    return 'Required to be numeric.';
                                                                }
                                                            }
                                                        },
                                                    })}
                                                    error={!!errors[addressField]}
                                                    helperText={errors[addressField]?.message}
                                                    defaultValue={props.address[addressField]}
                                                />
                                            </FormField>
                                        </Grid>
                                    ))}

                                    <Grid item xs={12} sm={6}>
                                        <FormField label='Country' htmlFor='country'>
                                            <Select
                                                id={'country'}
                                                labelId={'country'}
                                                size='small'
                                                fullWidth={true}
                                                {...register('country')}
                                                error={!!errors.country}
                                                MenuProps={MenuProps}
                                                defaultValue='US'
                                                value={addressFieldsBySelect.country !== null ? addressFieldsBySelect.country : ''}
                                                onChange={handleSelect}
                                            >
                                                <MenuItem key={'us'} value={'US'}>
                                                    United States
                                                </MenuItem>
                                                {countryOptions.map((option) => (
                                                    <MenuItem key={option.code} value={option.code}>
                                                        {option.country.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormField>
                                    </Grid>

                                    {!disableStateSelect && (
                                        <Grid item xs={12} sm={6}>
                                            <FormField label='State' htmlFor='state'>
                                                <Select
                                                    id={'state'}
                                                    labelId={'state'}
                                                    size='small'
                                                    fullWidth={true}
                                                    {...register('state')}
                                                    error={!!errors.state}
                                                    MenuProps={MenuProps}
                                                    // defaultValue={props.address.state}
                                                    value={addressFieldsBySelect.state !== null ? addressFieldsBySelect.state : ''}
                                                    onChange={handleSelect}
                                                    disabled={disableStateSelect}
                                                >
                                                    {usStateList.map((option) => (
                                                        <MenuItem key={option.name} value={option.abbreviation}>
                                                            {option.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormField>
                                        </Grid>
                                    )}

                                    <Grid item xs={12}>
                                        <Stack spacing={2} direction={'row'} justifyContent={'end'}>
                                            <CancelButton
                                                onClick={() => {
                                                    reset({
                                                        street_address: props.address?.street_address,
                                                        country: props.address?.country,
                                                        city: props.address?.city,
                                                        state: props.address?.state,
                                                        zip_code: props.address?.zip_code,
                                                    });
                                                    setAddressFieldsBySelect({
                                                        country: props.address.country,
                                                        state: props.address.state,
                                                    });
                                                    setIsAddressFieldsBySelectChanged(false);
                                                }}
                                                disabled={!formState.isDirty && !isAddressFieldsBySelectChanged}
                                            >
                                                Cancel
                                            </CancelButton>
                                            <Button
                                                variant='contained'
                                                disabled={!formState.isDirty && !isAddressFieldsBySelectChanged}
                                                type='submit'
                                                disableElevation
                                            >
                                                Save
                                            </Button>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            );
                        }}
                    </Form>
                </>
            )}
        </div>
    );
};

export { ProfileSettings };
