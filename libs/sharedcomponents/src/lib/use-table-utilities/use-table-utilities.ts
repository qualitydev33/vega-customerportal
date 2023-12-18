import { useRecoilState } from 'recoil';
import { defaultVegaTableControl, IVegaTableControl, vegaTableControls } from '@vegaplatformui/sharedcomponents';
import { useEffect } from 'react';
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid-premium';
import { GridFilterModel } from '@mui/x-data-grid';

interface ITableUtilities {
    updateTotalRows: (numberOfRows: number) => void;
    currentTableControl: IVegaTableControl | undefined;
    onPaginationModelChange: (paginationModel: GridPaginationModel) => void;
    onSortModelChange: (sortModel: GridSortModel) => void;
    onFilterModelChange: (filterModel: GridFilterModel) => void;
}
export function useTableUtilities(tableIdentifier: string): ITableUtilities {
    const [tableControls, setTableControls] = useRecoilState(vegaTableControls);
    const currentTableControl = tableControls.find((control) => control.key === tableIdentifier);

    useEffect(() => {
        if (!tableControls.find((control) => control.key === tableIdentifier)) {
            setTableControls((controls) => {
                return [
                    ...controls,
                    {
                        key: tableIdentifier,
                        value: { ...defaultVegaTableControl },
                    },
                ];
            });

            return () => {
                setTableControls((controls) => {
                    return controls.filter((control) => control.key !== tableIdentifier);
                });
            };
        }
    }, []);

    function updateTotalRows(numberOfRows: number) {
        setTableControls((controls) => {
            return controls.map((control) => {
                if (control.key === tableIdentifier) {
                    control.value.totalRows = numberOfRows;
                }
                return control;
            });
        });
    }

    function onPaginationModelChange(paginationModel: GridPaginationModel) {
        setTableControls((controls) => {
            return controls.map((control) => {
                if (control.key === tableIdentifier) {
                    control.value.paginationModel = paginationModel;
                }
                return control;
            });
        });
    }

    function onSortModelChange(sortModel: GridSortModel) {
        setTableControls((oldTableControls) => {
            const newTableControls = [...oldTableControls];
            const tableControlIndex = newTableControls.findIndex((control) => control.key === tableIdentifier);
            newTableControls[tableControlIndex].value.sortModel = sortModel;
            return newTableControls;
        });
    }

    function onFilterModelChange(filterModel: GridFilterModel) {
        setTableControls((oldTableControls) => {
            const newTableControls = [...oldTableControls];
            const tableControlIndex = newTableControls.findIndex((control) => control.key === tableIdentifier);
            newTableControls[tableControlIndex].value.filterModel = filterModel;
            return newTableControls;
        });
    }

    return { updateTotalRows, currentTableControl: currentTableControl?.value, onPaginationModelChange, onSortModelChange, onFilterModelChange };
}
