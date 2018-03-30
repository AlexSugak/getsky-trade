import React from 'react';
import { Field, reduxForm, Form } from 'redux-form';
import moment from 'moment';
import { Box } from 'grid-styled';

import { FormInput, FormDropdown, FormMessage, } from 'components/layout/Form';
import { Button } from 'components/layout/Button';

const UTC_OFFSET_FROM = -11;
const UTC_OFFSET_TO = 14;

export default reduxForm({ form: 'userLocationSettingsForm' })(
    class extends React.Component {
        timeOffsets = [];
        defaultOffset = 0;

        componentWillMount() {
            const date = moment();
            this.defaultOffset = date.utcOffset() / 60

            for (let i = UTC_OFFSET_FROM; i <= UTC_OFFSET_TO; i++) {
                const timeOffset = date.utcOffset(i).format('LLL');
                const offset = i >= 0 ? `+${i}` : i;
                this.timeOffsets.push({ text: `GMT ${offset} - ${timeOffset}`, value: i.toString() })
            }
        }
        render() {
            const {
                handleSubmit,
                pristine,
                submitting,
                submitSucceeded,

                countries,
                showStates,
                states,
            } = this.props;

            return (
                <Form onSubmit={handleSubmit}>
                    <Box width={1 / 2}>
                        {submitSucceeded && <FormMessage>Settings updated</FormMessage>}
                        <Field
                            name="timeOffset"
                            component={FormDropdown}
                            options={this.timeOffsets}
                            defaultValue={this.defaultOffset.toString()}
                            label="Your local time"
                            description="All times will be formatted to your local time" />

                        <Field
                            name="countryCode"
                            component={FormDropdown}
                            options={countries}
                            label="Country" />
                        {showStates
                            && <Field
                                name="stateCode"
                                component={FormDropdown}
                                options={states}
                                label="State" />}

                        <Field
                            name="city"
                            component={FormInput}
                            type="text"
                            label="City"
                            placeholder="City"
                        />

                        <Field
                            name="postalCode"
                            component={FormInput}
                            type="text"
                            label="Postal code"
                            placeholder="Postal code"
                        />

                        <Button type="submit" disabled={pristine || submitting} text="Save" primary />
                    </Box>
                </Form>
            )
        }
    });
