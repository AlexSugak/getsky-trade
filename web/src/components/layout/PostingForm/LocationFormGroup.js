import React from 'react';
import { Field } from 'redux-form';

import Countries from './countriesList';
import { FormTextArea, FormDropdown, FormInput, FormGroup } from '../Form';

const placeHolder = `Example: I can meet in the Starbucks on Main St,\nin McDonalds on Broad St, or anywhere in the "X" shopping district.\nI can meet anytime between 1-4pm and my minimum trade is 1 XMR.'`;

const LocationFormGroup = ({ showStates }) => (
    <FormGroup label={'Your location'}>
        <Field name="country" component={FormDropdown} options={Countries} label={'Country'} />
        {showStates &&
            <Field name="state" component={FormDropdown} options={Countries} label={'State'} />
        }
        <Field name="city" component={FormInput} label={'City'} />
        <Field name="postalCode" component={FormInput} label={'Postal code (required for most countries)'} />
        <Field name="additionalInfo" component={FormTextArea} label={'Additional information (optional)'} tip={'Up to 3,000 characters'} placeholder={placeHolder} />
    </FormGroup>
)

export default LocationFormGroup;
