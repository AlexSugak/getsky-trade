import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';
import moment from 'moment';
import keys from 'lodash/keys';
import values from 'lodash/values';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';

import theme from 'components/theme';
import Icon, { IconMap } from 'components/layout/Icon';
import { TableRow, TableCell } from 'components/layout/Table';
import ActionButton from 'components/layout/Button/ActionButton';
import { TRADE_OPTIONS } from 'constants/index';

const DoubleCellTitle = styled.div`
    color: ${props => props.theme.colors.blue};
    font-size: 18px;
    line-height: 26px;
`;

const DoubleCellBody = styled.div``;

const DoubleCell = ({ title, body }) => (
    <Box>
        <DoubleCellTitle>{title}</DoubleCellTitle>
        <DoubleCellBody>{body}</DoubleCellBody>
    </Box>
);

const LinkedTableRow = withRouter(({ ...props, href, history }) => (<TableRow {...props} onClick={() => history.push(href)} />));

const getFullAddress = advert => `${advert.countryCode}, ${advert.city} ${advert.stateCode || ''} ${advert.postalCode || ''}`;

const getPrice = advert => `${advert.amountFrom} ${advert.amountTo ? `- ${advert.amountTo}` : ''} USD`;

const getTradeOptionsText = advert => {
    const advertOptions = pickBy(pick(advert, keys(TRADE_OPTIONS)), item => item);
    return values(pick(TRADE_OPTIONS, keys(advertOptions))).join(', ');
};

export const AdvertRow = ({ data, rowOperations }) => {
    const advert = data;
    return (
        <LinkedTableRow href={`post/${advert.id}`}>
            <TableCell>
                <DoubleCell title={advert.author} body={getFullAddress(advert)} />
            </TableCell>
            <TableCell>
                <DoubleCell title={getPrice(advert)} body={'Nothing'} />
            </TableCell>
            <TableCell>{getTradeOptionsText(advert)}</TableCell>
            <TableCell>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                    {moment(advert.expiredAt).format('DD MMMM YY')}
                    <Icon name={IconMap.CaretRight} color={theme.colors.blue} size={'xs'} />
                </Flex>
            </TableCell>
            {rowOperations && (rowOperations.extendAdvert || rowOperations.deleteAdvert)
                && <TableCell>
                    <ActionButton
                        onClick={e => {
                            e.nativeEvent.stopImmediatePropagation();
                            e.stopPropagation();
                            rowOperations.extendAdvert(advert);
                        }}
                        tip="Extend"
                        icon={<Icon name={IconMap.Clock} />} />
                    <ActionButton
                        onClick={e => {
                            e.nativeEvent.stopImmediatePropagation();
                            e.stopPropagation();
                            rowOperations.editAdvert(advert);
                        }}
                        tip="Edit"
                        icon={<Icon name={IconMap.PencilSquare} />} />
                    <ActionButton
                        isDanger={true}
                        onClick={e => {
                            e.nativeEvent.stopImmediatePropagation();
                            e.stopPropagation();
                            rowOperations.deleteAdvert(advert);
                        }}
                        tip="Delete"
                        icon={<Icon name={IconMap.Trash} />} />
                </TableCell>}
        </LinkedTableRow>
    );
}
