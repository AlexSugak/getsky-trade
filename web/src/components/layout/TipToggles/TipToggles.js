import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';

import Icon, { IconMap } from 'components/layout/Icon'

const Label = styled.span`
    margin-right: 5px;
`

const cursorPointer = { cursor: 'pointer' };

class TipToggles extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = { expanded: false }
    };

    toggle() {
        this.setState({ ...this.state, expanded: !this.state.expanded })
    };

    render() {
        const { children, label } = this.props;
        const { expanded } = this.state;

        return (
            <Box>
                <Flex style={cursorPointer} onClick={this.toggle}>
                    <Label>{label}</Label>
                    <Icon name={expanded ? IconMap.AngleUp : IconMap.AngleDown} />
                </Flex>
                {expanded &&
                    <Box mt={1}> {children}</Box>
                }
            </Box>
        );
    };
};

TipToggles.propTypes = {
    label: PropTypes.string,
};

export default TipToggles;
