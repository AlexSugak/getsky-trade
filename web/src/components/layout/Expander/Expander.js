import React from 'react';
import PropTypes from 'prop-types'
import styled from 'styled-components';

import Icon, { IconMap } from 'components/layout/Icon';

const ExpanderLabel = styled.a`
    &:hover {
        opacity: 0.5;
        cursor: pointer;
    }
`;

const ExpanderIcon = styled(Icon) `
    vertical-align: bottom;
`;

export default class extends React.Component {
    static propTypes = {
        children: PropTypes.any,
    }
    state = {
        visible: false,
        global: false,
    }
    componentDidMount() {
        document.addEventListener('touchend', this.hideExpander, true)
        document.addEventListener('click', this.hideExpander, true)
    }
    componentWillUnmount() {
        document.removeEventListener('touchend', this.hideExpander, true)
        document.removeEventListener('click', this.hideExpander, true)
    }
    hideExpander = () => {
        this.setState({ ...this.state, visible: false, global: this.state.visible });
    }
    toggleExpander = visible => {
        if (!this.state.global) {
            this.setState({ ...this.state, visible, global: false, });
        }
    }
    render() {
        const { visible } = this.state;

        return (
            <div>
                <ExpanderLabel onClick={() => this.toggleExpander(!visible)}>
                    {this.props.heading}
                    {visible && <ExpanderIcon name={IconMap.AngleUp} />}
                    {!visible && <ExpanderIcon name={IconMap.AngleDown} />}
                </ExpanderLabel>
                {visible && this.props.children}
            </div >);
    }
}
