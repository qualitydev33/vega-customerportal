import * as React from 'react';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import { IBusinessGrouping, IUser } from '@vegaplatformui/models';
import { KeyboardArrowLeft, KeyboardArrowRight, KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight } from '@mui/icons-material';
import {
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Checkbox,
    Button,
    List,
    Grid,
    Stack,
    Typography,
    Card,
    CardContent,
    Tooltip,
    ButtonGroup,
} from '@mui/material';
import { makeStyles, useCommonStyles } from '@vegaplatformui/styling';

function not(a: IUser[], b: IUser[]) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: IUser[], b: IUser[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

export interface IBusinessGroupingScopedUser {
    selectedUsers: IUser[];
    setSelectedUsers: React.Dispatch<SetStateAction<IUser[]>>;
    availableUsers: IUser[];
    setAvailableUsers: React.Dispatch<SetStateAction<IUser[]>>;
}

export const BusinessGroupingScopedUser: React.FC<IBusinessGroupingScopedUser> = (props) => {
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const { classes, cx } = useStyles({ props: props, dimension: dimensions });
    const commonStyles = useCommonStyles();
    const [checked, setChecked] = React.useState<IUser[]>([]);
    // const [left, setLeft] = React.useState<User[]>([]);

    const leftChecked = intersection(checked, props.selectedUsers);
    const rightChecked = intersection(checked, props.availableUsers);
    const dialogRef = useRef<any>();

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ height: window.innerHeight, width: window.innerWidth });
        };

        const dimensionsTimeout = setTimeout(() => {
            if (dialogRef.current) {
                setDimensions({
                    height: window.innerHeight,
                    width: window.innerWidth,
                });
            }
        }, 1000);

        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(dimensionsTimeout);
            window.removeEventListener('resize', handleResize);
        };
    }, [dialogRef]);

    const handleToggle = (value: IUser) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllLeft = () => {
        props.setAvailableUsers(props.availableUsers.concat(props.selectedUsers));
        props.setSelectedUsers([]);
    };

    const handleCheckedLeft = () => {
        props.setAvailableUsers(props.availableUsers.concat(leftChecked));
        props.setSelectedUsers(not(props.selectedUsers, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedRight = () => {
        props.setSelectedUsers(props.selectedUsers.concat(rightChecked));
        props.setAvailableUsers(not(props.availableUsers, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllRight = () => {
        props.setSelectedUsers(props.selectedUsers.concat(props.availableUsers));
        props.setAvailableUsers([]);
    };

    const customList = (items: IUser[]) => (
        <List dense component='div' role='list' className={cx(classes.CustomListPaper)}>
            <Stack spacing={0.5}>
                {items.map((value: IUser) => {
                    const labelId = `transfer-list-item-${value}-label`;

                    return (
                        <Card key={value.id} elevation={1}>
                            <ListItemButton role='listitem' onClick={handleToggle(value)}>
                                <ListItemIcon>
                                    <Checkbox
                                        checked={checked.indexOf(value) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{
                                            'aria-labelledby': labelId,
                                        }}
                                    />
                                </ListItemIcon>
                                <Tooltip title={`${value.given_name} ${value.family_name} - ${value.email}`}>
                                    <ListItemText
                                        id={labelId}
                                        primary={`${value.given_name} ${value.family_name}`}
                                        primaryTypographyProps={{ noWrap: true }}
                                        secondary={value.email}
                                        secondaryTypographyProps={{ noWrap: true }}
                                    />
                                </Tooltip>
                            </ListItemButton>
                        </Card>
                    );
                })}
            </Stack>
        </List>
    );

    return (
        <Grid
            className={cx(classes.GridBackground)}
            sx={{ padding: 2, marginTop: 2, marginLeft: 2 }}
            container
            spacing={2}
            direction={dimensions.width > 912 ? 'row' : 'column'}
            justifyContent='center'
            alignItems='center'
        >
            <Grid item>
                <Stack spacing={0.5}>
                    <Card elevation={1}>
                        <CardContent>
                            <Typography variant={'subtitle2'}>Users To Assign</Typography>
                        </CardContent>
                    </Card>
                    {customList(props.availableUsers)}
                </Stack>
            </Grid>
            {/*            <Grid item>
                <Stack spacing={0.5}>
                    <Card elevation={1}>
                        <CardContent>
                            <Typography variant={'subtitle2'}>Assigned Users</Typography>
                        </CardContent>
                    </Card>
                    {customList(props.selectedUsers)}
                </Stack>
            </Grid>*/}

            <Grid item>
                <Stack spacing={0.5} direction={'column'} alignItems={'center'}>
                    <Tooltip title='Unassign All'>
                        <Button
                            className={cx(classes.ArrowButtons)}
                            variant='outlined'
                            size='small'
                            onClick={handleAllLeft}
                            disabled={props.selectedUsers.length === 0}
                            aria-label='move all left'
                        >
                            <KeyboardDoubleArrowLeft />
                        </Button>
                    </Tooltip>
                    <Tooltip title='Unassign Selected'>
                        <Button
                            className={cx(classes.ArrowButtons)}
                            variant='outlined'
                            size='small'
                            onClick={handleCheckedLeft}
                            disabled={leftChecked.length === 0}
                            aria-label='move selected left'
                        >
                            <KeyboardArrowLeft />
                        </Button>
                    </Tooltip>
                    <Tooltip title='Assign Selected'>
                        <Button
                            className={cx(classes.ArrowButtons)}
                            variant='outlined'
                            size='small'
                            onClick={handleCheckedRight}
                            disabled={rightChecked.length === 0}
                            aria-label='move selected right'
                        >
                            <KeyboardArrowRight />
                        </Button>
                    </Tooltip>
                    <Tooltip title='Assign All'>
                        <Button
                            className={cx(classes.ArrowButtons)}
                            variant='outlined'
                            size='small'
                            onClick={handleAllRight}
                            disabled={props.availableUsers.length === 0}
                            aria-label='move all right'
                        >
                            <KeyboardDoubleArrowRight />
                        </Button>
                    </Tooltip>
                </Stack>
            </Grid>
            <Grid item>
                <Stack spacing={0.5}>
                    <Card elevation={1}>
                        <CardContent>
                            <Typography variant={'subtitle2'}>Assigned Users</Typography>
                        </CardContent>
                    </Card>
                    {customList(props.selectedUsers)}
                </Stack>
            </Grid>
        </Grid>
    );
};

interface IBusinessGroupingScopedUserStyles {
    props: IBusinessGroupingScopedUser;
    dimension: { width: number; height: number };
}

const useStyles = makeStyles<IBusinessGroupingScopedUserStyles>()((theme, input) => ({
    ArrowButtons: {
        marginTop: '0.5',
    },
    CustomListPaper: {
        width: 330,
        overflowY: 'auto',
        height: input.dimension.width < 912 ? 'auto' : 260,
    },
    GridBackground: {
        backgroundColor: theme.palette.grey[50],
    },
}));
