import React, { useEffect, useMemo, useState } from 'react';
import { NotificationInboxAnchorElAtom, NotificationsInboxCard, useErrorHandlingV2 } from '@vegaplatformui/sharedcomponents';
import { INotification, INotificationStatusEnum } from '@vegaplatformui/models';
import { NotificationsAPI } from '@vegaplatformui/apis';
import { useKeycloak } from '@react-keycloak-fork/web';
import { useNavigate } from 'react-router-dom';
import { RouteUrls } from '../../routes/routeUrls';
import { useRecoilState } from 'recoil';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NotificationControllerProps {}

const NotificationController: React.FC<NotificationControllerProps> = (props) => {
	const NOTIFICATION_COUNT = 10;
	const LOAD_MORE_NOTIFICATION_COUNT = 10;
	const { keycloak } = useKeycloak();
	const navigate = useNavigate();
	const notificationsApi = useMemo(() => {
        const apiInstance = new NotificationsAPI();
        apiInstance.token = keycloak.token ?? '';
        return apiInstance;
    }, [keycloak.token]);
	const [withErrorHandlingV2] = useErrorHandlingV2();

	const [notifications, setNotifications] = useState<INotification[]>([]);
	const [hasMoreNotifications, setHasMoreNotifications] = useState<boolean>(true);
	const [notificationStatus, setNotificationStatus] = useState<INotificationStatusEnum>(INotificationStatusEnum.ALL);
	const [notificationInboxAnchorEl, setNotificationInboxAnchorEl] = useRecoilState(NotificationInboxAnchorElAtom);

	const getNotifications = () => {
		withErrorHandlingV2(async () => {
			const res = await notificationsApi.getOrganizationNotifications(NOTIFICATION_COUNT);
			setNotifications(res.data);
		}, 'Failed to retrieve the notifications');
    };
	const filterNotifications = (status: INotificationStatusEnum) => {
        // switch (status) {
        //     case INotificationStatusEnum.READ:
        //         setNotifications(prev => prev.filter(x => x.read === true));
        //         break;
        //     case INotificationStatusEnum.UNREAD:
        //         setNotifications(prev => prev.filter(x => x.read === false));
        //         break;
        //     default:
        //         break;
        // }
    };
	const fetchMoreNotifications = () => {
		withErrorHandlingV2(async () => {
			const res = await notificationsApi.getOrganizationNotifications(LOAD_MORE_NOTIFICATION_COUNT, notifications.length);
			if (res.data.length < LOAD_MORE_NOTIFICATION_COUNT) setHasMoreNotifications(false);
			setNotifications([...notifications, ...res.data]);
		}, 'Failed to retrive more notifications');
	};
	const navigateToNotificationSetting = React.useCallback(() => {
		setNotificationInboxAnchorEl(null);
		navigate(RouteUrls.settings.url, { state: { tab: 'notifications' } })
	}, []);


	useEffect(() => {
		if (notificationInboxAnchorEl) {
			setHasMoreNotifications(true);
			setNotifications([]);
			getNotifications();
		}
	}, [notificationInboxAnchorEl]);

	useEffect(() => {
    	filterNotifications(notificationStatus);
	}, [notificationStatus]);

	return (
		<NotificationsInboxCard
			notifications={notifications}
			anchorEl={notificationInboxAnchorEl}
			notificationStatus={notificationStatus}
			setNotificationStatus={setNotificationStatus}
			onFetchMore={fetchMoreNotifications}
			hasMore={hasMoreNotifications}
			onNavigate={navigateToNotificationSetting}
			onClose={() => setNotificationInboxAnchorEl(null)}
		/>
	);
};

export { NotificationController };