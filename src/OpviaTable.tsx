import * as React from 'react';

import {
  Cell,
  Column,
  Table2,
  ColumnHeaderCell2,
  RowHeaderCell2,
} from '@blueprintjs/table';

import * as Ifc from './interfaces';

const OpviaTable: React.FC<Ifc.IOpviaTableProps> = ({
  columns,
  data,
  numberOfRows,
  ColumnButton,
  RowButton,
  rowNames = [],
  EditColButton,
  DeleteRowButton,
}) => {
  const getSparseRefFromIndexes = (
    rowIndex: number,
    columnIndex: number,
  ): string => `${columnIndex}-${rowIndex}`;

  const cellRenderer = (rowIndex: number, columnIndex: number) => {
    const sparsePosition = getSparseRefFromIndexes(rowIndex, columnIndex);
    const value = data[sparsePosition];
    return (
      <Cell>
        {value == undefined
          ? ''
          : String(typeof value == 'number' ? value.toFixed(2) : value)}
      </Cell>
    );
  };

  var cols = columns.map((column: Ifc.IColumn) => {
    return (
      <Column
        key={`${column.columnId}`}
        cellRenderer={cellRenderer}
        name={column.columnName}
        columnHeaderCellRenderer={() => (
          <ColumnHeaderCell2>
            <EditColButton column={column} />
          </ColumnHeaderCell2>
        )}
      />
    );
  });

  if (ColumnButton) {
    cols = [
      ...cols,
      <Column
        key="add"
        cellRenderer={() => <Cell />} // Empty cell renderer
        name="Add Column"
        columnHeaderCellRenderer={() => (
          <ColumnHeaderCell2>
            <ColumnButton />
          </ColumnHeaderCell2>
        )}
      />,
    ];
  }

  const rowHeaderCellRenderer = (rowIndex: number) => {
    if (rowIndex === numberOfRows && RowButton) {
      return (
        <RowHeaderCell2>
          <RowButton />
        </RowHeaderCell2>
      );
    }

    if (rowNames.length) {
      const name = rowNames[rowIndex]
        .toLowerCase()
        .replace(/\b\w/g, (s) => s.toUpperCase());
      if (!DeleteRowButton) {
        return <RowHeaderCell2 name={name} />;
      } else {
        return (
          <RowHeaderCell2
            style={{ cursor: 'pointer' }}
            name={name}
            index={rowIndex}
            menuRenderer={(i) => (
              <DeleteRowButton aggType={rowNames[rowIndex]} />
            )}
          />
        );
      }
    } else {
      return <RowHeaderCell2 name={`${rowIndex + 1}`} />;
    }
  };

  return (
    <div
      style={{
        height: 'calc(100vh - 150px - 60px)',
        overflow: 'auto',
      }}
      id="opvia-table"
    >
      <Table2
        defaultRowHeight={35}
        numRows={RowButton ? numberOfRows + 1 : numberOfRows}
        enableRowHeader={true}
        rowHeaderCellRenderer={rowHeaderCellRenderer}
        cellRendererDependencies={[data]}
      >
        {cols}
      </Table2>
    </div>
  );
};

export default OpviaTable;
