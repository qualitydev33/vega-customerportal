import { StyledToolTip } from '@vegaplatformui/sharedcomponents';
import { Switch } from '@mui/material';
import { IOrganizationResponse, RequestStatus } from '@vegaplatformui/models';
import { Dispatch, SetStateAction, useState } from 'react';
import { OrganizationApi } from '@vegaplatformui/apis';
import { useKeycloak } from '@react-keycloak-fork/web';
import { useSetRecoilState } from 'recoil';
import { SnackBarOptions } from '../../recoil/atom';

interface IOrganizationStatusToggleProps extends React.PropsWithChildren {
    organization: IOrganizationResponse;
    setOrganizations: Dispatch<SetStateAction<IOrganizationResponse[]>>;
}

const OrganizationStatusToggle = ({ organization, setOrganizations }: IOrganizationStatusToggleProps) => {
    const { keycloak } = useKeycloak();
    const setSnackbarOptions = useSetRecoilState(SnackBarOptions);
    const [status, setStatus] = useState<RequestStatus>('DEFAULT');

    const onOrgStatusToggleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>, row: IOrganizationResponse) => {
        e.stopPropagation();
        setStatus('LOADING');

        const organizationApi = new OrganizationApi();
        organizationApi.token = keycloak.token ?? '';

        // Toggle org status
        try {
            if (row.is_enabled === 1) {
                await organizationApi.disableOrganization(row.id);
            } else {
                await organizationApi.enableOrganization(row.id);
            }

            setSnackbarOptions({
                message: 'Organization updated',
                snackBarProps: { open: true, autoHideDuration: 3000 },
                alertProps: { severity: 'success' },
            });

            // Update organization list
            const newStatus = row.is_enabled === 1 ? 0 : 1;
            setOrganizations((orgs) => orgs.map((org) => (org.id === row.id ? { ...org, is_enabled: newStatus } : org)));

            setStatus('SUCCESS');
        } catch (error) {
            setSnackbarOptions({
                message: 'Update failed',
                snackBarProps: { open: true, autoHideDuration: 3000 },
                alertProps: { severity: 'error' },
            });
            setStatus('ERRORED');
        }
    };

    return (
        <StyledToolTip title='Enable or Disable Organization'>
            <Switch
                checked={organization.is_enabled === 1 ? true : false}
                onClick={(e) => onOrgStatusToggleButtonClick(e, organization)}
                disabled={status === 'LOADING'}
            />
        </StyledToolTip>
    );
};

export { OrganizationStatusToggle };
