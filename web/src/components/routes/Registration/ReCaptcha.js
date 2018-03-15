import React from 'react';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';

import { ControlWrapper, ErrorMessage } from '../../layout/Form';
import { RE_CAPTCHA_KEY } from '../../../constants';

class ReCaptcha extends React.Component {
	resetRecaptcha() {
		this.reCaptcha.reset();
	}

	render() {
		const { meta: { touched, error, warning }, input } = this.props;
		const showError = touched && (error || warning);
		return (
			<ControlWrapper>
				<ReCAPTCHA ref={cpt => { this.reCaptcha = cpt; }} sitekey={RE_CAPTCHA_KEY} {...input} />
				{showError && <ErrorMessage>{error || warning}</ErrorMessage>}
			</ControlWrapper>
		);
	}
};

export default ReCaptcha;