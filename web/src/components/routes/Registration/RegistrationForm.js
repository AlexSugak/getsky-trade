import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, Form } from 'redux-form';
import moment from 'moment';
import { Box } from 'grid-styled';

import { FormInput, FormDropdown, Button, FormCaptcha } from '../../layout/Form';
import { required, email, minLength, maxLength, alphaNumeric } from '../../../validation/rules';

const UTC_OFFSET_FROM = -11;
const UTC_OFFSET_TO = 14;

const minLength3 = minLength(3);
const minLength8 = minLength(8);
const maxLength16 = maxLength(16);

const passwordsMatch = (value, allValues) => allValues.password && value !== allValues.password ? 'Passwords does not match' : undefined;

class RegistrationForm extends React.Component {
    timeOffsets = [];
    defaultOffset = 0;

    componentWillMount() {
        const date = moment();
        this.defaultOffset = date.utcOffset() / 60

        for (let i = UTC_OFFSET_FROM; i <= UTC_OFFSET_TO; i++) {
            const timeOffset = date.utcOffset(i).format('LLL');
            const offset = i >= 0 ? `+${i}` : i;
            this.timeOffsets.push({ text: `GMT ${offset} - ${timeOffset}`, value: i })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // Reset captcha after receiving response
        if (prevProps.submitting && prevProps.submitting !== this.props.submitting) {
            const cptCmp = this.recaptchaField.getRenderedComponent();
            cptCmp.resetRecaptcha();
        }
    }

    render() {
        const { handleSubmit, pristine, submitting } = this.props;
        return (
            <Form onSubmit={handleSubmit}>
                <Box width={1 / 2}>
                    <Field
                        name="userName"
                        component={FormInput}
                        type="text"
                        label="Username"
                        placeholder="Username"
                        description="3 to 16 characters, only letters and numbers"
                        validate={[required, minLength3, maxLength16, alphaNumeric]}
                        isRequired
                    />
                    <Field
                        name="email"
                        component={FormInput}
                        type="text"
                        label="Email"
                        placeholder="Email"
                        description=""
                        validate={[required, email]}
                        isRequired
                    />
                    <Field
                        name="password"
                        component={FormInput}
                        type="password"
                        label="Password"
                        placeholder="Password"
                        description="8 characters or more"
                        validate={[required, minLength8]}
                        isRequired
                    />
                    <Field
                        name="confirmPassword"
                        component={FormInput}
                        type="password"
                        label="Confirm password"
                        placeholder="Confirm password"
                        validate={[required, passwordsMatch]}
                        isRequired
                    />
                    <Field name="timeOffset" component={FormDropdown} options={this.timeOffsets} label="Your local time" validate={[required]} parse={parseInt} defaultValue={this.defaultOffset} isRequired />
                    <Field name="recaptcha" component={FormCaptcha} validate={[required]} withRef ref={r => { this.recaptchaField = r }} isRequired />
                    <Button type="submit" disabled={pristine || submitting} text="Register" primary />
                </Box>
            </Form>
        )
    }
}

RegistrationForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
};

export default reduxForm({
    form: 'registrationForm'
})(RegistrationForm);
