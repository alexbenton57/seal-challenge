import * as React from 'react';

import { dummyTableData } from './data/dummyData';
import AddColumnModal from './AddColumnModal';
import OpviaTable from './OpviaTable';
import * as Ifc from './interfaces';
export const numberOfRows = 95;
import {
  Tab,
  Tabs,
  Button,
  MenuItem,
  ContextMenu,
  Menu,
} from '@blueprintjs/core';
import { transformTableData, getAggregateData } from './dataTransforms';
import { Select } from '@blueprintjs/select';
import { ContextMenu2 } from '@blueprintjs/popover2';
import { DeriveColumn } from '@blueprintjs/icons';

const original_columns: Ifc.IColumn[] = [
  { columnName: 'Time', columnType: 'time', columnId: 'time_col', index: 0 },
  {
    columnName: 'Cell Density (Cell Count/Litre)',
    columnType: 'data',
    columnId: 'var_col_1',
    index: 1,
  },
  {
    columnName: 'Volume (Litres)',
    columnType: 'data',
    columnId: 'var_col_2',
    index: 2,
  },
  {
    columnName: 'Volume Change (Litres/hr)',
    columnType: 'derived',
    columnId: 'derived_col_1',
    index: 3,
    derivedOptions: {
      columnName: 'Volume Change (Litres/hr)',
      field_1: 'var_col_2',
      operation: 'Derivative w.r.t.',
      field_2: 'time_col',
    },
  },
];

const initial_aggregates: Ifc.IAggregate[] = [
  {
    type: 'mean',
    index: 0,
  },
];

const formDefaults: Ifc.IFormData = {
  columnName: '',
  field_1: '',
  operation: '',
  field_2: '',
};

const aggregateOptions: string[] = ['min', 'max', 'mean', 'sum', 'count'];

const DataProvider: React.FC = () => {
  // Use state hooks to manage data
  const [columns, setColumns] = React.useState<Ifc.IColumn[]>(original_columns);
  const [isOpen, setIsOpen] = React.useState(false);
  const [aggregates, setAggregates] = React.useState(initial_aggregates);
  const [formData, setFormData] = React.useState<Ifc.IFormData>(formDefaults);

  // Manage table data and aggregate data with state to avoid unecessary re-renders
  const [tableData, setTableData] = React.useState<Ifc.ISparseData>(
    transformTableData(dummyTableData, columns, numberOfRows),
  );
  const [aggregateData, setAggregateData] = React.useState<Ifc.ISparseData>(
    getAggregateData(tableData, columns, aggregates, numberOfRows),
  );

  // Trigger table data and aggregate data updates when columns or aggregates change
  React.useEffect(() => {
    setTableData(transformTableData(dummyTableData, columns, numberOfRows));
  }, [columns]);

  React.useEffect(() => {
    setAggregateData(
      getAggregateData(tableData, columns, aggregates, numberOfRows),
    );
  }, [columns, aggregates]);

  // Define button for adding new derived column
  // On click opens popup modal and sets form to default
  const AddColumnButton = () => (
    <div style={{ display: 'flex-grow', justifyContent: 'center' }}>
      <Button
        name="Add Column"
        icon="add"
        minimal
        title="Add Derived Column"
        style={{
          height: '100%',
          width: '100%',
        }}
        onClick={() => {
          setFormData(formDefaults);
          setIsOpen(true);
        }}
      >
        Add Column
      </Button>
    </div>
  );

  // Define button for adding new aggregate column
  // Onclick opens popover menu with options to add remaining aggregate columns
  const AddAggregateButton = () => (
    <Select<string>
      items={aggregateOptions.filter(
        (agg) => !aggregates.some((a) => a.type === agg),
      )}
      itemRenderer={(item, { handleClick, modifiers }) => (
        <MenuItem
          key={item}
          text={item}
          onClick={(e: React.FormEvent) => {
            setAggregates((prev) => [
              ...prev,
              {
                type: item,
                index: prev.length,
              },
            ]);
          }}
          active={modifiers.active}
        />
      )}
      onItemSelect={() => {
        return;
      }}
    >
      <Button
        endIcon="add"
        style={{
          height: '100%',
          width: '100%',
          cursor: 'pointer',
          position: 'absolute',
          padding: '0',
          left: '2px',
        }}
        minimal
      />
    </Select>
  );

  // Column header renderer
  // Just text if not a derived column, otherwise a context menu with edit and delete options
  // Opens modal with correct form data when edit is clicked
  // Simply deletes column when delete is clicked
  const EditColButton: React.FC<Ifc.IEditColButtonProps> = ({ column }) => {
    if (!column.derivedOptions) {
      return (
        <div
          style={{
            display: 'flex-grow',
            justifyContent: 'center',
            padding: '0 5px',
          }}
        >
          {column.columnName}
        </div>
      );
    } else {
      return (
        <div
          style={{
            display: 'flex-grow',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: '0 5px',
          }}
        >
          <ContextMenu
            content={
              <Menu>
                <MenuItem
                  text="Edit"
                  icon="edit"
                  onClick={() => {
                    setFormData({
                      ...(column.derivedOptions || formDefaults),
                      columnIndex: column.index,
                      columnName: column.columnName,
                    });
                    setIsOpen(true);
                  }}
                />
                <MenuItem
                  text="Delete"
                  icon="delete"
                  onClick={() => {
                    setColumns((prev) =>
                      prev.filter((col) => col.columnId !== column.columnId),
                    );
                  }}
                />
              </Menu>
            }
          >
            {column.columnName}
            <DeriveColumn size={16} style={{ margin: '0 5px' }} />
          </ContextMenu>
        </div>
      );
    }
  };

  // Row header renderer
  // Just text if not an aggregate row, otherwise a context menu with edit and delete options
  // This doesn't work at the moment - Blueprint fails to load popover
  const DeleteRowButton: React.FC<{ aggType: string }> = ({ aggType }) => {
    console.log('aggType', aggType);
    return (
      <ContextMenu2
        content={
          <Menu>
            <MenuItem
              text="Delete"
              icon="delete"
              onClick={() => {
                console.log('delete clicked');
                setAggregates((prev: Ifc.IAggregate[]) =>
                  prev.filter((agg) => agg.type !== aggType),
                );
              }}
            />
          </Menu>
        }
      >
        <div />
      </ContextMenu2>
    );
  };

  // Main app container - two tabs, one with main table, one with aggregates
  // Also contains the modal for adding new/editing columns
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        padding: '75px',
      }}
    >
      <Tabs id="mainTabs" size="large" renderActiveTabPanelOnly={true}>
        <Tab
          id="table"
          title="Table"
          panel={
            <OpviaTable
              columns={columns}
              ColumnButton={AddColumnButton}
              data={tableData}
              numberOfRows={numberOfRows}
              EditColButton={EditColButton}
            />
          }
        />
        <Tab
          id="aggregates"
          title="Aggregates"
          panel={
            <OpviaTable
              columns={columns}
              ColumnButton={AddColumnButton}
              data={aggregateData}
              numberOfRows={aggregates.length}
              RowButton={aggregates.length < 5 ? AddAggregateButton : undefined}
              rowNames={aggregates.map((agg) => agg.type)}
              EditColButton={EditColButton}
              DeleteRowButton={DeleteRowButton}
            />
          }
        />
      </Tabs>

      <AddColumnModal
        modalIsOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        columns={columns}
        setColumns={setColumns}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default DataProvider;
