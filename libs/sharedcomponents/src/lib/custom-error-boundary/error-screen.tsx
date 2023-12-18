import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { Button, Grid, Typography } from '@mui/material';
import { makeStyles } from '@vegaplatformui/styling';
import { GeminiMenuItem, VegaCow } from '@vegaplatformui/sharedassets';
import { ShowSupportForm } from '@vegaplatformui/sharedcomponents';
import { useRecoilState } from 'recoil';
import { SupportEmailRecipient } from '@vegaplatformui/models';

export interface IErrorScreenProps extends FallbackProps {
    menuItems: GeminiMenuItem[];
    setSidebarMenuItems: React.Dispatch<React.SetStateAction<GeminiMenuItem[]>>;
}

const ErrorScreen: React.FC<IErrorScreenProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [showSupport, setShowSupport] = useRecoilState(ShowSupportForm);

    const onCickSupport = () => {
        setShowSupport({ showSupportForm: !showSupport, contactType: SupportEmailRecipient.Support });
    };

    return (
        <Grid className={cx(classes.Container)} container direction='column' justifyContent='center' alignItems='center'>
            <Grid item>
                {process.env.REACT_APP_DEVELOPMENT !== 'false' ? (
                    <Typography variant={'h6'}>{props.error.message}</Typography>
                ) : (
                    <Typography variant={'h6'}>We're sorry, something went wrong. If the problem persists, feel free to contact us. </Typography>
                )}
            </Grid>
            <Grid item>
                <VegaCow className={cx(classes.Vcow)} />{' '}
            </Grid>
            <Grid item>
                <Button color={'primary'} onClick={onCickSupport} disabled={false}>
                    Contact us!
                </Button>
            </Grid>
        </Grid>
    );
};

const useStyles = makeStyles<IErrorScreenProps>()((theme, props) => ({
    Container: { height: '100vh' },
    Vcow: { width: '100%' },
}));

export { ErrorScreen };
