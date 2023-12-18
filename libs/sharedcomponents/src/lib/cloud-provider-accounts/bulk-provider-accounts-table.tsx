import React, { useState } from 'react';
import { useCommonStyles, makeStyles } from '@vegaplatformui/styling';
import { Stack } from '@mui/material';
import { DataGridPremium, GridPaginationModel, GridToolbarQuickFilter, useGridApiRef } from '@mui/x-data-grid-premium';
import { GridToolbarContainer } from '@mui/x-data-grid';
import { StringCapitalizeAndSpace } from '../utilities/string-formatter';
import { useRecoilState } from 'recoil';
import { useTableUtilities, vegaTableControls } from '@vegaplatformui/sharedcomponents';

export interface IBulkProviderAccountsTableProps {
    selectedFiles: File[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
    fileRows: any[];
    headerKeys: string[];
}

const BulkProviderAccountsTable: React.FC<IBulkProviderAccountsTableProps> = (props) => {
    const localStyles = useStyles(props);
    const commonStyles = useCommonStyles();
    const [tableControls, setTableControls] = useRecoilState(vegaTableControls);
    const cloudBulkProviderAccountsTableUtilities = useTableUtilities('bulk-provider-accounts-table');

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarQuickFilter className={commonStyles.cx(commonStyles.classes.DataGridToolBarFilter)} />
            </GridToolbarContainer>
        );
    }

    return (
        <Stack className={localStyles.cx(localStyles.classes.Stack)}>
            <DataGridPremium
                pageSizeOptions={[5, 10, 15]}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            id: false,
                        },
                    },
                }}
                density={'compact'}
                pagination
                disableRowSelectionOnClick={true}
                disableColumnMenu
                className={commonStyles.cx(commonStyles.classes.DataGrid)}
                autoHeight={true}
                columns={props.headerKeys.map((header: string) => {
                    return { field: header, headerName: StringCapitalizeAndSpace(header.toLowerCase()), flex: 1 };
                })}
                rows={props.fileRows}
                slots={{
                    toolbar: (props) => <CustomToolbar {...props} className={commonStyles.cx(commonStyles.classes.DataGridToolBar)} />,
                }}
                paginationModel={cloudBulkProviderAccountsTableUtilities.currentTableControl?.paginationModel}
                onPaginationModelChange={cloudBulkProviderAccountsTableUtilities.onPaginationModelChange}
            />
        </Stack>
    );
};

const useStyles = makeStyles<IBulkProviderAccountsTableProps>()((theme, props) => ({
    Stack: { width: '100%' },
}));

export { BulkProviderAccountsTable };
