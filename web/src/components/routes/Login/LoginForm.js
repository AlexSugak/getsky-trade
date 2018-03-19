import React from 'react';
import { Field, reduxForm, Form } from 'redux-form';
import { Box } from 'grid-styled';
import { FormInput, Button } from '../../layout/Form';

const LoginForm = props => {
    const { handleSubmit, pristine, submitting } = props;

    return (
        <Form onSubmit={handleSubmit}>
            <Box width={1 / 2}>
                <Field name="userName" component={FormInput} type="text" label="Username" placeholder="Username" />
                <Field name="password" component={FormInput} type="password" label="Password" placeholder="Password" />
            </Box>

            <Button type="submit" disabled={pristine || submitting} text="Login" />
        </Form>
    )
};

export default reduxForm({
    form: 'loginForm'
})(LoginForm);
