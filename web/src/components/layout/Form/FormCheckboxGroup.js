import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'grid-styled'

import CheckBox from 'components/layout/Checkbox';
import FormLabel from 'components/layout/Form/FormLabel';
import Wrapper from 'components/layout/Form/ControlWrapper';

class FormCheckboxGroup extends React.Component {
    constructor(props) {
        super(props);

        this.check = this.check.bind(this);
        this.state = {
            options: this.props.options.map(o => ({ ...o, checked: false })),
        }
    }

    check(value) {
        const { options } = this.props;

        this.setState({
            ...this.state,
            options: options.map(o => o.value === value ? { ...o, checked: !o.checked } : o)
        })
    }

    render() {
        const { options, label } = this.props;
        return (
            <Wrapper>
                <FormLabel>{label}</FormLabel>
                {options.length > 0 &&
                    options.map(o =>
                        <CheckBox checked={o.checked} onClick={() => this.check(o.value)} labelText={o.title} />
                    )
                }
            </Wrapper>
        );
    }
}

FormCheckboxGroup.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.any.isRequired,
        title: PropTypes.string.isRequired,
    })),
};

FormCheckboxGroup.defaultProps = {
    options: [],
};

export default FormCheckboxGroup;
