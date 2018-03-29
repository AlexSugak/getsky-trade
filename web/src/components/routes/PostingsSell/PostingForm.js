import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Form, Field, formValueSelector } from 'redux-form';
import { Box } from 'grid-styled'

import { FormRangedSingleInput, FormCheckboxGroup, FormDropdownInput, Button, FormGroup } from 'components/layout/Form';
import { required, min, max, ranged, rangedRequired, rangedMin, rangedMax } from 'validation/rules';
import { SkyAmountWarning, LocationFormGroup, AdditionalInformationSample, ACCEPT_TRADE_OPTIONS, DISTANCE_UNITS_OPTIONS } from 'components/layout/PostingForm';
import FormCoinPriceInput from './FormCoinPriceInput';

const shouldShowStates = currentCountry => currentCountry === 'US' || currentCountry === 'CA';

const RANGED_MIN = 1;
const RANGED_MAX = 999999.99;
const rMin = rangedMin(RANGED_MIN);
const rMax = rangedMax(RANGED_MAX);
const r = required();

const FormPostingToSell = ({ states, countries, country, handleSubmit, submitting, pristine }) => (
    <Form onSubmit={handleSubmit} noValidate>
        <Box width={1 / 2}>
            <FormGroup>
                <Field
                    name="cashAmount"
                    component={FormRangedSingleInput}
                    placeholder={'USD'}
                    label={'What is the amount of cash you will pay in USD?'}
                    isRequired
                    validate={[rangedRequired, ranged, rMin, rMax]}
                    min={RANGED_MIN}
                    max={RANGED_MAX}
                />
                <SkyAmountWarning />
                <Field
                    name="pricePerCoin"
                    component={FormCoinPriceInput}
                    placeholder={'USD'}
                    label={'Price per coin'}
                    isRequired
                    validate={[r]}
                    min={RANGED_MIN}
                    max={RANGED_MAX}
                />
                <Field
                    name="acceptOptions"
                    component={FormCheckboxGroup}
                    options={ACCEPT_TRADE_OPTIONS}
                    label={'Choose the trade options you will accept:'}
                    isRequired
                    validate={[r]}
                />
                <Field
                    type={'number'}
                    name={'distance'}
                    component={FormDropdownInput}
                    options={DISTANCE_UNITS_OPTIONS}
                    label={'How far will you travel to trade?'}
                    isRequired
                    validate={[(required(v => v ? v.data : v)), (min(0, v => v.data)), (max(9999, v => v.data))]}
                />
            </FormGroup>
            <LocationFormGroup states={states} countries={countries} showStates={shouldShowStates(country)} />
            <AdditionalInformationSample />
            <Button type="submit" text="Next" primary />
        </Box>
    </Form>
);

const ReduxForm = reduxForm({
    form: 'formPostingToSell'
})(FormPostingToSell);

const selector = formValueSelector('formPostingToSell');

export default connect(state => ({ country: selector(state, 'country') }))(ReduxForm);
