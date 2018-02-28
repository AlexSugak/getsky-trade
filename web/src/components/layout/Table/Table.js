import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Table = styled.table`
    width: 100%;
    margin: 10px 0;
    border-collapse: collapse;
    vertical-align: middle;
`;
const TableHead = styled.thead`
    td, th {
        border-bottom: 3px solid ${props => props.theme.colors.black};
        text-transform: capitalize;
    }
`;
const TableBody = styled.tbody`
    td {
        border-bottom: 1px solid ${props => props.theme.colors.black};
    }
`;
export const TableRow = styled.tr``;
export const TableCell = styled.td`
    padding: 10px 15px;
`;

export default ({ columns, rowComponent: RowComponent, rowData }) => (
    <div className="table-container">
        <Table>
            <TableHead>
                <TableRow>
                    {columns.map((col, i) => <TableCell key={i}>{col.name}</TableCell> )}
                </TableRow>
            </TableHead>
            <TableBody>
                {rowData.map((item, i) => <RowComponent key={i} {...item}/>)}
            </TableBody>
        </Table>
    </div>
);


Table.propTypes = {
    name: PropTypes.string,
};

Table.defaultProps = {
    name: '',
};