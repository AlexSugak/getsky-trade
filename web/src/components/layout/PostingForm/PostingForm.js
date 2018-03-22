import React from 'react';
import { reduxForm, Form, Field } from 'redux-form';
import { Box } from 'grid-styled'

import Countries from './countriesList';

import { FormRangedSingleInput, FormCaptcha, FormCheckboxGroup, FormDropdownInput, Button, FormTextArea, FormDropdown, FormInput, FormGroup } from '../Form';

const placeHolder = `Example: I can meet in the Starbucks on Main St,\nin McDonalds on Broad St, or anywhere in the "X" shopping district.\nI can meet anytime between 1-4pm and my minimum trade is 1 XMR.'`;

const acceptTradeOptions = [{
    title: 'Cache in person',
    value: 'personCache',
}, {
    title: 'Cache by mail',
    value: 'mailCache',
}, {
    title: 'Money Order by mail',
    value: 'mailMoneyOrder',
}, {
    title: 'Other',
    value: 'other',
}];

const distanceUnitsOptions = [{
    text: 'Miles',
    value: 'mi',
}, {
    text: 'Kilometers',
    value: 'km',
}];

class PostingsForm extends React.Component {
    render() {
        const { handleSubmit, pristine, submitting } = this.props;

        return (
            <Form onSubmit={handleSubmit}>
                <Box width={1 / 2}>
                    <FormGroup>
                        <FormRangedSingleInput />
                        <FormCheckboxGroup options={acceptTradeOptions} />
                        <Field name="distance" component={FormDropdownInput} options={distanceUnitsOptions} label={'How far will you travel to trade?'} />
                    </FormGroup>
                    <FormGroup label={'Your location'}>
                        <Field name="country" component={FormDropdown} options={Countries} label={'Country'} />
                        <Field name="state" component={FormDropdown} options={Countries} label={'State'} />
                        <Field name="city" component={FormInput} label={'City'} />
                        <Field name="postalCode" component={FormInput} label={'Postal code (required for most countries)'} />
                        <Field name="additionalInfo" component={FormTextArea} label={'Additional information (optional)'} tip={'Up to 3,000 characters'} placeholder={placeHolder} />
                        <Field name="captcha" component={FormCaptcha} />
                    </FormGroup>
                    <Button type="submit" disabled={pristine || submitting} text="Next" />
                </Box>
            </Form>
        )
    }
}

export default reduxForm({
    form: 'postingsForm'
})(PostingsForm);;

