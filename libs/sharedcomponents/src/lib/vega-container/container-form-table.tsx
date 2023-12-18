import React, { useEffect } from 'react';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';
import { Box } from '@mui/material';
import {
    DataGridPremium,
    GridColDef,
    GridRenderCellParams,
    GridToolbarContainer,
    GridToolbarFilterButton,
    useGridApiRef,
    useGridSelector,
} from '@mui/x-data-grid-premium';
import { gridFilteredDescendantCountLookupSelector, GridRowSelectionModel } from '@mui/x-data-grid';
import { IResource, IVegaContainer } from '@vegaplatformui/models';
import { useRecoilState } from 'recoil';
import { DataGridCustomToolbar, defaultVegaTableControl, useTableUtilities, vegaTableControls } from '@vegaplatformui/sharedcomponents';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IContainerFormTableProps {
    columns: GridColDef[];
    rows: IResource[];
    setSelectedChildren: React.Dispatch<React.SetStateAction<IResource[]>>;
    isLoading: boolean;
    containerToEdit?: IVegaContainer;
}

const ContainerFormTable: React.FC<IContainerFormTableProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const commonStyles = useCommonStyles();
    const apiRef = useGridApiRef();
    const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>(
        props.rows.filter((children) => props.containerToEdit?.id === children.resource_pool_id).map((children) => children.id) ?? []
    );
    const resourceChildrenTableUtilities = useTableUtilities('resource-children-table');

    useEffect(() => {
        setSelectionModel(
            props.rows.filter((children) => props.containerToEdit?.id === children.resource_pool_id).map((children) => children.id) ?? []
        );
    }, [props.isLoading]);

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarFilterButton className={cx(classes.ToolBarFilter)} />
            </GridToolbarContainer>
        );
    }

    const RenderDescendentCount = (props: GridRenderCellParams<IVegaContainer>) => {
        const { id, field, rowNode } = props;

        const FilteredDescendantCountLookup = useGridSelector(apiRef, gridFilteredDescendantCountLookupSelector);
        const filteredDescendantCount = FilteredDescendantCountLookup[rowNode.id] ?? 0;
        return filteredDescendantCount !== 0 ? filteredDescendantCount : '';
    };

    const onRowsSelectionHandler = (gridSelectionModel: GridRowSelectionModel) => {
        setSelectionModel(gridSelectionModel);
        props.setSelectedChildren(gridSelectionModel.map((id) => props.rows.find((child) => child.id === id) as IResource));
    };

    return (
        <Box>
            <DataGridPremium
                className={commonStyles.cx(commonStyles.classes.DataGrid)}
                initialState={{}}
                apiRef={apiRef}
                disableColumnMenu
                pagination={true}
                rowCount={resourceChildrenTableUtilities.currentTableControl?.totalRows ?? 0}
                autoHeight={true}
                pageSizeOptions={[5, 10, 15]}
                density={'standard'}
                columns={[...props.columns]}
                rows={props.rows}
                onRowSelectionModelChange={(gridSelectionModel: GridRowSelectionModel) => onRowsSelectionHandler(gridSelectionModel)}
                rowSelectionModel={selectionModel}
                checkboxSelection={true}
                disableRowSelectionOnClick={true}
                slots={{
                    toolbar: DataGridCustomToolbar,
                }}
                paginationModel={resourceChildrenTableUtilities.currentTableControl?.paginationModel}
                onPaginationModelChange={resourceChildrenTableUtilities.onPaginationModelChange}
                onSortModelChange={resourceChildrenTableUtilities.onSortModelChange}
                onFilterModelChange={resourceChildrenTableUtilities.onFilterModelChange}
                loading={props.isLoading}
            />
        </Box>
    );
};

const useStyles = makeStyles<IContainerFormTableProps>()((theme, props) => ({
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

export { ContainerFormTable };
