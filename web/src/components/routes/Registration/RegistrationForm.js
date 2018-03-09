import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm, Form } from 'redux-form';
import ReCAPTCHA from 'react-google-recaptcha';
import { register } from './actions';
import { Box } from 'grid-styled';
import { FormInput, FormDropdown, Button, ControlWrapper, ErrorMessage } from '../../layout/Form';
import { required, email, minLength, maxLength, alphaNumeric } from '../../../validation/rules';
import { RE_CAPTCHA_KEY } from '../../../constants';
import moment from 'moment';

const UTC_OFFSET_FROM = -11;
const UTC_OFFSET_TO = 14;

const minLength3 = minLength(3);
const minLength8 = minLength(8);
const maxLength16 = maxLength(16);
const passwordsMatch = (value, allValues) =>
    allValues.password && value !== allValues.password ? 'Passwords does not match' : undefined;

const ReCaptcha = ({ input, meta: { touched, error, warning }, ...props }) => {
    const showError = touched && (error || warning);
    return (
        <ControlWrapper>
            <ReCAPTCHA {...input} {...props} />
            {showError && <ErrorMessage>{ error || warning }</ErrorMessage>}
        </ControlWrapper>
    );
};

class RegistrationForm extends React.Component {

    timezones = [{ text: '', value: '' }];

    componentWillMount () {
        const date = moment();
        for(let i = UTC_OFFSET_FROM; i <= UTC_OFFSET_TO; i++) {
            const timezone = date.utcOffset(i).format('LLL');
            const offset = i >= 0 ? `+${i}` : i;
            this.timezones.push({ text: `GMT ${offset} - ${timezone}`,  value: timezone })
        }
    }

    render() {
        const { handleSubmit, pristine, submitting, registerUser } = this.props;

        return (
            <Form onSubmit={handleSubmit(registerUser)}>
                <Box width={1/2}>
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
                    <Field name="timezone" component={FormDropdown} options={this.timezones} label="Your local time" validate={[required]} />

                    <Field name="recaptcha" component={ReCaptcha} sitekey={RE_CAPTCHA_KEY} validate={[required]} />

                    <Button type="submit" disabled={pristine || submitting} text="Register" />
                </Box>
            </Form>
        )
    }
}

const FormReg = reduxForm({
    form: 'registrationForm'
})(RegistrationForm);

const mapDispatchToProps = dispatch => ({ registerUser: bindActionCreators(register, dispatch) });

export default connect(null, mapDispatchToProps)(FormReg);