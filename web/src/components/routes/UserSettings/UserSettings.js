import React from 'react';
import { connect } from 'react-redux';

import Container from 'components/layout/Container';

import LocationForm from './LocationForm';
import OtherSettings from './OtherSettings';

import { saveUserSettings, loadForm } from './actions';

const extractFormValues = (form, names) =>
    (names.reduce((acc, curr) => {
        const extracted = {};
        extracted[curr] = form[curr];
        return { ...acc, ...extracted };
    }, {}));

export default connect(
    ({
        app: { countries, states, userInfo, },
        form: { userLocationSettingsForm, userOtherSettingsForm },
    }) => ({
        userInfo,

        countries,
        states,

        locationForm: userLocationSettingsForm,
        otherSettings: userOtherSettingsForm,
    }),
    {
        saveUserSettings,
        loadForm,
    })(
        class extends React.Component {
            onSubmit = (form) => {
                const {
                    saveUserSettings,
                    userInfo,

                    locationForm,
                    otherSettings,
                } = this.props;

                const locationFormRegisteredValues = ['timeOffset', 'countryCode', 'stateCode', 'city', 'postalCode'];
                const otherSettingsFormRegisteredValues = ['currency', 'distanceUnits'];

                saveUserSettings({
                    ...userInfo,
                    ...extractFormValues(locationForm.values, locationFormRegisteredValues),
                    timeOffset: parseInt(locationForm.values.timeOffset, 10),
                    ...extractFormValues(otherSettings.values, otherSettingsFormRegisteredValues),
                });
            }
            render() {
                const {
                    locationForm,

                    countries,
                    states,

                    userInfo,
                } = this.props;

                return (
                    <Container flex='1 0 auto' flexDirection="column" py={4}>
                        <h2>Your location</h2>
                        <LocationForm
                            enableReinitialize
                            initialValues={userInfo ? { ...userInfo, timeOffset: userInfo.timeOffset.toString() } : {}}
                            userInfo={userInfo || {}}
                            countries={countries}
                            states={states}
                            showStates={locationForm && locationForm.values.countryCode === 'US'}
                            onSubmit={this.onSubmit} />
                        <h2>Other settings</h2>
                        <OtherSettings
                            enableReinitialize
                            initialValues={userInfo ? { ...userInfo, timeOffset: userInfo.timeOffset.toString() } : {}}
                            onSubmit={this.onSubmit} />
                    </Container>
                );
            }
        });
