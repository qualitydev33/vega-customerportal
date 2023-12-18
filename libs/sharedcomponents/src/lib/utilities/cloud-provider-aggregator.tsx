import React from 'react';
import { GridAggregationFunction } from '@mui/x-data-grid-premium';

export const CloudProviderAggregator: GridAggregationFunction<string, string[]> = {
    apply: ({ values }) => {
        return [...new Set(values.map((value) => value!))];
    },
    columnTypes: ['string'],
    label: 'All',
};
