import React from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { CreateContainerForm, FormatNumberUSDHundredth, FormField } from '@vegaplatformui/sharedcomponents';
import { FormControl, Stack, Typography } from '@mui/material';
import { ContainerFormTable } from './container-form-table';
import { GridRenderCellParams, GridRowSelectionModel, GridValueFormatterParams } from '@mui/x-data-grid-premium';
import { CloudProviderIcons } from '../utilities/logo-selector';
import { ContainerType, IResource, IVegaContainer } from '@vegaplatformui/models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IResourcePoolTableFormFieldProps {
    containerToEditForm: CreateContainerForm;
    children: IResource[];
    setSelectedChildren: React.Dispatch<React.SetStateAction<IResource[]>>;
    childrenTableName: string;
    containerToEdit?: IVegaContainer;
    isResourcesLoading: boolean;
}

const ChildrenPoolTableFormField: React.FC<IResourcePoolTableFormFieldProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();

    return (
        <Grid xs={12}>
            <FormField label={`${props.childrenTableName}`} htmlFor={'childrenTable'}>
                <Stack direction={'column'} spacing={0.5}>
                    <Typography className={commonStyles.cx(commonStyles.classes.CaptionText)} variant={'caption'}>
                        {props.containerToEditForm.containerType === ContainerType.Space
                            ? 'Select workloads to add to your space. You can skip this step and add workloads at a later time.'
                            : props.containerToEditForm.containerType === ContainerType.Workload
                            ? 'Select resource pools to add to your workload. You can skip this step and add resource pools at a later time.'
                            : 'Select resources to add to your resource pool. You can skip this step and add resources at a later time.'}
                    </Typography>
                    <FormControl id={'childrenTable'} fullWidth>
                        <ContainerFormTable
                            columns={[
                                {
                                    field: 'resource_id',
                                    headerName: 'Resource ID',
                                    flex: 1,
                                },
                                {
                                    field: 'provider_str',
                                    headerName: 'Cloud Account',
                                    flex: 1,
                                    renderCell: (params: GridRenderCellParams<IResource>) => (
                                        <Stack direction='row' justifyContent='flex-start' alignItems='center' spacing={1}>
                                            <CloudProviderIcons cloudProviders={[params.row?.provider_str]} />
                                            {params.row.cloud_account_id}
                                        </Stack>
                                    ),
                                },
                                {
                                    field: 'type_str',
                                    headerName: 'Instance Type',
                                    flex: 1,
                                },
                                /*                 {
                                    field: 'cost',
                                    headerName: 'Cost',
                                    flex: 1,
                                    valueFormatter: (params: GridValueFormatterParams) => FormatNumberUSDHundredth(params.value),
                                },*/
                                // {
                                //     field: 'budget',
                                //     headerName: 'Budget',
                                //     flex: 1,
                                // },
                            ]}
                            rows={props.children}
                            setSelectedChildren={props.setSelectedChildren}
                            isLoading={props.isResourcesLoading}
                            containerToEdit={props.containerToEdit}
                        />
                    </FormControl>
                </Stack>
            </FormField>
        </Grid>
    );
};

const useStyles = makeStyles<IResourcePoolTableFormFieldProps>()((theme, props) => ({
    CloudProviderIcon: {
        width: '2rem',
    },
}));

export { ChildrenPoolTableFormField };
