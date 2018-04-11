import styled from 'styled-components';
import { Tab as UnstyledTab, Tabs, TabList as UnstyledTabList, TabPanel } from 'react-tabs';

const LeftTabName = 'react-tabs-0';
const isLeftTab = props => props.id === LeftTabName;

const TabList = styled(UnstyledTabList) `
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: ${props => props.theme.introTabsHeight}px;
    margin-top: -${props => props.theme.introTabsHeight}px;
`;

const Tab = styled(UnstyledTab) `
    display: flex;
    flex-direction: column;
    justify-content: center;
    outline: none;
    height: ${props => props.theme.introTabsHeight}px;
    width: 100%;
    background-color: ${props => props.selected ? props.theme.colors.white : 'transparent'};
    color: ${props => props.selected ? props.theme.colors.black : props.theme.colors.mint};
    font-size: ${props => props.theme.fontSizes[1]}px;
    font-family: ${props => props.theme.fontBold};
    line-height: 32px;
    letter-spacing: 1px;
    text-align: center;
    cursor: pointer;

    margin-left: ${props => isLeftTab(props) ? '-30px' : '0px'};
    margin-right: ${props => isLeftTab(props) ? '0px' : '-30px'};

    transform: ${props => isLeftTab(props) ? 'skew(30deg)' : 'skew(-30deg)'};
    -webkit-transform:${props => isLeftTab(props) ? 'skew(30deg)' : 'skew(-30deg)'};
    -moz-transform:${props => isLeftTab(props) ? 'skew(30deg)' : 'skew(-30deg)'};
    -o-transform:${props => isLeftTab(props) ? 'skew(30deg)' : 'skew(-30deg)'};

    strong {
        display: block;
        font-size: ${props => props.theme.fontSizes[4]}px;
        margin-top: ${props => props.theme.spaces[0]}px;
        transform: ${props => isLeftTab(props) ? 'skew(-30deg)' : 'skew(30deg)'};
        -webkit-transform: ${props => isLeftTab(props) ? 'skew(-30deg)' : 'skew(30deg)'};
        -moz-transform: ${props => isLeftTab(props) ? 'skew(-30deg)' : 'skew(30deg)'};
        -o-transform: ${props => isLeftTab(props) ? 'skew(-30deg)' : 'skew(30deg)'};
    }

    &:hover {
        background-color: ${props => props.selected ? props.theme.colors.white : 'rgba(255, 255, 255, 0.1)'};
    }
`;

TabList.tabsRole = 'TabList';
Tab.tabsRole = 'Tab';

export { Tabs, TabPanel, Tab, TabList };
