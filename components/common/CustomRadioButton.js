import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function CustomRadioButton({label, row = true, value, handleChange, options}) {

    return (
        <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">{label}</FormLabel>
            <RadioGroup
                row={row}
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value || ''}
                onChange={handleChange}
                color="success"
            >
                {options.map(option => (
                    <FormControlLabel value={option} control={<Radio/>} label={option} key={option}/>
                ))}
            </RadioGroup>
        </FormControl>
    );
}
