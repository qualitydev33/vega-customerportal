import { useKeycloak } from '@react-keycloak-fork/web';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { spacesState } from '../../recoil/atom';
import { ISpacesControllerProps } from '../spaces/spaces-controller';
import { makeStyles } from '@vegaplatformui/styling';
import {
    BusinessGroupingLanding,
    defaultVegaTableControl,
    SnackbarErrorOutput,
    SnackBarOptions,
    useTableUtilities,
} from '@vegaplatformui/sharedcomponents';
import { IBusinessGrouping, IBusinessGroupingType, IUser, IBusinessGroupingForm } from '@vegaplatformui/models';
import { SetStateAction, useEffect, useState } from 'react';
import { BusinessGroupingAddUpdateDialog } from '@vegaplatformui/sharedcomponents';
import { BusinessGroupingsApi, UsersApi } from '@vegaplatformui/apis';
import { Simulate } from 'react-dom/test-utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBusinessGroupingsControllerProps {}

const BusinessGroupingsController: React.FC<IBusinessGroupingsControllerProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const setSnackbarOptions = useSetRecoilState(SnackBarOptions);
    const { keycloak } = useKeycloak();
    const [isLoading, setIsLoading] = useState(true);
    const [businessGroupingTypes, setBusinessGroupingTypes] = useState<IBusinessGroupingType[]>([]);
    const [availableUsers, setAvailableUsers] = useState<IUser[]>([]);
    const [businessGroupingUsers, setBusinessGroupingUsers] = useState<IUser[]>([]);

    const [businessGroupings, setBusinessGroupings] = useState<IBusinessGrouping[]>([]);
    const [selectedBusinessGroupings, setSelectedBusinessGroupings] = useState<IBusinessGrouping[]>([]);

    const [groupingToEdit, setGroupingToEdit] = useState<IBusinessGrouping>();
    const [selectedBusinessGroupingType, setSelectedBusinessGroupingType] = useState<number>(groupingToEdit?.type ?? 1);
    const [businessGroupingDialogOpen, setBusinessGroupingDialogOpen] = useState<boolean>(false);
    const businessGroupingApi = new BusinessGroupingsApi();
    const usersApi = new UsersApi();
    const businessGroupingsTableUtilities = useTableUtilities('business-groupings-table');

    const loadBusinessGroupings = (page: number, size: number, filter: string, ordering: string, fields: string) => {
        businessGroupingApi.token = keycloak.token ?? '';
        businessGroupingApi
            .loadBusinessGroupings({ page: page, size: size, filter: filter, ordering: ordering, fields: fields })
            .then((response) => {
                const sortedBusinessGroupingUsers: IBusinessGrouping[] = response.data.map((group: IBusinessGrouping) => {
                    return {
                        ...group,
                        users: group.users.sort(function (a, b) {
                            if (a.given_name.toLowerCase() < b.given_name.toLowerCase()) return -1;
                            if (a.given_name.toLowerCase() > b.given_name.toLowerCase()) return 1;
                            return 0;
                        }),
                    } as IBusinessGrouping;
                });
                setBusinessGroupings(sortedBusinessGroupingUsers);
                setIsLoading(false);
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem loading the data: ${SnackbarErrorOutput(error)}`,
                });
                setIsLoading(false);
            });
    };

    useEffect(() => {
        loadBusinessGroupings(0, 100, '', 'id', '*');
        getBusinessGroupingTypes();
    }, [keycloak.token]);

    const onClickDeleteSelectedGroupings = () => {
        businessGroupingApi.token = keycloak.token ?? '';
        const selectedGroupingIds = selectedBusinessGroupings.map((selectedGrouping) => selectedGrouping.id);
        businessGroupingApi
            .deleteBusinessGroupings({ ids: selectedGroupingIds })
            .then((response) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: `Successfully deleted ${selectedGroupingIds.length} business grouping(s)`,
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem deleting the business grouping(s): ${SnackbarErrorOutput(error)}`,
                });
            })
            .finally(() => {
                setIsLoading(true);
                loadBusinessGroupings(0, 100, '', 'id', '*');
            });
    };

    const onClickOpenCreateBusinessGroupingDialog = () => {
        setBusinessGroupingDialogOpen(true);
        listUser();
    };

    const onClickOpenEditBusinessGroupingDialog = (grouping: IBusinessGrouping) => {
        setSelectedBusinessGroupingType(grouping.type);
        setGroupingToEdit(grouping);
        setBusinessGroupingUsers(grouping.users);
        listUser(grouping.users);
        setBusinessGroupingDialogOpen(true);
    };

    const onSubmitCreateBusinessGrouping = (data: IBusinessGroupingForm) => {
        businessGroupingApi.token = keycloak.token ?? '';
        businessGroupingApi
            .createBusinessGrouping({ name: data.name, type: data.type, users: businessGroupingUsers })
            .then((response) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: `Successfully created business grouping`,
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem creating the business grouping: ${
                        error.response.data.detail.includes('already exists')
                            ? `The business group, ${data.name}, already exists`
                            : SnackbarErrorOutput(error)
                    }`,
                });
            })
            .finally(() => {
                loadBusinessGroupings(0, 100, '', 'id', '*');
            });
    };

    const onSubmitEditBusinessGrouping = (data: IBusinessGroupingForm) => {
        businessGroupingApi.token = keycloak.token ?? '';
        businessGroupingApi
            .updateBusinessGrouping({ name: data.name, type: data.type, users: businessGroupingUsers }, groupingToEdit!.id)
            .then((response) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: `Successfully updated business grouping`,
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem updating the business grouping: ${SnackbarErrorOutput(error)}`,
                });
            })
            .finally(() => {
                loadBusinessGroupings(0, 100, '', 'id', '*');
            });
    };

    //This method is not actually being used right now since the single BG delete button is gone
    const onClickDeleteBusinessGrouping = (grouping: IBusinessGrouping) => {
        businessGroupingApi.token = keycloak.token ?? '';
        businessGroupingApi
            .deleteBusinessGrouping({ id: grouping.id })
            .then((response) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: `Successfully deleted ${grouping.name}`,
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem deleting the grouping, (${grouping.name}):  ${SnackbarErrorOutput(error)}`,
                });
            })
            .finally(() => {
                setIsLoading(true);
                loadBusinessGroupings(0, 100, '', 'id', '*');
            });
    };

    const onCloseDialog = () => {
        setBusinessGroupingDialogOpen(false);
        setTimeout(() => {
            setBusinessGroupingUsers([]);
            setGroupingToEdit(undefined);
            setSelectedBusinessGroupingType(1);
        }, 250);
    };

    const listUser = (bGroupingUsers?: IUser[]) => {
        usersApi.token = keycloak.token ?? '';
        usersApi
            .loadUsers()
            .then((response) => {
                const usersSorted = response.data.filter((user) => !bGroupingUsers?.some((groupingUser) => groupingUser.id === user.id))
                    ? response.data
                          .filter((user) => !bGroupingUsers?.some((groupingUser) => groupingUser.id === user.id))
                          .sort(function (a, b) {
                              if (a.given_name.toLowerCase() < b.given_name.toLowerCase()) return -1;
                              if (a.given_name.toLowerCase() > b.given_name.toLowerCase()) return 1;
                              return 0;
                          })
                    : response.data.sort(function (a, b) {
                          if (a.given_name.toLowerCase() < b.given_name.toLowerCase()) return -1;
                          if (a.given_name.toLowerCase() > b.given_name.toLowerCase()) return 1;
                          return 0;
                      });
                setAvailableUsers(usersSorted);
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `Unable to get users: ${SnackbarErrorOutput(error)}`,
                });
            });
    };

    const getBusinessGroupingTypes = () => {
        businessGroupingApi.token = keycloak.token ?? '';
        businessGroupingApi
            .getBusinessGroupingTypes()
            .then((response) => {
                setBusinessGroupingTypes(response.data);
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `Unable to get business grouping types: ${SnackbarErrorOutput(error)}`,
                });
            });
    };

    return (
        <>
            <BusinessGroupingAddUpdateDialog
                onSubmitBusinessGroupingForm={groupingToEdit !== undefined ? onSubmitEditBusinessGrouping : onSubmitCreateBusinessGrouping}
                businessGroupingTypes={businessGroupingTypes}
                groupingToEdit={groupingToEdit}
                availableUsers={availableUsers}
                setAvailableUsers={setAvailableUsers}
                businessGroupingUsers={businessGroupingUsers}
                setBusinessGroupingUsers={setBusinessGroupingUsers}
                isDialogOpen={businessGroupingDialogOpen}
                onCloseDialog={onCloseDialog}
                setGroupingToEdit={setGroupingToEdit}
                selectedBusinessGroupingType={selectedBusinessGroupingType}
                setSelectedBusinessGroupingType={setSelectedBusinessGroupingType}
            />
            <BusinessGroupingLanding
                businessGroupingTypes={businessGroupingTypes}
                selectedGroupings={selectedBusinessGroupings}
                onClickDeleteSelectedGroupings={onClickDeleteSelectedGroupings}
                businessGroupings={businessGroupings}
                onClickOpenCreateBusinessGroupingDialog={onClickOpenCreateBusinessGroupingDialog}
                onClickOpenEditBusinessGroupingDialog={onClickOpenEditBusinessGroupingDialog}
                isLoading={isLoading}
                onClickEditBusinessGrouping={onClickOpenEditBusinessGroupingDialog}
                onClickDeleteBusinessGrouping={onClickDeleteBusinessGrouping}
                setSelectedBusinessGrouping={setSelectedBusinessGroupings}
            />
        </>
    );
};
const useStyles = makeStyles<IBusinessGroupingsControllerProps>()((theme, props) => ({}));

export { BusinessGroupingsController };
