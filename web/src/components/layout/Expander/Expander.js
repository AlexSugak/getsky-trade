import React from 'react';
import PropTypes from 'prop-types'
import styled from 'styled-components';
import { Flex } from 'grid-styled';
import Icon, { IconMap } from 'components/layout/Icon';

const ExpanderLabel = styled(Flex) `
    &:hover {
        opacity: 0.75;
        cursor: pointer;
    }
`;

const TextLabel = styled.span`
    margin-right: 10px;
`;

const hiddenStyle = { display: 'none' };
const visibleStyle = { display: 'block' };

export default class extends React.Component {
    static propTypes = {
        children: PropTypes.any,
        label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
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
                    <TextLabel>{this.props.label}</TextLabel>
                    {visible && <Icon name={IconMap.CaretUp} color={'white'} />}
                    {!visible && <Icon name={IconMap.CaretDown} color={'white'} />}
                </ExpanderLabel>
                <div style={visible ? visibleStyle : hiddenStyle}>
                    {this.props.children}
                </div>
            </div >);
    }
}
