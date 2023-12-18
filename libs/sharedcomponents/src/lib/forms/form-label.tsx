import { makeStyles } from '@vegaplatformui/styling';
import { HTMLProps } from 'react';

interface IFormLabelProps extends HTMLProps<HTMLLabelElement> {
    children: React.ReactNode;
}

function FormLabel({ children, ...htmlProps }: IFormLabelProps) {
    const { classes, cx } = useStyles();

    return (
        <label className={cx(classes.Label)} {...htmlProps}>
            <div>{children}</div>
        </label>
    );
}

const useStyles = makeStyles()((theme) => ({
    Label: {
        fontSize: 12,
        fontWeight: theme.typography.fontWeightBold,
        color: theme.palette.grey['900'],
    },
}));

export { FormLabel };
