import styled from 'styled-components';

const RedCircle = styled.div`
    height: 8px;
    width: 8px;
    background-color: ${props => props.theme.colors.red};
    border-radius: 50%;
    display: inline-block;
`;

export default RedCircle;
