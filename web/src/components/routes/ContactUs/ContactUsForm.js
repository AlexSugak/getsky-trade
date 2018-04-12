import React from 'react';
import { Field, reduxForm, Form } from 'redux-form';
import { Box, Flex } from 'grid-styled';

import { required, email, maxLength } from 'validation/rules';
import { FormInput, FormTextArea, FormCaptcha } from '../../layout/Form';
import { Button } from 'components/layout/Button';

const r = required(v => v);
const maxLength10K = maxLength(10000);

const ContactUsForm = ({ handleSubmit, pristine, submitting, invalid }) => (
    <Form onSubmit={handleSubmit}>
        <Flex flexDirection="column" flexWrap="wrap" alignItems="center" justifyContent="center">
            <Box w={1} mb={25}>
                <Flex flexDirection="row" flexWrap="wrap" justifyContent="space-between" mx={-2}>
                    <Box width={[1, 1 / 2]} px={2}>
                        <Field name="name" component={FormInput} isRequired validate={[r]} type="text" label="Name" placeholder="Name" />
                    </Box>
                    <Box width={[1, 1 / 2]} px={2}>
                        <Field name="email" component={FormInput} isRequired validate={[r, email]} type="email" label="Email" placeholder="Email" />
                    </Box>
                </Flex>
            </Box>
            <Box w={1} mb={25}>
                <Field name="subject" component={FormInput} type="text" label="Subject" isRequired validate={[r]} placeholder="Type something..." />
            </Box>
            <Box w={1} mb={25}>
                <Field name="message" component={FormTextArea} tip="Up to 10,000 characters" isRequired validate={[r, maxLength10K]} label="Message" placeholder="Message" />
            </Box>
            <Flex justifyContent="center" flexDirection="column">
                <Field name="recaptcha" component={FormCaptcha} validate={[r]} withRef ref={r => { this.recaptchaField = r }} isRequired />
                <Button type="submit" disabled={invalid || pristine || submitting} text="Send Message" primary />
            </Flex>
        </Flex>
    </Form>);

export default reduxForm({
    form: 'contactUsForm'
})(ContactUsForm);
