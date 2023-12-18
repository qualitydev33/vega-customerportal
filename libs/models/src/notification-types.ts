export enum INotificationStatusEnum {
	UNREAD = 'Unread',
	READ = 'Read',
	ALL = 'All',
}

export interface INotification {
	id: string;
	user_id: string;
	content: string;
	read: boolean;
	created_at: string;
}