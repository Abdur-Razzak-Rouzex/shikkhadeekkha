import { Step, StepLabel, Stepper } from '@mui/material';
import React from 'react';

export default function AdmissionWizard({ activeStep = 0 }) {
    return (
        <Stepper activeStep={activeStep} alternativeLabel sx={{marginTop: 5}}>
            {['লগইন', 'শিক্ষার্থীর তথ্য', 'পিতামাতার তথ্য', 'একাডেমিক অভিভাবক', 'অন্যান্য তথ্য', 'পেমেন্ট মেথড', 'সাবমিট করুন'].map(
                (step) => (
                    <Step key={step}>
                        <StepLabel>{step}</StepLabel>
                    </Step>
                )
            )}
        </Stepper>
    );
}
