import * as React from 'react';

import { Cell, Column, Table2 } from '@blueprintjs/table';
import { dummyTableData } from './data/dummyData';

const columns = [
  { columnName: 'Time', columnType: 'time', columnId: 'time_col' },
  {
    columnName: 'Cell Density (Cell Count/Litre)',
    columnType: 'data',
    columnId: 'var_col_1',
  },
  { columnName: 'Volume (Litres)', columnType: 'data', columnId: 'var_col_2' },
];

const OpviaTable: React.FC = () => {
  const getSparseRefFromIndexes = (
    rowIndex: number,
    columnIndex: number,
  ): string => `${columnIndex}-${rowIndex}`;

  const cellRenderer = (rowIndex: number, columnIndex: number) => {
    const sparsePosition = getSparseRefFromIndexes(rowIndex, columnIndex);
    const value = dummyTableData[sparsePosition];
    return <Cell>{String(value)}</Cell>;
  };

  const cols = columns.map((column) => (
    <Column
      key={`${column.columnId}`}
      cellRenderer={cellRenderer}
      name={column.columnName}
    />
  ));

  return (
    <Table2 defaultRowHeight={35} numRows={95}>
      {cols}
    </Table2>
  );
};

export default OpviaTable;
