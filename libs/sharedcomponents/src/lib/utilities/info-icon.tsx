import { useCommonStyles } from '@vegaplatformui/styling';
import { Info } from '@mui/icons-material';
import { StyledToolTip } from '@vegaplatformui/sharedcomponents';

export interface IVegaInfoIcon {
    title: string;
}
const VegaInfoIcon: React.FC<IVegaInfoIcon> = (props) => {
    const { cx, classes } = useCommonStyles();

    return (
        <StyledToolTip title={props.title}>
            <Info />
        </StyledToolTip>
    );
};

export { VegaInfoIcon };
