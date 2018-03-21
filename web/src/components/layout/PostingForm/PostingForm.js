import React from 'react';
import { reduxForm, Form, Field } from 'redux-form';

import { FormRangedSingleInput, FormCaptcha, FormCheckboxGroup } from '../Form'

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

class PostingsForm extends React.Component {
    render() {
        return (
            <Form>
                <FormRangedSingleInput />
                <Field name="captcha" component={FormCaptcha} />
                <FormCheckboxGroup options={acceptTradeOptions} />
            </Form>
        )
    }
}

export default reduxForm({
    form: 'postingsForm'
})(PostingsForm);;

