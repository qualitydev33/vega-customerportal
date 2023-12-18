import { Box, ListItemButton, ListItemIcon, MenuItem, Stack, Theme, Tooltip, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useEffect, useState } from 'react';
import { useCommonDrawerStyles } from './drawer-menu-item-style';
import { GeminiMenuItem } from '@vegaplatformui/sharedassets';
import IconButton from '@mui/material/IconButton';
import { CollapsibleDrawerItem } from './collapsible-drawer-item';
import { makeStyles } from '@vegaplatformui/styling';
import { useTheme } from '@mui/material/styles';
import { Upload } from '@mui/icons-material';

interface IMainMenuItemItemProps {
    menuItem: GeminiMenuItem;
    title?: string;
    theme: Theme;
    isDrawerOpen: boolean;
    onSelectMenuItem: (menuItem: GeminiMenuItem) => void;
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MainMenuItem = (props: IMainMenuItemItemProps) => {
    const hasSubMenuItems = props.menuItem.subMenu && props.menuItem.subMenu.length > 0;
    const [showSubMenu, setShowSubMenu] = React.useState(false);
    const theme = useTheme();
    const [hasSelectedMenu, setHasSelectedMenu] = useState(false);
    const { cx, classes: commonClasses } = useCommonDrawerStyles({ isDrawerOpen: props.isDrawerOpen, isCollapsible: false });
    const { classes } = useStyles(props);

    const onClickMenuItem = (event: React.MouseEvent<any, MouseEvent>, menuItem: GeminiMenuItem) => {
        if (menuItem.subMenu && menuItem.subMenu.length > 0) {
            //do nothing clicked on parent
        } else {
            props.onSelectMenuItem(menuItem);
        }
        event.stopPropagation();
    };

    useEffect(() => {
        setHasSelectedMenu(props.menuItem.isSelected);
        props.menuItem &&
            props.menuItem.subMenu &&
            props.menuItem.subMenu.length > 0 &&
            props.menuItem.subMenu.forEach(function iter(item: GeminiMenuItem) {
                if (item.isSelected) {
                    setHasSelectedMenu(true);
                }
                Array.isArray(item.subMenu) && item.subMenu.forEach(iter);
            });
    }, [props.menuItem]);

    return (
        <MenuItem
            key={props.menuItem.title}
            onClick={(event) => {
                if (!props.isDrawerOpen && hasSubMenuItems) {
                    props.setIsDrawerOpen(!props.isDrawerOpen);
                    setShowSubMenu(!showSubMenu);
                }
                setShowSubMenu(!showSubMenu);
                onClickMenuItem(event, props.menuItem);
            }}
            className={cx(
                commonClasses.MenuItem,
                props.menuItem.isSelected && commonClasses.SelectedMenuItem,
                commonClasses.CommonMenuStyling,
                commonClasses.MainMenuItem
            )}
        >
            <>
                <MenuItem
                    className={cx(
                        props.isDrawerOpen ? commonClasses.SuperMenuItemOpen : commonClasses.SuperMenuItemClosed,
                        props.menuItem.isSelected || (hasSelectedMenu && (!props.isDrawerOpen || !showSubMenu))
                            ? commonClasses.SelectedSuperMenuItem
                            : commonClasses.HideSelectedMenuItem,
                        commonClasses.CommonMenuStyling
                    )}
                    component={'div'}
                    selected={(!hasSubMenuItems && props.menuItem.isSelected) || hasSelectedMenu}
                    onClick={hasSubMenuItems ? () => setShowSubMenu(!showSubMenu) : undefined}
                >
                    <Stack direction={'row'} alignItems={'center'}>
                        <Tooltip title={props.isDrawerOpen ? '' : props.menuItem.title}>
                            <props.menuItem.icon className={cx(classes.MainMenuIcon)} />
                        </Tooltip>

                        {props.isDrawerOpen && (
                            <Typography color={props.menuItem.isSelected ? theme.palette.primary.main : theme.palette.grey[700]} variant='body1'>
                                {props.menuItem.title}
                            </Typography>
                        )}
                    </Stack>
                    {props.isDrawerOpen && (
                        <div className={classes.SubMenuButton}>
                            {props.menuItem.subMenu &&
                                props.menuItem.subMenu.length > 0 &&
                                (showSubMenu ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />)}
                        </div>
                    )}
                </MenuItem>
                {hasSubMenuItems && props.isDrawerOpen && showSubMenu && (
                    <Box className={cx(classes.SubMenuBox)}>
                        {props.menuItem?.subMenu?.map((child: any, i: number) =>
                            child.subMenu && child.subMenu.length > 0 ? (
                                <CollapsibleDrawerItem
                                    onClickMenuItem={onClickMenuItem}
                                    key={`${child.title}-${i}`}
                                    isDrawerOpen={props.isDrawerOpen}
                                    theme={theme}
                                    menuItem={child}
                                />
                            ) : (
                                <ListItemButton
                                    onClick={(event) => {
                                        onClickMenuItem(event, child);
                                    }}
                                    key={child.title}
                                    sx={{
                                        width: '100%',
                                        padding: 0,
                                        paddingLeft: '1rem',
                                        '&:hover': {
                                            backgroundColor: 'inherit',
                                        },
                                    }}
                                >
                                    <MenuItem
                                        component='div'
                                        selected={child.isSelected}
                                        className={cx(classes.SubMenuItem, commonClasses.CommonMenuStyling)}
                                        sx={{
                                            '&.Mui-selected': child.isSelected ? commonClasses.SelectedMenuItem : {},
                                        }}
                                    >
                                        <ListItemIcon>
                                            <child.icon className={cx(commonClasses.SubMenuIcon)} />
                                        </ListItemIcon>
                                        <Stack
                                            className={cx(classes.MainMenuStack)}
                                            justifyContent={'space-between'}
                                            direction='row'
                                            alignItems='center'
                                            spacing={1}
                                        >
                                            <Typography
                                                color={child.isSelected ? theme.palette.primary.main : theme.palette.grey[700]}
                                                variant='body1'
                                            >
                                                {child.title}
                                            </Typography>
                                            {child.trailingIcon && <child.trailingIcon />}
                                        </Stack>
                                    </MenuItem>
                                </ListItemButton>
                            )
                        )}
                    </Box>
                )}
            </>
        </MenuItem>
    );
};

const useStyles = makeStyles<IMainMenuItemItemProps>()((theme, props) => ({
    SubMenuButton: {
        paddingTop: '0.4rem',
        marginLeft: 'auto',
    },
    SubMenuBox: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'start',
    },
    SubMenuItem: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '10px 16px',
        height: '44px',
    },
    MainMenuIcon: {
        marginRight: props.isDrawerOpen ? '1rem' : undefined,
    },
    MainMenuStack: { width: props.isDrawerOpen ? '16rem' : 'auto' },
}));
