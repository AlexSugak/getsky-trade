import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Form, Field, formValueSelector } from 'redux-form';
import { Box } from 'grid-styled'

import LocationFormGroup from './LocationFormGroup';

import { FormRangedSingleInput, FormCheckboxGroup, FormDropdownInput, Button, FormGroup } from '../Form';

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

const shouldShowStates = currentCountry => currentCountry === 'US' || currentCountry === 'CA';

const FormPostingToBuy = ({ country, handleSubmit, submitting, pristine }) => (
    <Form onSubmit={handleSubmit}>
        <Box width={1 / 2}>
            <FormGroup>
                <FormRangedSingleInput />
                <FormCheckboxGroup options={acceptTradeOptions} />
                <Field name="distance" component={FormDropdownInput} options={distanceUnitsOptions} label={'How far will you travel to trade?'} />
            </FormGroup>
            <LocationFormGroup showStates={shouldShowStates(country)} />
            <Button type="submit" disabled={pristine || submitting} text="Next" primary />
        </Box>
    </Form>
);

const ReduxForm = reduxForm({
    form: 'formPostingToBuy'
})(FormPostingToBuy);

const selector = formValueSelector('formPostingToBuy');

export default connect(state => ({ country: selector(state, 'country') }))(ReduxForm);