import styled from 'styled-components';

const BoldText = styled.span`
    font-size: ${props => props.theme.fontSizes[2]}px;
    font-family: ${props => props.theme.fontBold};
`;

export default BoldText;
