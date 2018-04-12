import styled from 'styled-components';

const FormLabel = styled.label`
    color: ${props => props.theme.colors.grayBlue};
    display: block;
    margin-bottom: ${ props => props.theme.spaces[1]}px;
    font-size: ${ props => props.theme.fontSizes[0]}px;
`;

export default FormLabel;
