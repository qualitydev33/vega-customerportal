import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Button, Menu, MenuItem } from '@mui/material';
import { Add, ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { ContainerType } from '@vegaplatformui/models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICreateContainerButtonProps {
    onOpenSpaceDialog: (type: ContainerType) => void;
}

interface spaceOption {
    name: string;
    type: ContainerType;
}

const CreateContainerButton: React.FC<ICreateContainerButtonProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isCreateMenuOpen = Boolean(anchorEl);
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const options: spaceOption[] = [
        { name: 'Space', type: ContainerType.Space },
        { name: 'Workload', type: ContainerType.Workload },
        { name: 'Resource Pool', type: ContainerType.ResourcePool },
    ];

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleToggleCreateDropDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
        const selectedOption = options[index];
        props.onOpenSpaceDialog(selectedOption.type);
        setSelectedIndex(index);
        handleClose();
    };

    return (
        <>
            <Button
                startIcon={<Add />}
                className={cx(classes.CreateContainerButton)}
                variant={'contained'}
                onClick={handleToggleCreateDropDown}
                endIcon={isCreateMenuOpen ? <ArrowDropUp /> : <ArrowDropDown />}
            >
                Create
            </Button>
            <Menu id='resource-create-menu' anchorEl={anchorEl} open={isCreateMenuOpen} onClose={handleClose}>
                {options.map((option: spaceOption, index: number) => (
                    <MenuItem key={option.type} selected={index === selectedIndex} onClick={(event) => handleMenuItemClick(event, index)}>
                        {option.name}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

const useStyles = makeStyles<ICreateContainerButtonProps>()((theme, props) => ({
    CreateContainerButton: {
        textTransform: 'none',
    },
}));

export { CreateContainerButton };
