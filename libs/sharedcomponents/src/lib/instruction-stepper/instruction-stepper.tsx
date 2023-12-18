import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Box, Button, Paper, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material';

export type InstructionStepperSteps = {
    label: string;
    description: string;
    button?: JSX.Element;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IInstructionStepperProps {
    steps: InstructionStepperSteps[];
    hasLastStep?: boolean;
}

const InstructionStepper: React.FC<IInstructionStepperProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box>
            <Typography fontWeight={'600'}>Instructions</Typography>
            <Stepper activeStep={activeStep} orientation='vertical'>
                {props.steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                props.hasLastStep && index === props.steps.length - 1 ? <Typography variant='caption'>Last step</Typography> : null
                            }
                        >
                            {step.label}
                        </StepLabel>

                        <StepContent>
                            <Typography color={'grey'} variant={'subtitle2'}>
                                {step.description}
                            </Typography>
                            {step.button && step.button}
                            <Box className={cx(classes.ButtonContainer)}>
                                <>
                                    <Button disabled={index === 0} onClick={handleBack} className={cx(classes.Button)}>
                                        Back
                                    </Button>
                                    <Button variant='contained' onClick={handleNext} className={cx(classes.Button)}>
                                        {index === props.steps.length - 1 ? 'Finish' : 'Continue'}
                                    </Button>
                                </>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === props.steps.length && (
                <Paper square elevation={0} className={cx(classes.FinishContainer)}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset} className={cx(classes.Button)}>
                        Reset
                    </Button>
                </Paper>
            )}
        </Box>
    );
};

const useStyles = makeStyles<IInstructionStepperProps>()((theme, props) => ({
    Button: {
        marginTop: 1,
        marginRight: 1,
    },
    ButtonContainer: { marginBottom: 2 },
    FinishContainer: {
        padding: 3,
    },
}));

export { InstructionStepper };
