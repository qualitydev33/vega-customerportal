import React, { FormEventHandler, ReactNode, useEffect, useRef } from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { SubmitHandler, ValidationRule } from 'react-hook-form';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    PaperProps,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { CancelButton } from '@vegaplatformui/utils';
import { ParentSpaceFormField } from './parent-space-form-field';
import { ChildrenPoolTableFormField } from './children-pool-table-form-field';
import { CreateContainerForm } from '../spaces/spaces-landing/spaces-landing';
import { Form, FormField } from '../forms';
import { ContainerType, IResource, IVegaContainer } from '@vegaplatformui/models';
import { GridRowSelectionModel } from '@mui/x-data-grid-premium';
import Draggable from 'react-draggable';
import { BudgetTextField } from '../utilities/budget-textfield';
import { FormattedNumberString, ReverseFormattedNumberString } from '../utilities/value-formatter-methods';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICreateContainerDialogProps {
    isDialogOpen: boolean;
    onCloseDialog: () => void;
    containerToEdit?: IVegaContainer;
    onClickDeleteSpace: (space?: IVegaContainer) => void;
    onSubmitCreateContainerForm: (data: CreateContainerForm, children: IResource[]) => void;
    allContainers: IVegaContainer[];
    spaces: IVegaContainer[];
    workloads: IVegaContainer[];
    resourcePools: IVegaContainer[];
    resources: IResource[];
    containerToEditForm: CreateContainerForm;
    setContainerToEditForm: React.Dispatch<React.SetStateAction<CreateContainerForm>>;
    createContainerLocation: ContainerType;
    enableResourcesTableDisplay?: boolean;
    isResourcesLoading: boolean;
    selectedResources?: IResource[];
}

function PaperComponent(props: PaperProps) {
    const nodeRef = React.useRef(null);
    return (
        <Draggable nodeRef={nodeRef} handle='#create-container-dialog' cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper ref={nodeRef} {...props} />
        </Draggable>
    );
}

const CreateContainerDialog: React.FC<ICreateContainerDialogProps> = ({ enableResourcesTableDisplay = true, ...props }) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();
    const [selectedChildren, setSelectedChildren] = React.useState<IResource[]>(
        props.selectedResources && props.selectedResources.length > 0 ? [...props.selectedResources] : []
    );
    const ref = useRef<any>({
        form: undefined,
    });
    const [isFormDirty, setIsFormDirty] = React.useState(false);

    useEffect(() => {
        ref.current.form = props.containerToEditForm;
    }, [props.containerToEditForm]);

    const minimumAllowedBudget = () => {
        //Get the combined children's budget and don't allow anything below that. If that is undefined (Then just allow the minimum budget as zero)
        //Showing the total budget in the message so that it will show what is the minimum amount
        const value = (props.allContainers.filter((container) => container.parent_id === props.containerToEdit?.id) !== undefined
        ? props.allContainers
              .filter((container) => container.parent_id === props.containerToEdit?.id)
              .reduce((totalAllocatedBudget, containerBudget) => totalAllocatedBudget + containerBudget.budget, 0)
        : undefined) ?? 0;
        return {
            value: value,
            message: `Budget must be zero or greater, and can not be smaller than totalled children's budget. Total Budget: ${value}`
        }
    };

    const maximumAllowedBudget = () => {
        //Get the parents budget, and only allow the difference between that budget and the combined children's budget. If that is undefined (parent does not have a budget, then allow crazy high number)
        //Just displaying the same calculation done in the value setter for the message
        const value = (props.allContainers.find((container) => container.id === props.containerToEdit?.parent_id)?.budget !== undefined
        ? props.allContainers.find((container) => container.id === props.containerToEdit?.parent_id)!.budget -
          props.allContainers
              .filter((container) => container.parent_id === props.containerToEdit?.parent_id && container.id !== props.containerToEdit?.id)
              .reduce((totalAllocatedBudget, containerBudget) => totalAllocatedBudget + containerBudget.budget, 0)
        : undefined) ?? 999999999999999;
        return {
            value: value,
            message: `Budget can not be larger than available allocation from parent's budget. Available: ${value}`,
        }
    };

    //For some part of the dialog I assume it will have a ternary operator that will either call the spaces, workload, or resources cards

    const onSubmitForm: SubmitHandler<CreateContainerForm> = (data) => {
        const formToSubmit = { ...data, budget: ReverseFormattedNumberString(String(data.budget)), isEditAccount: props.containerToEdit !== undefined };
        const children = props.selectedResources && props.selectedResources.length > 0 ? props.selectedResources : selectedChildren;
        props.onSubmitCreateContainerForm(
            {
                ...formToSubmit,
                containerType: props.containerToEditForm.containerType,
                space_id: data.space_id === '' ? undefined : data.space_id,
            },
            children
        );
        setIsFormDirty(false);
        props.onCloseDialog();
    };

    const onChangeForm: FormEventHandler<HTMLFormElement> = (event: any) => {
        const clonedContainer = { ...ref.current.form } as any;
        clonedContainer[event.target.name] = event.target.value;
        setIsFormDirty(true);
        ref.current.form = { ...clonedContainer };
    };

    const onChangeDropDowns = (event: SelectChangeEvent<string>, child?: ReactNode) => {
        const clonedContainer = { ...ref.current.form } as any;
        clonedContainer[event.target.name] = event.target.value;
        setIsFormDirty(true);
        props.setContainerToEditForm({ ...clonedContainer });
    };

    const closeAndCleanForm = () => {
        setIsFormDirty(false);
        props.onCloseDialog();
    };

    return (
        <Dialog
            fullWidth
            open={props.isDialogOpen}
            onClose={props.onCloseDialog}
            PaperComponent={PaperComponent}
            aria-labelledby='create-container-dialog'
        >
            <DialogTitle className={cx(classes.FormTitle)} variant={'h6'} style={{ cursor: 'move' }} id='create-container-dialog'>
                <Stack direction={'column'} spacing={1}>
                    {props.createContainerLocation && props.containerToEditForm.containerType === ContainerType.Space
                        ? props.containerToEdit !== undefined
                            ? `Edit ${props.containerToEditForm.name}`
                            : 'Create Space'
                        : props.containerToEditForm.containerType === ContainerType.Workload
                        ? props.containerToEdit !== undefined
                            ? `Edit ${props.containerToEditForm.name}`
                            : 'Create Workload'
                        : props.containerToEdit !== undefined
                        ? `Edit ${props.containerToEditForm.name}`
                        : 'Create Resource Pool'}
                    {props.containerToEditForm?.containerType === ContainerType.Space ? (
                        <Typography variant={'subtitle2'}>
                            A Space is a container that groups together different workloads across multiple providers. They are the highest in the
                            grouping priority.
                        </Typography>
                    ) : props.containerToEditForm?.containerType === ContainerType.Workload ? (
                        <Typography variant={'subtitle2'}>
                            A Workload is a container that groups together different resource pools across multiple providers. They are the second
                            highest in the grouping priority.
                        </Typography>
                    ) : props.containerToEditForm?.containerType === ContainerType.ResourcePool ? (
                        <Typography variant={'subtitle2'}>
                            A Resource Pool is a container that groups together different resources from multiple providers. They are the lowest in
                            the grouping hierarchy.
                        </Typography>
                    ) : (
                        <></>
                    )}
                </Stack>
            </DialogTitle>
            <DialogContent>
                <Form onSubmit={onSubmitForm} onChange={onChangeForm} id={'create-container-form'}>
                    {({ errors, register, watch, setValue, formState }) => {
                        const name = watch('name');
                        const budget = watch('budget');
                        const containingSpace = watch('space_id');
                        const childrenTable = watch('childrenTable');

                        return (
                            <Grid container spacing={2}>
                                <Grid xs={12}>
                                    <FormField label='Name' htmlFor='name'>
                                        <TextField
                                            id={'name'}
                                            fullWidth={true}
                                            size='small'
                                            {...register('name', { required: { value: true, message: 'Required' } })}
                                            error={!!errors.name}
                                            defaultValue={ref?.current?.form?.name ?? ''}
                                            placeholder={'Name'}
                                            helperText={errors.name?.message}
                                            //Just uncomment this if we want the default container's name not to change
                                            //inputProps={{ readOnly: props.containerToEdit && props.containerToEdit.is_default }}
                                        />
                                    </FormField>
                                </Grid>
                                <Grid xs={12}>
                                   {/* <FormField label='Budget' htmlFor='budget'>
                                       <TextField
                                            id={'budget'}
                                            fullWidth={true}
                                            size='small'
                                            {...register('budget', {
                                                required: { value: true, message: 'Required' },
                                                valueAsNumber: true,
                                                validate: (budget: number) => {
                                                    if (!budget.toString().match(/^(0|[1-9]\d*)(\.\d+)?$/i)) {
                                                        return 'Budget should only be a number';
                                                    }
                                                },
                                                max: maximumAllowedBudget,
                                                min: minimumAllowedBudget,
                                            })}
                                            error={!!errors.budget}
                                            defaultValue={ref?.current?.form?.budget ?? ''}
                                            placeholder={'Budget'}
                                            helperText={errors.budget?.message}
                                        />
                                    </FormField> */}

                                    {/* <FormField label='Budget' htmlFor='budget'>
                                        <BudgetTextField
                                            defaultValue={ref?.current?.form?.budget ? FormattedNumberString(ref?.current?.form?.budget) : ''}
                                            name='budget'
                                            fullWidth={true}
                                            size='small'
                                            register={register}
                                            setValue={setValue}
                                            error={!!errors.budget}
                                            helperText={errors.budget?.message}
                                            min={minimumAllowedBudget()}
                                            max={maximumAllowedBudget()}
                                        />
                                    </FormField> */}
                                </Grid>
                                {props.containerToEditForm?.containerType !== ContainerType.Space && (
                                    <Grid xs={12}>
                                        <FormField label='Description' htmlFor='description'>
                                            <TextField
                                                id={'description'}
                                                fullWidth={true}
                                                size='small'
                                                {...register('description', {
                                                    required: { value: false, message: 'Required' },
                                                })}
                                                error={!!errors.description}
                                                defaultValue={ref?.current?.form?.description ?? ''}
                                                placeholder={'Description'}
                                                helperText={errors.description?.message}
                                            />
                                        </FormField>
                                    </Grid>
                                )}
                                {props.containerToEditForm?.containerType === ContainerType.Space ? (
                                    //As a space view workloads to choose
                                    // <Stack width={'100%'} spacing={1} alignItems={'stretch'}>
                                    //     <ChildrenPoolTableFormField
                                    //         childrenTableName={'Workloads'}
                                    //         setSelectedChildren={setSelectedChildren}
                                    //         children={props.workloads.filter(
                                    //             (workload) => workload.parent_id === props.containerToEdit?.id || !workload.parent_id
                                    //         )}
                                    //         containerToEditForm={props.containerToEditForm}
                                    //         containerToEdit={props.containerToEdit}
                                    //     />
                                    // </Stack>
                                    <></>
                                ) : props.containerToEditForm?.containerType === ContainerType.Workload ? (
                                    //As a workload choose a parent space and resource pools
                                    <Stack width={'100%'} spacing={1} alignItems={'stretch'}>
                                        <ParentSpaceFormField
                                            spaces={props.spaces}
                                            containerToEdit={props.containerToEditForm}
                                            onChangeDropDowns={onChangeDropDowns}
                                            register={register}
                                        />
                                        {/*<ChildrenPoolTableFormField*/}
                                        {/*    childrenTableName={'Resource Pools'}*/}
                                        {/*    setSelectedChildren={setSelectedChildren}*/}
                                        {/*    children={props.resourcePools.filter(*/}
                                        {/*        (resourcepool) => resourcepool.parent_id === props.containerToEdit?.id || !resourcepool.parent_id*/}
                                        {/*    )}*/}
                                        {/*    containerToEditForm={props.containerToEditForm}*/}
                                        {/*    containerToEdit={props.containerToEdit}*/}
                                        {/*/>*/}
                                    </Stack>
                                ) : props.containerToEditForm?.containerType === ContainerType.ResourcePool ? (
                                    //As a resource pool choose a parent workload and resources
                                    <Stack width={'100%'} spacing={1} alignItems={'stretch'}>
                                        <ParentSpaceFormField
                                            spaces={props.workloads}
                                            containerToEdit={props.containerToEditForm}
                                            onChangeDropDowns={onChangeDropDowns}
                                            register={register}
                                        />
                                        {enableResourcesTableDisplay && (
                                            <ChildrenPoolTableFormField
                                                childrenTableName={'Resources'}
                                                setSelectedChildren={setSelectedChildren}
                                                children={props.resources}
                                                containerToEditForm={props.containerToEditForm}
                                                containerToEdit={props.containerToEdit}
                                                isResourcesLoading={props.isResourcesLoading}
                                            />
                                        )}
                                    </Stack>
                                ) : (
                                    ''
                                )}
                            </Grid>
                        );
                    }}
                </Form>
            </DialogContent>
            <Grid container>
                <Grid xs={2}>
                    <DialogActions>
                        {props.containerToEdit && (
                            <Button
                                className={cx(classes.DialogButtons, classes.Delete)}
                                color={'error'}
                                variant={'contained'}
                                onClick={() => {
                                    props.onClickDeleteSpace(props.containerToEdit);
                                }}
                                disabled={props.containerToEdit.is_default}
                                disableElevation={true}
                            >
                                Delete
                            </Button>
                        )}
                    </DialogActions>
                </Grid>
                <Grid xs={10}>
                    <DialogActions className={cx(classes.DialogActions)}>
                        <CancelButton
                            className={cx(classes.DialogButtons)}
                            disableElevation={true}
                            variant={'contained'}
                            color={'secondary'}
                            autoFocus
                            onClick={closeAndCleanForm}
                        >
                            Cancel
                        </CancelButton>
                        <Button
                            className={cx(classes.DialogButtons)}
                            disableElevation={true}
                            type={'submit'}
                            variant={'contained'}
                            form={'create-container-form'}
                            disabled={!isFormDirty}
                        >
                            {props.containerToEdit !== undefined ? 'Save Changes' : 'Create'}
                        </Button>
                    </DialogActions>
                </Grid>
                {props.containerToEdit && props.containerToEdit.is_default && (
                    <Grid xs={12} className={cx(classes.DeleteCaptionGrid)}>
                        <Typography sx={{ marginLeft: '1.5rem' }} className={commonStyles.cx(commonStyles.classes.CaptionText)} variant={'caption'}>
                            You can not delete the {props.containerToEdit && props.containerToEdit.name}.
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Dialog>
    );
};

const useStyles = makeStyles<ICreateContainerDialogProps>()((theme, props) => ({
    FormStack: {
        marginTop: '1rem',
    },
    CancelButton: { color: theme.palette.grey[50] },
    DialogActions: {
        marginRight: '1rem',
    },
    FormTitle: {
        cursor: 'move',
        fontWeight: 600,
        marginTop: '1rem',
        marginBottom: '.5rem',
    },
    DialogButtons: {
        textTransform: 'none',
    },
    DeleteCaptionGrid: { marginTop: '-0.5rem', paddingBottom: '0.3rem' },
    Delete: { marginLeft: '1rem' },
    //Cancel: { marginLeft: 'auto', marginRight: theme.spacing(1) },
}));

export { CreateContainerDialog };
