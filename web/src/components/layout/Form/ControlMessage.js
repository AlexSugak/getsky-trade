import styled from 'styled-components';

const ControlMessage = styled.p`
    margin-top: ${props => props.theme.spaces[0]}px;
    margin-bottom: ${props => props.theme.spaces[0]}px;
    font-size: ${props => props.theme.fontSizes[1]}px;
    opacity: 0.7;
`;

export default ControlMessage;