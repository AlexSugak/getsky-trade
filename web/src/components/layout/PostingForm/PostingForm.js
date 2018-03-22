import React from 'react';
import { reduxForm, Form, Field } from 'redux-form';
import { Box } from 'grid-styled'

import { FormRangedSingleInput, FormCaptcha, FormCheckboxGroup, FormDropdownInput, Button } from '../Form'

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
                    <FormRangedSingleInput />
                    <FormCheckboxGroup options={acceptTradeOptions} />
                    <Field name="distance" component={FormDropdownInput} options={distanceUnitsOptions} label={'How far will you travel to trade?'} />
                    <Field name="captcha" component={FormCaptcha} />
                    <Button type="submit" disabled={pristine || submitting} text="Next" />
                </Box>
            </Form>
        )
    }
}

export default reduxForm({
    form: 'postingsForm'
})(PostingsForm);;

