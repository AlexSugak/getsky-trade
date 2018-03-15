import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, Form } from 'redux-form';
import moment from 'moment';
import { Box } from 'grid-styled';

import ReCaptcha from './ReCaptcha';
import { FormInput, FormDropdown, Button } from '../../layout/Form';
import { required, email, minLength, maxLength, alphaNumeric } from '../../../validation/rules';
import { register } from './actions';

const UTC_OFFSET_FROM = -11;
const UTC_OFFSET_TO = 14;

const minLength3 = minLength(3);
const minLength8 = minLength(8);
const maxLength16 = maxLength(16);

const passwordsMatch = (value, allValues) => allValues.password && value !== allValues.password ? 'Passwords does not match' : undefined;

class RegistrationForm extends React.Component {
    timeOffsets = [];

    componentWillMount() {
        const date = moment();
        for (let i = UTC_OFFSET_FROM; i <= UTC_OFFSET_TO; i++) {
            const timeOffset = date.utcOffset(i).format('LLL');
            const offset = i >= 0 ? `+${i}` : i;
            this.timeOffsets.push({ text: `GMT ${offset} - ${timeOffset}`, value: i })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // Reset captcha after receiving response
        if (prevProps.requesting && prevProps.requesting !== this.props.requesting && this.props.errors.length > 0) {
            const cptCmp = this.recaptchaField.getRenderedComponent();
            cptCmp.resetRecaptcha();
        }
    }


    render() {
        const { handleSubmit, pristine, submitting, registerUser } = this.props;

        return (
            <Form onSubmit={handleSubmit(registerUser)}>
                <Box width={1 / 2}>
                    <Field
                        name="username"
                        component={FormInput}
                        type="text"
                        label="Username"
                        placeholder="Username"
                        description="3 to 16 characters, only letters and numbers"
                        validate={[required, minLength3, maxLength16, alphaNumeric]}
                    />
                    <Field
                        name="email"
                        component={FormInput}
                        type="text"
                        label="Email"
                        placeholder="Email"
                        description=""
                        validate={[required, email]}
                    />
                    <Field
                        name="password"
                        component={FormInput}
                        type="password"
                        label="Password"
                        placeholder="Password"
                        description="8 characters or more"
                        validate={[required, minLength8]}
                    />
                    <Field
                        name="confirmPassword"
                        component={FormInput}
                        type="password"
                        label="Confirm password"
                        placeholder="Confirm password"
                        validate={[required, passwordsMatch]}
                    />
                    <Field name="timeOffset" component={FormDropdown} options={this.timeOffsets} label="Your local time" validate={[required]} parse={parseInt} />

                    <Field name="recaptcha" component={ReCaptcha} validate={[required]} withRef ref={field => { this.recaptchaField = field }} />

                    <Button type="submit" disabled={pristine || submitting} text="Register" />
                </Box>
            </Form>
        )
    }
}

RegistrationForm.propTypes = {
    requesting: PropTypes.bool.isRequired,
    errors: PropTypes.array.isRequired,
    registerUser: PropTypes.func.isRequired,
};

const mapStateToProps = ({ registration }) => {
    return {
        requesting: registration.requesting,
        errors: registration.errors,
    }
};

const FormReg = reduxForm({
    form: 'registrationForm'
})(RegistrationForm);

export default connect(mapStateToProps, { registerUser: register })(FormReg);