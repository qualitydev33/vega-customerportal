import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { defaultPaginationModel, StyledToolTip } from '@vegaplatformui/sharedcomponents';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useRecoilState, useRecoilValue } from 'recoil';
import { organizationsList } from '../../recoil/organizations/atom';
import { IOrganizationResponse } from '@vegaplatformui/models';
import { OrganizationStatusToggle } from './organization-status-toggle';
import { useKeycloak } from '@react-keycloak-fork/web';

const StyledIconButton = styled(IconButton)({
    '&:hover': {
        backgroundColor: 'rgba(0, 0,0,0)',
    },
});

export type IOrganizationListProps = React.PropsWithChildren;

const OrganizationList: React.FC = () => {
    const { keycloak } = useKeycloak();
    const data = useRecoilValue<IOrganizationResponse[]>(organizationsList(keycloak.token ?? ''));
    const [organizations, setOrganizations] = useState<IOrganizationResponse[]>(data);
    const [paginationModel, setPaginationModel] = useRecoilState(defaultPaginationModel);

    const onOrgEditButtonClick = (e: React.MouseEvent<HTMLButtonElement>, row: IOrganizationResponse) => {
        e.stopPropagation();
        console.log('Org Edit button clicked');
        console.log(row);
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Organization Name', minWidth: 150, editable: true, flex: 1 },
        { field: 'id', headerName: 'Org ID', minWidth: 375, flex: 1 },
        { field: 'status', headerName: 'Status', minWidth: 100, flex: 1 },
        { field: 'sku', headerName: 'SKU', minWidth: 100, flex: 1 },
        { field: 'registered_at', type: 'date', headerName: 'Date Registered', minWidth: 200, flex: 1 },
        {
            field: 'colActions',
            headerName: '',
            sortable: false,
            filterable: false,
            minWidth: 140,
            flex: 1,
            renderCell: (params) => {
                return (
                    <>
                        <StyledToolTip title='Edit'>
                            <StyledIconButton aria-label='edit' onClick={(e) => onOrgEditButtonClick(e, params.row)} size='small'>
                                <EditIcon />
                            </StyledIconButton>
                        </StyledToolTip>
                        <OrganizationStatusToggle organization={params.row} setOrganizations={setOrganizations} />
                    </>
                );
            },
        },
    ];

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
                <DataGrid
                    slots={{ toolbar: GridToolbar }}
                    rows={organizations}
                    autoHeight
                    columns={columns}
                    pageSizeOptions={[10]}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    checkboxSelection
                    disableRowSelectionOnClick={true}
                    sx={{
                        '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus': {
                            outline: 'none',
                        },
                    }}
                />
            </div>
        </div>
    );
};

export { OrganizationList };
