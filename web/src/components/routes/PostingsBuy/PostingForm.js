import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Form, Field, formValueSelector } from 'redux-form';
import { Box } from 'grid-styled'

import { FormRangedSingleInput, FormCheckboxGroup, FormDropdownInput, Button, FormGroup } from 'components/layout/Form';
import { required, min, max, ranged, rangedRequired, rangedMin, rangedMax } from 'validation/rules';
import { SkyAmountWarning, LocationFormGroup, AdditionalInformationSample, ACCEPT_TRADE_OPTIONS, DISTANCE_UNITS_OPTIONS, } from 'components/layout/PostingForm';

const shouldShowStates = currentCountry => currentCountry === 'US' || currentCountry === 'CA';

const RANGED_MIN = 1;
const RANGED_MAX = 999999;
const rMin = rangedMin(RANGED_MIN);
const rMax = rangedMax(RANGED_MAX);
const r = required();

const FormPostingToBuy = ({ states, countries, country, handleSubmit, submitting, pristine, defaultCountry }) => (
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
                    parse={(v) => ({ ...v, data: parseInt(v.data, 10) })}
                    defaultValue={{ data: '', prefix: DISTANCE_UNITS_OPTIONS[0].value }}
                    label={'How far will you travel to trade?'}
                    isRequired
                    min={0}
                    max={999999}
                    validate={[(required(v => v ? v.data : v)), (min(0, v => v.data)), (max(9999, v => v.data))]}
                />
            </FormGroup>
            <LocationFormGroup states={states} countries={countries} showStates={shouldShowStates(country)} defaultCountry={defaultCountry} />
            <AdditionalInformationSample />
            <Button type="submit" text="Next" primary />
        </Box>
    </Form>
);

const ReduxForm = reduxForm({
    form: 'formPostingToBuy'
})(FormPostingToBuy);

const selector = formValueSelector('formPostingToBuy');

export default connect(state => ({ country: selector(state, 'countryCode') }))(ReduxForm);
