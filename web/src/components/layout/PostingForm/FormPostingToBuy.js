import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Form, Field, formValueSelector } from 'redux-form';
import { Box } from 'grid-styled'

import { FormRangedSingleInput, FormCheckboxGroup, FormDropdownInput, Button, FormGroup } from 'components/layout/Form';
import { required, minLength, maxLength, ranged, rangedRequired, rangedMin, rangedMax } from 'validation/rules';

import XmrAmountWarning from './XmrAmountWarning';
import LocationFormGroup from './LocationFormGroup';
import AdditionalInformationSample from './AdditionalInformationSample';

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

const RANGED_MIN = 1;
const RANGED_MAX = 999999.99;
const ranged1To999999 = ranged(RANGED_MIN, RANGED_MAX);
const rMin = rangedMin(RANGED_MIN);
const rMax = rangedMax(RANGED_MAX);
const min0 = minLength(0);
const max999999 = maxLength(999999);

const FormPostingToBuy = ({ states, countries, country, handleSubmit, submitting, pristine }) => (
    <Form onSubmit={handleSubmit}>
        <Box width={1 / 2}>
            <FormGroup>
                <Field
                    name="cashAmount"
                    component={FormRangedSingleInput}
                    placeholder={'USD'}
                    label={'What is the amount of cash you will pay in USD?'}
                    isRequired
                    validate={[rangedRequired, ranged1To999999, rMin, rMax]}
                    min={RANGED_MIN}
                    max={RANGED_MAX}
                />
                <XmrAmountWarning />
                <Field
                    name="acceptOptions"
                    component={FormCheckboxGroup}
                    options={acceptTradeOptions}
                    label={'Choose the trade options you will accept:'}
                    isRequired
                    validate={[required]}
                />
                <Field
                    type={'number'}
                    name={'distance'}
                    component={FormDropdownInput}
                    options={distanceUnitsOptions}
                    label={'How far will you travel to trade?'}
                    isRequired
                    min={0}
                    max={999999}
                    validate={[required, min0, max999999]}
                />
            </FormGroup>
            <LocationFormGroup states={states} countries={countries} showStates={shouldShowStates(country)} />
            <AdditionalInformationSample />
            <Button type="submit" text="Next" primary />
        </Box>
    </Form>
);

const ReduxForm = reduxForm({
    form: 'formPostingToBuy'
})(FormPostingToBuy);

const selector = formValueSelector('formPostingToBuy');

export default connect(state => ({ country: selector(state, 'country') }))(ReduxForm);
