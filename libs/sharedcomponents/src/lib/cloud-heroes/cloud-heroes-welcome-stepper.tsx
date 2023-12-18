import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Button, Card, CardContent, CardHeader, Container, Grid, MobileStepper, Stack, Typography, useTheme } from '@mui/material';
import { CloudHeroPurple, CloudHeroTitle } from '@vegaplatformui/sharedassets';
import { Circle, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import Keycloak from 'keycloak-js';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICloudHeroesWelcomeStepperProps {
    cardClassName: string;
    keycloak: Keycloak;
}

const CloudHeroesWelcomeStepper: React.FC<ICloudHeroesWelcomeStepperProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [activeStep, setActiveStep] = React.useState(0);
    const theme = useTheme();
    const cardRef = useRef<any>();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const handleResize = () => {
            setDimensions(getDimensions());
        };

        const dimensionsTimeout = setTimeout(() => {
            if (cardRef.current) {
                setDimensions(getDimensions());
            }
        }, 100);

        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(dimensionsTimeout);
            window.removeEventListener('resize', handleResize);
        };
    }, [cardRef]);

    const getDimensions = () => ({
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
    });

    const onClickNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const onClickBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const steps: JSX.Element[] = [
        <Grid direction={'column'} container justifyContent='center' alignItems='center'>
            <Grid item xs={12}>
                <CloudHeroTitle />
            </Grid>
            <Grid item xs={12}>
                <Stack spacing={2} direction={'column'} justifyContent='center' alignItems='center'>
                    <Stack direction={'column'} justifyContent='center' alignItems='center'>
                        <Typography>{`Welcome, ${
                            props.keycloak.tokenParsed?.given_name && props.keycloak.tokenParsed?.family_name
                                ? `${props.keycloak.tokenParsed?.given_name} ${props.keycloak.tokenParsed?.family_name}`
                                : props.keycloak.tokenParsed?.email
                        }`}</Typography>
                        <Stack spacing={1} justifyContent='center' alignItems='center' direction={'row'}>
                            {/*ToDo: Where does this data come from?*/}
                            {/*<Typography>{`[Job Title]`}</Typography>*/}
                            {/*<Circle sx={{ fontSize: '.5rem' }} />*/}
                            {/*<Typography>{`[Company]`}</Typography>*/}
                        </Stack>
                    </Stack>
                    <Typography align={'center'}>
                        Due to your outstanding efforts optimizing your cloud usage and spend leveraging Vega, you are officially a Cloud Hero. Thank
                        you, from the Vega and Cloud Hero teams.
                    </Typography>
                </Stack>
            </Grid>
        </Grid>,
        <Grid className={cx(classes.WelcomeStepperStep)} spacing={2} direction={'column'} container justifyContent='center' alignItems='center'>
            <Grid item xs={12}>
                <Typography fontWeight={500} variant={'h6'}>
                    What is a Cloud Hero?
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography align={'center'}>
                    Cloud Hero is a premier program designed by Vega to encourage correct and mindful cloud behaviour through incentives and
                    recognition in order to increase client satisfaction and involvement.
                </Typography>
            </Grid>
        </Grid>,
        <Grid className={cx(classes.WelcomeStepperStep)} spacing={2} direction={'column'} container justifyContent='center' alignItems='center'>
            <Grid item xs={12}>
                <Typography fontWeight={500} variant={'h6'}>
                    How do Cloud Heroes receive rewards?
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography align={'center'}>
                    By leveraging Vega, accepting our recommendations, earning badges, and increasing your cloud savings, you can receive rewards for
                    your effective usage.
                </Typography>
            </Grid>
        </Grid>,
        <Grid className={cx(classes.WelcomeStepperStep)} spacing={2} direction={'column'} container justifyContent='center' alignItems='center'>
            <Grid item xs={12}>
                <Typography fontWeight={500} variant={'h6'}>
                    How does Cloud Hero Work?
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography align={'center'}>
                    Vega's intelligence engine will identify progress through actions taken on recommendations and real-time calculated cloud savings.
                </Typography>
            </Grid>
        </Grid>,
        <Grid className={cx(classes.WelcomeStepperStep)} spacing={2} direction={'column'} container justifyContent='center' alignItems='center'>
            <Grid item xs={12}>
                <Typography fontWeight={500} variant={'h6'}>
                    How can I get more information?
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography align={'center'}>
                    Please contact Payton Ross, Cloud Hero Specialist, if you have additional questions regarding Cloud Hero.
                </Typography>
            </Grid>
        </Grid>,
    ];

    return (
        <Card ref={cardRef} elevation={0} className={cx(classes.Card, props.cardClassName)}>
            <Grid spacing={2} container direction='column' justifyContent={'space-between'}>
                <Grid className={cx(classes.CardGridStepContainer)} item xs={12}>
                    {steps[activeStep]}
                </Grid>
                <Grid item xs={12}>
                    <MobileStepper
                        color={'white'}
                        variant='dots'
                        steps={steps.length}
                        position='static'
                        activeStep={activeStep}
                        sx={{
                            flex: 1,
                            minWidth: dimensions.width - 40,
                            background: 'white',
                        }}
                        nextButton={
                            <Button size='small' onClick={onClickNext} disabled={activeStep === steps.length - 1}>
                                Next
                                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                            </Button>
                        }
                        backButton={
                            <Button size='small' onClick={onClickBack} disabled={activeStep === 0}>
                                {/* eslint-disable-next-line react/jsx-no-undef */}
                                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                                Back
                            </Button>
                        }
                    />
                </Grid>
            </Grid>
        </Card>
    );
};

const useStyles = makeStyles<ICloudHeroesWelcomeStepperProps>()((theme, props) => ({
    Card: {
        padding: '1rem',
    },
    WelcomeStepperStep: {
        marginTop: '1rem',
    },
    CardGridStepContainer: {
        minHeight: '17.5rem',
    },
}));

export { CloudHeroesWelcomeStepper };
