import React from 'react';
import { reduxForm, Form } from 'redux-form';

import { RangedSingleInput } from '../Form'

const PostingsForm = (props) => {
    return (
        <Form>
            <RangedSingleInput />
        </Form>
    )
}

export default reduxForm({
    form: 'postingsForm'
})(PostingsForm);;

