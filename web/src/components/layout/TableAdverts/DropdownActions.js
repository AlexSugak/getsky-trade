import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';

import Expander from 'components/layout/Expander';
import Icon, { IconMap } from 'components/layout/Icon';

const ContentContainer = styled.div`
    box-shadow: 0 1px 6px 2px rgba(181,181,181,0.29);
    width: 120px;
    padding-top: 13px;
    padding-bottom: 13px;
    margin-left: -85px;
    background: ${props => props.theme.colors.white};
`;

const Item = styled(Flex) `
    padding: 2px 12px;
    color: ${props => props.theme.colors.black};

    &:hover {
        background-color: ${props => props.theme.colors.lightBlue};
    }
`;

const DropdownActions = ({ advert, operations }) => {
    return (
        <Expander iconName={IconMap.Menu}>
            <ContentContainer>
                <Item
                    alignItems={'center'}
                    onClick={e => {
                        e.nativeEvent.stopImmediatePropagation();
                        e.stopPropagation();
                        operations.extendAdvert(advert);
                    }}
                >
                    <Box mt={'6px'}><Icon name={IconMap.Extend} /></Box>
                    <Box ml={'13px'}>Extend</Box>
                </Item>
                <Item
                    alignItems={'center'}
                    onClick={e => {
                        e.nativeEvent.stopImmediatePropagation();
                        e.stopPropagation();
                        operations.editAdvert(advert);
                    }}
                >
                    <Box mt={'6px'}><Icon name={IconMap.Edit} /></Box>
                    <Box ml={'13px'}>Edit</Box>
                </Item>
                <Item
                    alignItems={'center'}
                    onClick={e => {
                        e.nativeEvent.stopImmediatePropagation();
                        e.stopPropagation();
                        operations.deleteAdvert(advert);
                    }}
                >
                    <Box mt={'6px'}><Icon name={IconMap.Trash} /></Box>
                    <Box ml={'13px'}>Delete</Box>
                </Item>
            </ContentContainer>
        </Expander>
    );
};

DropdownActions.propTypes = {
    advert: PropTypes.object,
    operations: PropTypes.object,
};

export default DropdownActions;
