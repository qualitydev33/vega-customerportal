import * as React from 'react';
import { Menu, MenuItem, Stack, Chip, IconButton, Typography, useTheme, LinearProgress } from '@mui/material';
import { MoreHoriz, FiberManualRecord } from '@mui/icons-material';
import { INotification, INotificationStatusEnum } from '@vegaplatformui/models';
import { makeStyles } from '@vegaplatformui/styling';
import InfiniteScroll from 'react-infinite-scroll-component';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface INotificationsInboxCardProps {
    notifications: INotification[];
    anchorEl: HTMLElement | null;
    hasMore: boolean;
    notificationStatus: INotificationStatusEnum;
    onClose: () => void;
    setNotificationStatus: React.Dispatch<React.SetStateAction<INotificationStatusEnum>>;
    onFetchMore: () => void;
    onNavigate: () => void;
}

const NotificationsInboxCard: React.FC<INotificationsInboxCardProps> = (props) => {
    const theme = useTheme();
    const { classes, cx } = useStyles(props);

    const [moreMenuAnchorEl, setMoreMenuAnchorEl] = React.useState<HTMLElement | null>(null);
    const [itemMoreMenuAnchorEl, setItemMoreMenuAnchorEl] = React.useState<HTMLElement | null>(null);
    const [itemMoreButtonIdx, setItemMoreButtonIdx] = React.useState(-1);

    const timeFormatCallback = React.useCallback((targetTimeStr: string) => {
        const timeDifference = formatDistanceToNow(new Date(targetTimeStr), { locale: enUS });
        const formattedString = `${timeDifference} ago`;
        return formattedString;
    }, []);

    const closeMoreMenu = () => setMoreMenuAnchorEl(null);
    const closeItemMoreMenu = () => setItemMoreMenuAnchorEl(null);
    const onClickUnreadButton = (event: React.MouseEvent<HTMLElement>) => {
        setMoreMenuAnchorEl(event.currentTarget);
    };
    const onClickItemMoreButton = (event: React.MouseEvent<HTMLElement>) => {
        setItemMoreMenuAnchorEl(event.currentTarget);
    };
    const onMarkAsUnreadAll = () => {
        closeMoreMenu();
    };
    const onGoNotificationSettings = () => {
        closeMoreMenu();
        props.onNavigate();
    };
    const onMarkAsUnread = () => {
        closeItemMoreMenu();
    };
    const onDelete = () => {
        closeItemMoreMenu();
    };

    const MoreMenuRender = () => (
        <>
            <IconButton onClick={onClickUnreadButton}>
                <MoreHoriz />
            </IconButton>

            <Menu anchorEl={moreMenuAnchorEl} open={Boolean(moreMenuAnchorEl)} onClose={() => setMoreMenuAnchorEl(null)} elevation={1}>
                {/* <MenuItem onClick={onMarkAsUnreadAll}>Mark all as read</MenuItem> */}
                <MenuItem onClick={onGoNotificationSettings}>Notification Settings</MenuItem>
            </Menu>
        </>
    );

    const MenuItemMoreMenuRender = () => (
        <>
            <IconButton className={cx(classes.ItemMoreButton)} onClick={onClickItemMoreButton}>
                <MoreHoriz />
            </IconButton>

            <Menu anchorEl={itemMoreMenuAnchorEl} open={Boolean(itemMoreMenuAnchorEl)} onClose={() => setItemMoreMenuAnchorEl(null)} elevation={1}>
                <MenuItem onClick={onMarkAsUnread}>Mark as read</MenuItem>
                <MenuItem onClick={onDelete}>Remove this notification</MenuItem>
            </Menu>
        </>
    );

    const ChipListRender = () => {
        return (
            <Stack direction={'row'}>
                {['Unread', 'Read', 'All'].map((x) => (
                    <Chip
                        key={x}
                        label={x}
                        className={`${x === props.notificationStatus ? cx(classes.FilterChipActive) : cx(classes.FilterChipInActive)}`}
                        onClick={() => props.setNotificationStatus(x as INotificationStatusEnum)}
                    />
                ))}
            </Stack>
        );
    };

    return (
        <Menu anchorEl={props.anchorEl} open={Boolean(props.anchorEl)} onClose={props.onClose} className={cx(classes.NotificationInboxCard)}>
            <Stack direction={'row'} width={'100%'} justifyContent={'space-between'} alignItems={'center'}>
                {/* {ChipListRender()} */}
                <Typography paddingX={2} paddingY={1}>
                    All Notifications
                </Typography>
                {/*{MoreMenuRender()}*/}
            </Stack>
            {/* <Typography paddingX={2} paddingY={1}>{props.notificationStatus}</Typography> */}
            <InfiniteScroll
                dataLength={props.notifications.length}
                next={props.onFetchMore}
                hasMore={props.hasMore}
                loader={
                    <Stack padding={1}>
                        <LinearProgress />
                    </Stack>
                }
                height={500}
                endMessage={
                    <Typography fontWeight={'bold'} textAlign={'center'}>
                        Yay! You have seen it all
                    </Typography>
                }
            >
                {props.notifications.map((x, idx) => (
                    <MenuItem
                        key={`${x.id}_${idx}`}
                        className={cx(classes.MenuItemBorder)}
                        onMouseEnter={() => setItemMoreButtonIdx(idx)}
                        onMouseLeave={() => setItemMoreButtonIdx(-1)}
                    >
                        <Stack width={'100%'}>
                            <Stack direction={'row'} alignItems={'center'} width={'100%'} justifyContent={'space-between'} columnGap={2}>
                                <Typography variant='subtitle2' className={cx(classes.NotificationItemTitle)}>
                                    {x.content}
                                </Typography>
                                {/* {!x.read && <FiberManualRecord className={cx(classes.UnreadStatusButton)} />} */}
                                {/* {idx === itemMoreButtonIdx && MenuItemMoreMenuRender()} */}
                            </Stack>
                            <Typography variant='subtitle2' color={theme.palette.grey[300]}>
                                {timeFormatCallback(x.created_at)}
                            </Typography>
                        </Stack>
                    </MenuItem>
                ))}
            </InfiniteScroll>
        </Menu>
    );
};

const useStyles = makeStyles<INotificationsInboxCardProps>()((theme, props) => ({
    NotificationInboxCard: {
        '& .MuiMenu-list': {
            width: '420px',
        },
    },
    UnreadStatusButton: {
        color: theme.palette.primary.main,
        fontSize: '0.7rem',
    },
    MenuItemBorder: {
        borderWidth: 0,
        borderStyle: 'solid',
        borderColor: theme.palette.grey[100],
        borderBottomWidth: 'thin',
    },
    FilterChipActive: {
        color: theme.palette.primary.main,
        backgroundColor: `${theme.palette.primary.light}60`,
    },
    FilterChipInActive: {
        backgroundColor: 'transparent',
        color: theme.palette.grey[500],
    },
    ItemMoreButton: {
        position: 'absolute',
        right: '60px',
        top: '10px',
        backgroundColor: theme.palette.grey[100],
        '&:hover': {
            backgroundColor: theme.palette.grey[100],
        },
    },
    NotificationItemTitle: {
        wordBreak: 'break-word',
        whiteSpace: 'break-spaces',
    }
}));

export { NotificationsInboxCard };
