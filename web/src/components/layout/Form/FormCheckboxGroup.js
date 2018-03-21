import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Wrapper from './ControlWrapper';

const CheckBox = styled.input`
  padding: 10;
  position: absolute; 
  opacity: 0; 
  z-index: 1000;
  & + label {
    position: relative;
    cursor: pointer;
    padding: 0;
  }

  & + label:before {
    content: '';
    margin-right: 10px;
    display: inline-block;
    vertical-align: text-top;
    width: 20px;
    height: 20px;
    background: black;
    border-color: black;
    border-width: 3px;
  }

  &:hover + label:before {
    background: black;
  }
  
  &:focus + label:before {
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.12);
  }

  &:checked + label:before {
    background: black;
  }
  
  &:disabled + label {
    color: #b8b8b8;
    cursor: auto;
  }

  &:disabled + label:before {
    box-shadow: none;
    background: #ddd;
  }

  &:checked + label:after {
    content: '';
    position: absolute;
    left: 5px;
    top: 9px;
    background: white;
    width: 2px;
    height: 2px;
    box-shadow: 
      2px 0 0 white,
      4px 0 0 white,
      4px -2px 0 white,
      4px -4px 0 white,
      4px -6px 0 white,
      4px -8px 0 white;
    transform: rotate(45deg);
  }
`;

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
        const { options } = this.props;
        return (
            <div>
                {options.length > 0 &&
                    options.map(o =>
                        <Wrapper>
                            <CheckBox type="checkbox" checked={o.checked} onClick={() => this.check(o.value)} />
                            <label for="styled-checkbox-1">{o.title}</label>
                        </Wrapper>
                    )
                }
            </div>
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
