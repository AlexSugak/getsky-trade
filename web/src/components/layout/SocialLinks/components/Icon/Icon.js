import styled, { injectGlobal } from 'styled-components';
import findIndex from 'lodash/findIndex';
import PropTypes from 'prop-types';

import iconFont from './ET-Extra.woff';

injectGlobal`
  @font-face {
    font-family: ET-Extra;
    src: url(${iconFont}) format('woff');
    font-weight: normal;
  }
`;

const iconMap = [
    { name: 'facebook', content: '\\e61a' },
    { name: 'twitter', content: '\\e623' },
    { name: 'instagram', content: '\\e60f' },
];

const getIconCode = (name) => {
    const index = findIndex(iconMap, (item) => item.name === name);
    return index >= 0 ? iconMap[index].content : iconMap[0].content;
};

const Icon = styled.i`
    display: block;
    width: 30px;
    height: 30px;
    font-size: 16px;
    line-height: 30px;
    text-align: center;
    transition: .3s ease;
    
    &:before {
        content: '${props => getIconCode(props.name)}';
        font-family: 'ET-Extra' !important ;
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        line-height: inherit !important;
        speak: none;
        transition: .3s ease;
    }
`;

export default Icon;

Icon.propTypes = {
    name: PropTypes.string,
};

Icon.defaultProps = {
    name: '',
};
