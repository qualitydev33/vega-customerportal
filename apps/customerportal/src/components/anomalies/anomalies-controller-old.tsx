import React, { useEffect, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Stack, useTheme } from '@mui/material';
import { useKeycloak } from '@react-keycloak-fork/web';
import { AnomaliesCard, defaultVegaTableControl, SnackBarOptions, useCommonPageHeader, vegaTableControls } from '@vegaplatformui/sharedcomponents';
import { AnomalyApi } from '@vegaplatformui/apis';
import { AnomalyCategory, IAnomaly } from '@vegaplatformui/models';
import { AnomalyGraphCard } from '@vegaplatformui/sharedcomponents';
import { AnomalySummaryCard } from '@vegaplatformui/sharedcomponents';
import { ApexOptions } from 'apexcharts';
import { GridRowGroupingModel } from '@mui/x-data-grid-premium';

export type IAnomaliesContainerProps = React.PropsWithChildren;

const AnomaliesControllerOld: React.FC<IAnomaliesContainerProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const theme = useTheme();
    const [selectedAnomaly, setSelectedAnomaly] = useState<IAnomaly>();
    const [anomalies, setAnomalies] = useState<IAnomaly[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState('');
    const setSnackbarOptions = useSetRecoilState(SnackBarOptions);
    const { keycloak } = useKeycloak();
    const [category, setCategory] = React.useState<string>('product');
    const [anomalyCategory, setAnomalyCategory] = React.useState<AnomalyCategory>(AnomalyCategory.OnDemand);
    const [threshold, setThreshold] = useState<string>('10');
    const [rowGroupingModel, setRowGroupingModel] = React.useState<GridRowGroupingModel>(
        category === 'account' ? ['linked_account_id'] : ['product']
    );
    const [tableControls, setTableControls] = useRecoilState(vegaTableControls);

    useEffect(() => {
        setTableControls((controls) => {
            return [
                ...controls,
                {
                    key: 'anomalies-table',
                    value: { ...defaultVegaTableControl },
                },
            ];
        });
        return () => {
            setTableControls((controls) => {
                return controls.filter((control) => control.key !== 'anomalies-table');
            });
        };
    }, []);

    const anomaliesFilterByThreshold =
        threshold !== '0'
            ? anomalies.filter((a) =>
                  anomalyCategory === 'Usage Spike'
                      ? ((Math.ceil(a.current_usage_amount) - Math.ceil(a.average_daily_usage)) / Math.ceil(a.average_daily_usage)) * 100 >=
                        parseInt(threshold, 10)
                      : anomalyCategory === 'OnDemand Spike'
                      ? ((Math.ceil(a.current_ondemand_cost) - Math.ceil(a.average_daily_ondemand)) / Math.ceil(a.average_daily_ondemand)) * 100 >=
                        parseInt(threshold, 10)
                      : ((Math.ceil(a.current_net_fiscal) - Math.ceil(a.average_net_fiscal)) / Math.ceil(a.average_net_fiscal)) * 100 >=
                        parseInt(threshold, 10)
              )
            : anomalies;
    const productNamesUnOrdered = [...new Set(anomaliesFilterByThreshold.map((anomaly) => anomaly.product))];

    let productDonutChartData: { product: string; amount: number }[] = [];
    productNamesUnOrdered.forEach(
        (p) =>
            (productDonutChartData = [
                ...productDonutChartData,
                {
                    product: p,
                    amount: anomaliesFilterByThreshold.filter((a) => a.product === p).length,
                },
            ])
    );
    productDonutChartData.sort((a, b) => b.amount - a.amount);
    const productNames = productDonutChartData.map((p) => p.product);

    const productDetailCategoriesUnOrdered = [...new Set(anomaliesFilterByThreshold.map((anomaly) => anomaly.product_cost_detail_category))];
    let productLineChartData: { productDetailCategory: string; currentAverage: number; pastAverage: number }[] = [];
    productDetailCategoriesUnOrdered.forEach((p) => {
        productLineChartData = [
            ...productLineChartData,
            {
                productDetailCategory: p,
                currentAverage: anomaliesFilterByThreshold
                    .filter((a) => a.product_cost_detail_category === p)
                    .map((anomaly) =>
                        anomalyCategory === 'Usage Spike'
                            ? Math.ceil(anomaly.current_usage_amount)
                            : anomalyCategory === 'OnDemand Spike'
                            ? Math.ceil(anomaly.current_ondemand_cost)
                            : Math.ceil(anomaly.current_net_fiscal)
                    )
                    .reduce((sum, current) => sum + current),
                pastAverage: anomaliesFilterByThreshold
                    .filter((a) => a.product_cost_detail_category === p)
                    .map((anomaly) =>
                        anomalyCategory === 'Usage Spike'
                            ? Math.ceil(anomaly.average_daily_usage)
                            : anomalyCategory === 'OnDemand Spike'
                            ? Math.ceil(anomaly.average_daily_ondemand)
                            : Math.ceil(anomaly.average_net_fiscal)
                    )
                    .reduce((sum, current) => sum + current, 0),
            },
        ];
    });
    productLineChartData.sort((a, b) => b.currentAverage - a.currentAverage);
    const productDetailCategoryNames = productLineChartData.map((p) => p.productDetailCategory);

    const today = new Date();
    const moveDate = (date: Date, moveXDays: number) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + moveXDays);
        return newDate.toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
        });
    };

    const lineOptions: ApexOptions = {
        chart: {
            height: 350,
            type: 'line',
        },
        stroke: {
            curve: 'smooth',
        },
        xaxis: {
            categories: [
                moveDate(today, -8),
                moveDate(today, -7),
                moveDate(today, -6),
                moveDate(today, -5),
                moveDate(today, -4),
                moveDate(today, -3),
                moveDate(today, -2),
                moveDate(today, -1),
                moveDate(today, 0),
            ],
        },
        yaxis: {
            forceNiceScale: true,
            decimalsInFloat: 0,
            logarithmic: true,
            max: anomalyCategory === 'Usage Spike' ? 100000000 : 100000,
            min: 10,
            tickAmount: 5,
        },
        responsive: [
            {
                breakpoint: 1400,
                options: {
                    chart: {},
                    legend: false,
                },
            },
        ],
        legend: {
            position: 'right',
            formatter(legendName: string, opts?: any): string {
                return legendName.length > 20 ? legendName.substring(0, 20) + '...' : legendName;
            },
        },
        labels: productDetailCategoryNames,
    };

    const onProductSelect = (event: any, chartContext: any, config: any) => {
        const _selectedProduct = productDonutChartData[config.dataPointIndex].product;
        const selectedDataPoint = config.selectedDataPoints[0];
        if (0 === selectedDataPoint.length) {
            setSelectedProduct('');
        } else {
            setSelectedProduct(_selectedProduct);
        }
    };

    const donutOptions: ApexOptions = {
        chart: {
            id: 'TestGraph',
            type: 'donut',
            events: {
                dataPointSelection: onProductSelect,
            },
        },
        plotOptions: {
            pie: {
                customScale: 1,
            },
        },
        legend: {
            position: 'right',
            formatter(legendName: string, opts?: any): string {
                return legendName.length > 20 ? legendName.substring(0, 20) + '...' : legendName;
            },
        },
        responsive: [
            {
                breakpoint: 1400,
                options: {
                    chart: {},
                    legend: false,
                },
            },
        ],
        labels: productNames,
    };

    const lineSeries: ApexAxisChartSeries = productLineChartData.map((p) => ({
        name: p.productDetailCategory,
        data: [
            p.pastAverage,
            p.pastAverage,
            p.pastAverage,
            p.pastAverage,
            p.pastAverage,
            p.pastAverage,
            p.pastAverage,
            p.pastAverage,
            p.currentAverage,
        ],
    }));
    const donutSeries: number[] = productDonutChartData.map((p) => p.amount);

    useEffect(() => {
        const anomalyApi = new AnomalyApi();
        anomalyApi.token = keycloak.token ?? '';
        anomalyApi
            .getAnomalies('400de414-25fa-11ed-8ac6-49b737410658')
            .then((response) => {
                setAnomalies(
                    response.data
                        .filter((anomaly: IAnomaly) => anomaly.anomaly === anomalyCategory)
                        .filter((anomaly: IAnomaly) =>
                            anomalyCategory === 'Usage Spike'
                                ? (anomaly.average_daily_usage | anomaly.current_usage_amount) > 1
                                : anomalyCategory === 'OnDemand Spike'
                                ? (anomaly.average_daily_ondemand | anomaly.current_ondemand_cost) > 1
                                : (anomaly.average_net_fiscal | anomaly.current_net_fiscal) > 1
                        )
                );
                setIsLoading(false);
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: 'There was a problem loading anomalies data.',
                });
                setIsLoading(false);
            });
    }, [keycloak.token, anomalyCategory]);
    // Add any event handlers here such as onAnomalySelected, onAnomalyDeselected, etc.
    useEffect(() => {
        if (category === 'account') {
            setRowGroupingModel(['linked_account_id']);
        } else {
            setRowGroupingModel(['product']);
        }
    }, [category]);

    return (
        <Stack direction={'column'} spacing={1}>
            <AnomalySummaryCard anomalies={anomaliesFilterByThreshold} />
            <Stack direction={'row'}>
                <AnomalyGraphCard graphSeries={donutSeries} graphOptions={donutOptions} graphType={'donut'} />
                <AnomalyGraphCard graphSeries={lineSeries} graphOptions={lineOptions} graphType={'line'} />
            </Stack>
            <AnomaliesCard
                anomalyCategory={anomalyCategory}
                setAnomalyCategory={setAnomalyCategory}
                rowGroupingModel={rowGroupingModel}
                setRowGroupingModel={setRowGroupingModel}
                selectedAnomaly={selectedAnomaly}
                threshold={threshold}
                setThreshold={setThreshold}
                anomalies={anomaliesFilterByThreshold}
                category={category}
                setCategory={setCategory}
                setSelectedAnomaly={setSelectedAnomaly}
                isLoading={isLoading}
            />
        </Stack>
    );
};

const useStyles = makeStyles<IAnomaliesContainerProps>()((theme, props, options: ApexOptions) => ({}));

export { AnomaliesControllerOld };
