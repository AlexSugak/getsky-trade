import React from 'react';
import { Field, reduxForm, Form } from 'redux-form';
import { Box } from 'grid-styled';

import { FormInput, FormDropdown, Button } from 'components/layout/Form';

const distanceUnits = [
    { text: 'Kilometers', value: 'km' },
    { text: 'Miles', value: 'ml' }
];
const currencies = [
    { text: 'EUR', value: 'EUR' },
    { text: 'USD', value: 'USD' }
];

export default reduxForm({ form: 'userOtherSettingsForm' })(
    class extends React.Component {
        render() {
            const {
                handleSubmit,
                pristine,
                submitting,
            } = this.props;

            return (
                <Form onSubmit={handleSubmit}>
                    <Box width={1 / 2}>
                        <Field
                            name="distanceUnits"
                            component={FormDropdown}
                            options={distanceUnits}
                            label="Distance units" />

                        <Field
                            name="currency"
                            component={FormDropdown}
                            options={currencies}
                            label="Currency" />

                        <Button type="submit" disabled={pristine || submitting} text="Save" primary />
                    </Box>
                </Form>
            )
        }
    });
