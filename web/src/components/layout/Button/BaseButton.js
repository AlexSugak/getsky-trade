import styled from 'styled-components';

const BaseControl = styled.button`
    padding: 8px 26px;
    font-family: ${props => props.theme.fontLight};
    line-height: 22px;
    font-size: ${props => props.theme.fontSizes[1]}px;
    border-width: 1px;

    &:focus {
        outline: none;
    }
    &:hover {
        cursor: pointer;
    }
    &:disabled {
        opacity: 0.5;
    }
`;

export default BaseControl;
