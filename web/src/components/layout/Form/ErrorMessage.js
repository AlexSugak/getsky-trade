import styled from 'styled-components';

const ErrorMessage = styled.p`
    margin-top: ${props => props.theme.spaces[0]}px;
    margin-bottom: ${props => props.theme.spaces[0]}px;
    font-size: ${props => props.theme.fontSizes[1]}px;
    color: ${props => props.theme.colors.red};
`;

export default ErrorMessage;