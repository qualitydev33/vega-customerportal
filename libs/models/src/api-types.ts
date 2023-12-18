import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid-premium';
import { GridFilterModel } from '@mui/x-data-grid';

export type RequestStatus = 'DEFAULT' | 'LOADING' | 'ERRORED' | 'SUCCESS';

export interface IDataGridRequest {
    paginationModel: GridPaginationModel;
    sortModel: GridSortModel;
    filterModel: GridFilterModel;
}
