import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { grey } from '@mui/material/colors';

export const useCommonStyles = makeStyles()((theme) => ({
    LowercaseTextButton: {
        textTransform: 'capitalize',
    },
    AggregatedHeader: {
        '& .MuiDataGrid-aggregationColumnHeader': {
            visibility: 'hidden',
        },
        '& .MuiDataGrid-columnHeaderTitle': {
            visibility: 'visible',
            alignSelf: 'center',
        },
    },
    DataGrid: {
        '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus': {
            outline: 'none',
        },
        '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus': {
            outline: 'none',
        },
        border: 'none',
    },
    DataGridToolBarFilter: {
        color: theme.palette.grey[500],
        marginBottom: '1rem',
    },
    DataGridToolBar: {
        color: theme.palette.grey[100],
        '& .MuiFormControl-root': {
            minWidth: '100%',
        },
    },
    CloudProviderTableIcon: {
        width: '1.5rem',
    },
    ChronDialog: {
        zIndex: 2,
    },
    CancelButton: { color: theme.palette.grey[50] },
    DialogActions: {
        marginTop: '1rem',
        marginRight: '-.5rem',
    },
    FormTitle: {
        cursor: 'move',
        fontWeight: 600,
        marginTop: '1rem',
        marginBottom: '.5rem',
    },
    PageCardTitle: {
        fontWeight: 600,
    },
    FormatJson: {
        whiteSpace: 'pre',
    },
    CaptionText: {
        color: theme.palette.grey[400],
        fontWeight: 700,
    },
    GreyButton: {
        backgroundColor: theme.palette.grey[100],
        color: theme.palette.grey[900],
        '&:hover': {
            backgroundColor: theme.palette.grey[200],
        },
    },
    MultipleDeleteButton: {
        color: theme.palette.getContrastText(grey[500]),
        backgroundColor: grey[300],
        '&:hover': {
            backgroundColor: grey[500],
        },
    },
}));
