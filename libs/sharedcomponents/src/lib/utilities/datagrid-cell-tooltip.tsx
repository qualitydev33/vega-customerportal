import { Tooltip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { StyledToolTip } from './styled-tooltip';


const DataGridCellTooltip: React.FC<GridRenderCellParams> = (props) => {
	const { classes, cx } = useStyles(props);
	const [isOverflowed, setIsOverflow] = useState(false);
  	const { value } = props;

	const textElementRef = useRef<HTMLSpanElement | null>(null);

	const checkOverflow = () => {
		const clientWidth = textElementRef.current!.getBoundingClientRect().width;
		textElementRef.current!.style.overflow = "visible";
		const contentWidth = textElementRef.current!.getBoundingClientRect().width;
		textElementRef.current!.style.overflow = "hidden";
	
		setIsOverflow(contentWidth > clientWidth);
	  };
	
	useEffect(() => {
		checkOverflow();
		window.addEventListener("resize", checkOverflow);
		return () => {
			window.removeEventListener("resize", checkOverflow);
		};
	}, []);
	
	return (
		<StyledToolTip arrow title={value} disableHoverListener={!isOverflowed}>
			<span
				ref={textElementRef}
				className={cx(classes.nowrapText)}
			>
				{value}
			</span>
		</StyledToolTip>
	);
};

const useStyles = makeStyles<GridRenderCellParams>()((theme, props) => ({
	nowrapText: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
}))

export { DataGridCellTooltip };