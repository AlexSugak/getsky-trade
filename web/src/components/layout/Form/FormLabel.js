import styled from 'styled-components';

const FormLabel = styled.label`
    display: block;
    margin-bottom: ${props => props.theme.spaces[0]}px;
    font-size: ${props => props.theme.fontSizes[2]}px;
`;

export default FormLabel;