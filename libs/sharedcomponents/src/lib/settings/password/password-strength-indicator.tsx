import { Box, Stack, Theme, Typography, useTheme } from '@mui/material';
import { makeStyles } from '@vegaplatformui/styling';

export interface IPasswordStrengthIndicatorProps {
    password: string;
}

const checkPasswordStrength = (password: string): number => {
    if (password.length < 2) {
        return 0;
    } else if (password.length < 4) {
        return 1;
    } else if (password.length < 8) {
        return 2;
    } else {
        // Has special characters
        if (/[~`!#$%\^]/.test(password)) {
            return 4;
        }
        return 3;
    }
};

const getIndicatorColor = (strength: number, theme: Theme): string => {
    if (strength === 1) {
        return theme.palette.error.main;
    } else if (strength === 2) {
        return theme.palette.warning.main;
    } else if (strength === 3) {
        return theme.palette.success.light;
    } else {
        return theme.palette.success.main;
    }
};

const PasswordStrengthIndicator: React.FC<IPasswordStrengthIndicatorProps> = (props) => {
    const { cx, classes } = useStyles();
    const theme = useTheme();

    const strength = checkPasswordStrength(props.password);
    const color = getIndicatorColor(strength, theme);

    return (
        <Stack sx={{ padding: '16px 18px' }} spacing={2}>
            <Typography variant='body1' fontWeight={theme.typography.fontWeightBold}>
                Password Requirements
            </Typography>
            <Stack direction={'row'} spacing={1}>
                {[0, 1, 2, 3].map((i) => (
                    <Box
                        key={i}
                        sx={{
                            height: 4,
                            width: '100%',
                            backgroundColor: strength >= i + 1 ? color : theme.palette.grey.A400,
                        }}
                    />
                ))}
            </Stack>
            <Box>
                <Typography>Password should include:</Typography>
                <ul className={cx(classes.RequirementsList)}>
                    <li>8 or more characters</li>
                    <li>Upper & lower case letters</li>
                    <li>A symbol (#%&^)</li>
                </ul>
            </Box>
        </Stack>
    );
};

const useStyles = makeStyles()((theme) => ({
    RequirementsList: {
        margin: 0,
    },
}));

export { PasswordStrengthIndicator };
