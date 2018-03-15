import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Box } from 'grid-styled';
import { FormInput, Button } from '../../layout/Form';

const LoginForm = props => {
    const { handleSubmit, pristine, submitting } = props;

    return (
        <form onSubmit={handleSubmit}>
            <Box width={1/2}>
                <Field name="username" component={FormInput} type="text" label="Username" placeholder="Username" />
                <Field name="password" component={FormInput} type="text" label="Password" placeholder="Password" />
            </Box>

            <div>
                <Button type="submit" disabled={pristine || submitting} text="Login" />
            </div>
        </form>
    )
};

export default reduxForm({
    form: 'loginForm'
})(LoginForm);
