import { IBusinessGrouping } from './business-grouping-types';

export type IUser = {
    id: string;
    organization_id: string;
    businessunits: IBusinessGrouping[];
    email: string;
    mobile_phone: number;
    given_name: string;
    family_name: string;
    is_first_time_login: boolean;
    status_id: number;
    country: string;
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
    auth_user_id: string;
};

export interface IListUsersRequest {
    limit: number;
    offset: number;
    size: number;
}
