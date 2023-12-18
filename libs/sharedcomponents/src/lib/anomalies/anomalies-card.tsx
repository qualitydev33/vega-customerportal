import React, { useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import {
    Card,
    CardContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import { AnomaliesTable } from './anomalies-table';
import { AnomalyCategory, IAnomaly } from '@vegaplatformui/models';
import { GridRowGroupingModel, GridValueGetterParams } from '@mui/x-data-grid-premium';

export interface IAnomaliesProps {
    setAnomalyCategory: React.Dispatch<React.SetStateAction<AnomalyCategory>>;
    anomalyCategory: AnomalyCategory;
    setSelectedAnomaly: React.Dispatch<React.SetStateAction<IAnomaly | undefined>>;
    selectedAnomaly?: IAnomaly;
    category: string;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
    threshold: string;
    setThreshold: React.Dispatch<React.SetStateAction<string>>;
    anomalies: IAnomaly[];
    rowGroupingModel: GridRowGroupingModel;
    setRowGroupingModel: React.Dispatch<React.SetStateAction<GridRowGroupingModel>>;
    isLoading: boolean;
}

const AnomaliesCard: React.FC<IAnomaliesProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [openDialog, setOpenDialog] = useState(false);

    const handleCategory = (event: React.MouseEvent<HTMLElement>, newCategory: string | null) => {
        if (newCategory != null) {
            props.setCategory(newCategory);
        } else {
            props.setCategory(props.category);
        }
    };

    const handleAnomalyCategory = (event: SelectChangeEvent) => {
        if (event.target.value != null) {
            props.setAnomalyCategory(event.target.value as AnomalyCategory);
        } else {
            props.setAnomalyCategory(props.anomalyCategory);
        }
    };

    const handleAnomalyThreshold = (event: SelectChangeEvent) => {
        props.setThreshold(event.target.value);
    };

    const onClickDetailsClose = () => {
        setOpenDialog(false);
        //ToDo: Temporary but when I set this to false while the table is still trying to be render I get an error because the row Id is undefined
        setTimeout(() => {
            props.setSelectedAnomaly(undefined);
        }, 500);
    };
    const onClickDetailsOpen = (data: IAnomaly) => {
        props.setSelectedAnomaly(data);
        setOpenDialog(true);
    };

    const getVariance = (params: GridValueGetterParams<any, IAnomaly>) => {
        if (params.row.anomaly === 'Usage Spike') {
            return (
                Intl.NumberFormat('en-US', { minimumFractionDigits: 0, minimumSignificantDigits: 3, maximumSignificantDigits: 4 }).format(
                    params.row.usage_difference
                ) + '%'
            );
        }
        if (params.row.anomaly === 'OnDemand Spike') {
            return (
                Intl.NumberFormat('en-US', { minimumFractionDigits: 0, minimumSignificantDigits: 3, maximumSignificantDigits: 4 }).format(
                    params.row.ondemand_difference
                ) + '%'
            );
        } else {
            return undefined;
        }
    };

    const getDifference = (params: GridValueGetterParams<any, IAnomaly>) => {
        if (params.row.anomaly === 'Usage Spike') {
            return Math.round(params.row.current_usage_amount - params.row.average_daily_usage);
        }
        if (params.row.anomaly === 'OnDemand Spike') {
            return Math.round(params.row.current_ondemand_cost - params.row.average_daily_ondemand);
        }
        if (params.row.anomaly === 'Net Fiscal Spike') {
            return Math.round(params.row.current_net_fiscal - params.row.average_net_fiscal);
        } else {
            return undefined;
        }
    };

    const getAnomaliesSpike = (params: GridValueGetterParams<any, IAnomaly>) => {
        if (params.row.anomaly === 'Usage Spike') {
            return (
                Intl.NumberFormat('en-US', { minimumFractionDigits: 0, minimumSignificantDigits: 1, maximumSignificantDigits: 2 }).format(
                    ((Math.ceil(params.row.current_usage_amount) - Math.ceil(params.row.average_daily_usage)) /
                        Math.ceil(params.row.average_daily_usage)) *
                        100
                ) + '%'
            );
        }
        if (params.row.anomaly === 'OnDemand Spike') {
            return (
                Intl.NumberFormat('en-US', { minimumFractionDigits: 0, minimumSignificantDigits: 3, maximumSignificantDigits: 4 }).format(
                    ((Math.ceil(params.row.current_ondemand_cost) - Math.ceil(params.row.average_daily_ondemand)) /
                        Math.ceil(params.row.average_daily_ondemand)) *
                        100
                ) + '%'
            );
        }
        if (params.row.anomaly === 'Net Fiscal Spike') {
            return (
                Intl.NumberFormat('en-US', { minimumFractionDigits: 0, minimumSignificantDigits: 3, maximumSignificantDigits: 4 }).format(
                    ((Math.ceil(params.row.current_net_fiscal) - Math.ceil(params.row.average_net_fiscal)) /
                        Math.ceil(params.row.average_net_fiscal)) *
                        100
                ) + '%'
            );
        } else {
            return undefined;
        }
    };

    return (
        <Card elevation={0}>
            <CardContent>
                <Grid container direction={'column'}>
                    <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                        <Grid xs={12} item>
                            <Typography variant={'h6'}>Anomaly Detection</Typography>
                        </Grid>
                        <Grid xs={3} item>
                            <Typography variant={'subtitle1'} className={cx(classes.Subtitle)}>
                                Anomaly details for the last 7 days
                            </Typography>
                        </Grid>
                        <Grid item xs={9} container direction={'row'} justifyContent={'flex-end'} alignItems={'flex-end'} spacing={1}>
                            <FormControl className={cx(classes.ButtonGroup)} variant={'standard'} size={'small'}>
                                <InputLabel id='anomaly-threshold-select-label'>Anomaly Threshold</InputLabel>
                                <Select
                                    labelId='anomaly-threshold-select-label'
                                    id='anomaly-select'
                                    value={props.threshold}
                                    label='Anomaly Threshold'
                                    onChange={handleAnomalyThreshold}
                                >
                                    <MenuItem value={0}>
                                        <Typography className={cx(classes.ButtonTypography)} variant={'body2'}>
                                            Zero
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value={5}>
                                        <Typography className={cx(classes.ButtonTypography)} variant={'body2'}>
                                            Five
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value={10}>
                                        <Typography className={cx(classes.ButtonTypography)} variant={'body2'}>
                                            Ten
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value={15}>
                                        <Typography className={cx(classes.ButtonTypography)} variant={'body2'}>
                                            Fifteen
                                        </Typography>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl className={cx(classes.ButtonGroup)} variant={'standard'} size={'small'}>
                                <InputLabel id='anomaly-select-label'>Anomaly Category</InputLabel>
                                <Select
                                    labelId='anomaly-select-label'
                                    id='anomaly-select'
                                    value={props.anomalyCategory}
                                    label='Anomaly Category'
                                    onChange={handleAnomalyCategory}
                                >
                                    <MenuItem value={AnomalyCategory.Usage}>
                                        <Typography className={cx(classes.ButtonTypography)} variant={'body2'}>
                                            Usage Spike
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value={AnomalyCategory.NetFiscal}>
                                        <Typography className={cx(classes.ButtonTypography)} variant={'body2'}>
                                            Net Fiscal Spike
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value={AnomalyCategory.OnDemand}>
                                        <Typography className={cx(classes.ButtonTypography)} variant={'body2'}>
                                            OnDemand Spike
                                        </Typography>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <ToggleButtonGroup
                                size={'small'}
                                className={cx(classes.ButtonGroup)}
                                value={props.category}
                                exclusive
                                onChange={handleCategory}
                                aria-label='button group'
                            >
                                <ToggleButton className={cx(classes.Button)} value='product' aria-label='left aligned'>
                                    <Typography className={cx(classes.ButtonTypography)} variant={'body2'}>
                                        Product
                                    </Typography>
                                </ToggleButton>
                                <ToggleButton className={cx(classes.Button)} value='account' aria-label='right aligned'>
                                    <Typography className={cx(classes.ButtonTypography)} variant={'body2'}>
                                        Account
                                    </Typography>
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                    </Grid>
                </Grid>
                <AnomaliesTable
                    rowGroupingModel={props.rowGroupingModel}
                    setRowGroupingModel={props.setRowGroupingModel}
                    anomalies={props.anomalies}
                    anomalyCategory={props.anomalyCategory}
                    category={props.category}
                    selectedAnomaly={props.selectedAnomaly}
                    isLoading={props.isLoading}
                    getAnomaliesSpike={getAnomaliesSpike}
                    getDifference={getDifference}
                    getVariance={getVariance}
                />
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles<IAnomaliesProps>()((theme, props) => ({
    Subtitle: {
        paddingBottom: '1rem',
    },
    ButtonTypography: {
        textTransform: 'none',
    },
    Button: {
        '&.Mui-selected': {
            backgroundColor: theme.palette.mode === 'light' ? `${theme.palette.primary.main}20` : '',
        },
        color: theme.palette.mode === 'light' ? theme.palette.grey[900] : theme.palette.primary.contrastText,
    },
    ButtonGroup: {
        marginLeft: '.5rem',
        minWidth: '8rem',
    },
}));

export { AnomaliesCard };
