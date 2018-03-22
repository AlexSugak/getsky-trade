import styled from 'styled-components';

const Tip = styled.span`
    font-size: ${props => props.theme.fontSizes[0]}px;
    color: ${props => props.theme.colors.gray};
    display: block;
`;

export default Tip;
