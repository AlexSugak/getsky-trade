import React from 'react';
import { connect } from 'react-redux';
import { Box } from 'grid-styled';
import { reduxForm, Form, Field } from 'redux-form';

import { required } from 'validation/rules';
import { AdvertSummary } from 'components/routes/AdvertDetails';
import { BackIcLink } from 'components/layout/Links';
import { H1, B } from 'components/layout/Text';
import { Button, FormCaptcha } from 'components/layout/Form';

import { Warning } from 'components/layout/Alerts';

const r = required()

class FormPreview extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        // Reset captcha after receiving response
        if (prevProps.submitting && prevProps.submitting !== this.props.submitting) {
            const cptCmp = this.recaptchaField.getRenderedComponent();
            cptCmp.resetRecaptcha();
        }
    }

    render() {
        const { handleSubmit, pristine, submitting, countries, states, details } = this.props;

        return (
            <Form handleSubmit={handleSubmit}>
                <AdvertSummary countries={countries} states={states} details={details} />
                <Field name="recaptcha" component={FormCaptcha} validate={[r]} withRef ref={r => { this.recaptchaField = r }} isRequired />
                <Button type="submit" disabled={pristine || submitting} text="Post advert" primary />
            </Form>
        )
    }
};

FormPreview.propTypes = {
    states: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.any.isRequired,
        text: PropTypes.string.isRequired,
    })),
    countries: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.any.isRequired,
        text: PropTypes.string.isRequired,
    })),
};

const ReduxForm = reduxForm({
    form: 'formPreviewPostingToBuy'
})(FormPreview);

export default ReduxForm;
