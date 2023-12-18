import { OrganizationApi } from '@vegaplatformui/apis';
import { atom, selectorFamily, useSetRecoilState } from 'recoil';

export const organizationsListRequestID = atom({
    key: 'organizationsListRequestID',
    default: 0,
});

export const organizationsList = selectorFamily({
    key: 'organizationsList',
    get:
        (token: string) =>
        async ({ get }) => {
            // Add Request ID as dependency to this selector
            get(organizationsListRequestID);

            // Fetch organizations from backend
            const organizationApi = new OrganizationApi();
            organizationApi.token = token;

            const result = await organizationApi.getOrganizations();
            return result.data;
        },
});

export const useRefreshOrganizationsList = () => {
    const setOrganizationsListRequestID = useSetRecoilState(organizationsListRequestID);
    return () => {
        setOrganizationsListRequestID((requestID) => requestID + 1);
    };
};
