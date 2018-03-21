import React from 'react';
import { reduxForm, Form, Field } from 'redux-form';

import { FormRangedSingleInput, FormCaptcha } from '../Form'

class PostingsForm extends React.Component {
    render = () => {
        return (
            <Form>
                <FormRangedSingleInput />
                <Field name="captcha" component={FormCaptcha} />
            </Form>
        )
    }
}

export default reduxForm({
    form: 'postingsForm'
})(PostingsForm);;

