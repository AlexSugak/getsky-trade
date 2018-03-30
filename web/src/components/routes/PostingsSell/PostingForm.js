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

const rData = required(v => v ? v.data : v);
const minData0 = min(0, v => v.data);
const maxData9999 = max(9999, v => v.data);

const FormPostingToSell = ({ states, countries, country, skyPrice, handleSubmit, submitting, pristine }) => (
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
                    skyPrice={skyPrice}
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
                    parse={(v) => ({ ...v, data: v.data ? parseInt(v.data, 10) : '' })}
                    defaultValue={{ data: '', prefix: DISTANCE_UNITS_OPTIONS[0].value }}
                    label={'How far will you travel to trade?'}
                    isRequired
                    min={0}
                    max={9999}
                    validate={[rData, minData0, maxData9999]}
                />
            </FormGroup>
            <LocationFormGroup states={states} countries={countries} showStates={shouldShowStates(country)} />
            <AdditionalInformationSample />
            <Button type="submit" text="Next" primary />
        </Box>
    </Form>
);

export const SellFormName = 'formPostingToSell';

const ReduxForm = reduxForm({
    form: SellFormName,
    destroyOnUnmount: false,
})(FormPostingToSell);

const selector = formValueSelector('formPostingToSell');

export default connect(state => ({ country: selector(state, 'country') }))(ReduxForm);
