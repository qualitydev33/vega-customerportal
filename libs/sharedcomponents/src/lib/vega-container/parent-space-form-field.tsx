import React, { ReactNode } from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { CreateContainerForm, FormField } from '@vegaplatformui/sharedcomponents';
import { FormControl, MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { UseFormRegister } from 'react-hook-form';
import { ContainerType, IVegaContainer } from '@vegaplatformui/models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IParentSpaceFormFieldProps {
    register: UseFormRegister<CreateContainerForm>;
    containerToEdit: CreateContainerForm;
    onChangeDropDowns: (event: SelectChangeEvent<string>, child?: ReactNode) => void;
    spaces: IVegaContainer[];
}

const ParentSpaceFormField: React.FC<IParentSpaceFormFieldProps> = (props) => {
    const { classes, cx } = useCommonStyles();

    return (
        <>
            <Grid xs={12}>
                <FormField
                    label={
                        props.containerToEdit.containerType === ContainerType.Workload
                            ? 'Containing Space'
                            : props.containerToEdit.containerType === ContainerType.ResourcePool
                            ? 'Containing Workload'
                            : ''
                    }
                    htmlFor={'containingSpace'}
                >
                    <Stack direction={'column'} spacing={0.5}>
                        <Typography className={cx(classes.CaptionText)} variant={'caption'}>
                            {/*'Choose a containing Space (parent) for this Workload. You can skip this and select a space at a later time, and it will be added to the default space.*/}
                            {props.containerToEdit.containerType === ContainerType.Workload
                                ? `This workload will fall under 'Default Space' until you choose a different containing space. You can edit this at any time.`
                                : props.containerToEdit.containerType === ContainerType.ResourcePool
                                ? `This resource pool will fall under 'Default Workload' until you choose a different containing workload. You can edit this at any time.`
                                : ''}
                        </Typography>
                        <FormControl id={'containingSpace'} fullWidth>
                            <Select
                                {...props.register('space_id', {
                                    onChange: (event: any) => {
                                        props.onChangeDropDowns(event);
                                    },
                                })}
                                value={props.containerToEdit ? props.containerToEdit.space_id : ''}
                            >
                                {props.spaces.map((space) => (
                                    <MenuItem key={space.id} value={space.id}>
                                        {space.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </FormField>
            </Grid>
        </>
    );
};

const useStyles = makeStyles<IParentSpaceFormFieldProps>()((theme, props) => ({}));

export { ParentSpaceFormField };
