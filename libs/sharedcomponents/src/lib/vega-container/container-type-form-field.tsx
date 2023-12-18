import React, { ReactNode } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { CreateContainerForm, FormField } from '@vegaplatformui/sharedcomponents';
import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { UseFormRegister } from 'react-hook-form';
import { ContainerTypeFormatter } from '../utilities/container-type-formatter';
import { ContainerType } from '@vegaplatformui/models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IContainerTypeFormFieldProps {
    register: UseFormRegister<CreateContainerForm>;
    containerToEdit: CreateContainerForm;
    onChangeDropDowns: (event: SelectChangeEvent<string>, child?: ReactNode) => void;
    createContainerLocation: ContainerType;
}

const ContainerTypeFormField: React.FC<IContainerTypeFormFieldProps> = (props) => {
    const { classes, cx } = useStyles(props);

    return (
        <>
            <FormField label='Container Type' htmlFor={'containerType'}>
                <FormControl id={'containerType'} fullWidth>
                    <Select
                        {...props.register('containerType', {
                            required: { value: true, message: 'Required' },
                            onChange: (event: any) => {
                                props.onChangeDropDowns(event);
                            },
                        })}
                        disabled={props.containerToEdit && props.containerToEdit.name !== ''}
                        placeholder={'Container Type'}
                        renderValue={() => ContainerTypeFormatter(props.containerToEdit?.containerType ?? ContainerType.Space)}
                        defaultValue={
                            props.containerToEdit && props.containerToEdit.name !== ''
                                ? props.containerToEdit.containerType
                                : props.containerToEdit
                                ? props.containerToEdit.containerType
                                : // : props.createContainerLocation === ContainerType.Space
                                  // ? ContainerType.Space
                                  // : props.createContainerLocation === ContainerType.Workload
                                  // ? ContainerType.Workload
                                  // : props.createContainerLocation === ContainerType.ResourcePool
                                  // ? ContainerType.ResourcePool
                                  ContainerType.Space
                        }
                    >
                        <MenuItem value={ContainerType.Space}>{ContainerTypeFormatter(ContainerType.Space)}</MenuItem>
                        <MenuItem value={ContainerType.Workload}>{ContainerTypeFormatter(ContainerType.Workload)}</MenuItem>
                        <MenuItem value={ContainerType.ResourcePool}>{ContainerTypeFormatter(ContainerType.ResourcePool)}</MenuItem>
                    </Select>
                </FormControl>
            </FormField>
        </>
    );
};

const useStyles = makeStyles<IContainerTypeFormFieldProps>()((theme, props) => ({}));

export { ContainerTypeFormField };
