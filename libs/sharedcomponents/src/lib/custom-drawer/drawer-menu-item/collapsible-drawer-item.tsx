import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { useNavigate } from 'react-router-dom';
import { Box, ListItemIcon, MenuItem, Stack, Theme, Typography, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { GeminiMenuItem } from '@vegaplatformui/sharedassets';
import { useCommonDrawerStyles } from './drawer-menu-item-style';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICollapsibleDrawerItemProps {
    menuItem: GeminiMenuItem;
    title?: string;
    theme: Theme;
    isDrawerOpen: boolean;
    onClickMenuItem: (event: React.MouseEvent<any, MouseEvent>, menuItem: GeminiMenuItem) => void;
}

const CollapsibleDrawerItem: React.FC<ICollapsibleDrawerItemProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const { classes: commonClasses } = useCommonDrawerStyles({ isDrawerOpen: props.isDrawerOpen, isCollapsible: true });
    const navigate = useNavigate();
    const theme = useTheme();
    const [showSubMenu, setShowSubMenu] = React.useState(false);

    const onClickShowSubMenu = (event: React.MouseEvent<any, MouseEvent>) => {
        setShowSubMenu(!showSubMenu);
        event.stopPropagation();
    };

    return (
        <MenuItem
            component='div'
            key={props.menuItem.title}
            className={cx(
                props.menuItem.isSelected && commonClasses.SelectedMenuItem,
                commonClasses.CommonMenuStyling,
                commonClasses.MenuItem,
                classes.MainMenu
            )}
            onClick={(event) => {
                setShowSubMenu(!showSubMenu);
                event.stopPropagation();
            }}
        >
            <>
                {/*
                <StyledToolTip title={props.menuItem.title} arrow={true} placement='right'>
*/}
                <Stack className={cx(classes.MainMenuStack)} justifyContent={'space-between'} direction='row' alignItems='center' spacing={1}>
                    <Box onClick={onClickShowSubMenu} className={cx(classes.MainMenuBox)}>
                        <ListItemIcon className={cx(commonClasses.SubMenuIcon)}>
                            <props.menuItem.icon className={cx(commonClasses.SubMenuIcon)} />
                        </ListItemIcon>
                        {props.isDrawerOpen && (
                            <Typography color={theme.palette.grey[50]} variant='body1'>
                                {props.menuItem.title}
                            </Typography>
                        )}
                    </Box>
                    <IconButton onClick={(event) => onClickShowSubMenu(event)}>
                        {showSubMenu ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </Stack>
                {/*
                </StyledToolTip>
*/}
                {props.menuItem.subMenu && props.menuItem.subMenu.length > 0 && props.isDrawerOpen && (
                    <Box className={cx(classes.SubMenuBox)}>
                        {showSubMenu &&
                            props.menuItem?.subMenu?.map((child: any, i: number) => (
                                /*
                                <StyledToolTip key={`${child.title}-{i}`} title={child.title} arrow={true} placement='right'>
*/
                                <div key={`${child.title}-${i}`}>
                                    <MenuItem
                                        className={cx(
                                            child.isSelected && commonClasses.SelectedMenuItem,
                                            commonClasses.CommonMenuStyling,
                                            commonClasses.MenuItem
                                        )}
                                        component='div'
                                        selected={child.isSelected}
                                        onClick={(event) => {
                                            props.onClickMenuItem(event, child);
                                        }}
                                    >
                                        <Box display={'flex'}>
                                            <Typography color={theme.palette.grey[50]} variant='body1'>
                                                {child.title}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                </div>
                            ))}
                        {/*
                                </StyledToolTip>
*/}
                    </Box>
                )}
            </>
        </MenuItem>
    );
};

const useStyles = makeStyles<ICollapsibleDrawerItemProps>()((theme, props) => ({
    MainMenuStack: { width: props.isDrawerOpen ? '13rem' : 'auto' },
    MainMenu: { marginLeft: '1rem' },
    MainMenuBox: {
        display: 'flex',
    },
    SubMenuBox: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'start',
        marginLeft: '2.15rem',
    },
}));

export { CollapsibleDrawerItem };
