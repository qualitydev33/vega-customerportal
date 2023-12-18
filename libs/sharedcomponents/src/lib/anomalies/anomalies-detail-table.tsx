import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { IAnomaly } from '@vegaplatformui/models';
import { DataGridPremium, GridColDef, GridToolbarContainer } from '@mui/x-data-grid-premium';
import { Box } from '@mui/material';
import { useRecoilState } from 'recoil';
import { vegaTableControls } from '@vegaplatformui/sharedcomponents';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAnomaliesDetailTableProps {
    isLoading: boolean;
    selectedAnomaly: IAnomaly;
    columns: GridColDef[];
}

const AnomaliesDetailTable: React.FC<IAnomaliesDetailTableProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [tableControls, setTableControls] = useRecoilState(vegaTableControls);
    const paginationModel = tableControls.find((control) => control.key === 'anomalies-details-table')?.value.paginationModel;

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                {/*<GridToolbarFilterButton className={cx(classes.ToolBarFilter)} />*/}
                {/*<GridToolbarExport className={cx(classes.ToolBarFilter)} printOptions={{ disableToolbarButton: true }} />
                <GridToolbarColumnsButton className={cx(classes.ToolBarFilter)} />*/}
            </GridToolbarContainer>
        );
    }

    return (
        <Box>
            <DataGridPremium
                className={cx(classes.DataGrid)}
                disableColumnMenu
                autoHeight={true}
                pageSizeOptions={[5, 10, 15]}
                density={'standard'}
                columns={props.columns}
                rows={[props.selectedAnomaly]}
                disableRowSelectionOnClick={true}
                slots={{
                    toolbar: (props) => <CustomToolbar {...props} className={cx(classes.ToolBar)} />,
                }}
                paginationModel={paginationModel}
                onPaginationModelChange={(p) => {
                    setTableControls((controls) => {
                        return controls.map((control) => {
                            if (control.key === 'anomalies-detail-table') {
                                control.value.paginationModel = p;
                            }
                            return control;
                        });
                    });
                }}
                loading={props.isLoading}
            />
        </Box>
    );
};

const useStyles = makeStyles<IAnomaliesDetailTableProps>()((theme, props) => ({
    DataGrid: {
        '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus': {
            outline: 'none',
        },
        '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus': {
            outline: 'none',
        },
        border: 'none',
    },
    ToolBar: {
        color: theme.palette.grey[100],
        '& .MuiFormControl-root': {
            minWidth: '100%',
        },
    },
    ToolBarFilter: {
        color: theme.palette.grey[500],
        marginBottom: '1rem',
    },
}));

export { AnomaliesDetailTable };
