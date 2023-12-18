import {
	KeyboardArrowUp,
	KeyboardArrowDown
} from '@mui/icons-material';
import { Button, Collapse } from '@mui/material';
import { GridToolbar } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DataGridCustomToolbarProps {}

const DataGridCustomToolbar: React.FC<DataGridCustomToolbarProps> = (props) => {
	const { classes, cx } = useStyles(props);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onShowOrHide = () => {
		setIsOpen(!isOpen);
	};
	return (
		<div>
			<Button
				className={cx(classes.FilterOptionButton)}
				endIcon={isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
				onClick={onShowOrHide}
				variant='text'
			>
				{isOpen ? 'Hide' : 'Show'} table filters
			</Button>
			<Collapse in={isOpen} timeout='auto' unmountOnExit>
				<GridToolbar />
			</Collapse>
		</div>
	);
};

const useStyles = makeStyles<DataGridCustomToolbarProps>()((theme, props) => ({
	FilterOptionButton: {
        color: theme.palette.grey[900],
        fontWeight: 'bold',
        textTransform: 'none',
    },
}))

export { DataGridCustomToolbar };