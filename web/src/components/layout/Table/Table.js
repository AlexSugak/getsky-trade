import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    vertical-align: middle;
`;

const TableHead = styled.thead`
    font-family: ${props => props.theme.fontBold};
    font-size: 14px;
    background-color: ${props => props.theme.colors.lightGray};
    color: ${props => props.theme.colors.grayBlue};
    text-transform: capitalize;
`;

const TableRowHead = styled.tr``;

const TableCellHead = styled.th`
    height: 60px;
    padding: 0px 30px;
    text-align: left;
    &:hover {
        background-color: ${props => props.theme.colors.lightGray};
        cursor: default;
    }
`;

const TableBody = styled.tbody``;

export const TableRow = styled.tr`
    &:hover {
        background-color: ${props => props.theme.colors.lightBlue};
        cursor: pointer;
    }
`;

export const TableCell = styled.td`
    padding: 24px 30px;
    line-height: 1.4;
`;

export default ({ columns, rowComponent: RowComponent, rowData, rowOperations }) => (
    <Table>
        <TableHead>
            <TableRowHead>
                {columns.map((col, i) => <TableCellHead key={i}>{col.name}</TableCellHead>)}
                {rowOperations && <TableCellHead></TableCellHead>}
            </TableRowHead>
        </TableHead>
        <TableBody>
            {rowData.map((item, i) => <RowComponent key={i} data={item} rowOperations={rowOperations} />)}
        </TableBody>
    </Table>
);


Table.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired
    })).isRequired,
    rowData: PropTypes.array.isRequired,
    rowOperations: PropTypes.array,
};
