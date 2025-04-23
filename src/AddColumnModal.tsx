import * as React from 'react';
import Modal from 'react-modal';

import * as Ifc from './interfaces';
import { Select, ItemPredicate, ItemRenderer } from '@blueprintjs/select';
import {
  Button,
  MenuItem,
  FormGroup,
  InputGroup,
  Overlay2,
  Divider,
} from '@blueprintjs/core';
import { Input } from '@blueprintjs/icons';
Modal.setAppElement('#root');

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    width: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export const operations = [
  'Plus',
  'Minus',
  'Multiplied by',
  'Divided by',
  'Derivative w.r.t.',
];
const operationsOptions = operations.map((op) => (
  <option key={op} value={op}>
    {op}
  </option>
));

const AddColumnModal: React.FC<Ifc.IAddColumnModalProps> = ({
  modalIsOpen,
  closeModal,
  columns,
  setColumns,
  formData,
  setFormData,
}) => {
  const handleChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filterColumns = (columns: Ifc.IColumn[], formData: Ifc.IFormData) => {
    return columns.filter((col) => {
      if (formData.columnIndex) {
        return col.index !== formData.columnIndex;
      }
      return true;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Add Column form submitted with:', formData);
    if (formData.columnIndex) {
      setColumns((prev: Ifc.IColumn[]) =>
        prev.map((col) =>
          col.index === formData.columnIndex
            ? {
                columnName: formData.columnName,
                columnType: 'derived',
                columnId: col.columnId,
                index: col.index,
                derivedOptions: {
                  field_1: formData.field_1,
                  operation: formData.operation,
                  field_2: formData.field_2,
                },
              }
            : col,
        ),
      );
    } else {
      setColumns((prev: Ifc.IColumn[]) => {
        const maxDerivedColNumber = prev
          .filter((col) => col.columnId.startsWith('derived_col_'))
          .reduce((max, col) => {
            const num = parseInt(col.columnId.replace('derived_col_', ''), 10);
            return isNaN(num) ? max : Math.max(max, num);
          }, 0);

        return [
          ...prev,
          {
            columnName: formData.columnName,
            columnType: 'derived',
            columnId: `derived_col_${maxDerivedColNumber + 1}`,
            derivedOptions: {
              field_1: formData.field_1,
              operation: formData.operation,
              field_2: formData.field_2,
            },
            index: Math.max(...prev.map((col) => col.index)) + 1,
          },
        ];
      });
    }
    closeModal();
  };

  const renderColumnOption: ItemRenderer<Ifc.IColumn> = (
    item,
    { handleClick, modifiers },
  ) => (
    <MenuItem
      key={item.columnId}
      text={item.columnName}
      onClick={handleClick}
      active={modifiers.active}
    />
  );

  const renderOperationOption: ItemRenderer<string> = (
    item,
    { handleClick, modifiers },
  ) => (
    <MenuItem
      key={item}
      text={item}
      onClick={handleClick}
      active={modifiers.active}
    />
  );

  return (
    <Overlay2 isOpen={modalIsOpen} onClose={(event) => closeModal(event)}>
      <div
        style={{
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '30px',
        }}
      >
        <h3>Add new Derived Column</h3>
        <form onSubmit={handleSubmit}>
          <FormGroup label="Name of new Column" labelFor="columnName">
            <InputGroup
              id="columnName"
              name="columnName"
              value={formData.columnName}
              onChange={handleChange}
              placeholder="Column Name"
            />
          </FormGroup>
          <FormGroup label="First Field" labelFor="field_1">
            <Select<Ifc.IColumn>
              items={filterColumns(columns, formData)}
              itemRenderer={renderColumnOption}
              onItemSelect={(item) =>
                setFormData((prev: Ifc.IFormData) => ({
                  ...prev,
                  field_1: item.columnId,
                }))
              }
            >
              <Button
                text={
                  columns.find((col) => col.columnId === formData.field_1)
                    ?.columnName || 'Select Field 1'
                }
                endIcon="double-caret-vertical"
                fill={true}
              />
            </Select>
          </FormGroup>
          <FormGroup label="Operation" labelFor="operation">
            <Select
              items={operations}
              itemRenderer={renderOperationOption}
              onItemSelect={(item) =>
                setFormData((prev: Ifc.IFormData) => ({
                  ...prev,
                  operation: item,
                }))
              }
            >
              <Button
                text={formData.operation || 'Select Operation'}
                endIcon="double-caret-vertical"
                fill={true}
              />
            </Select>
          </FormGroup>
          <FormGroup label="Second Field" labelFor="field_2">
            <Select
              items={filterColumns(columns, formData)}
              itemRenderer={renderColumnOption}
              onItemSelect={(item) =>
                setFormData((prev: Ifc.IFormData) => ({
                  ...prev,
                  field_2: item.columnId,
                }))
              }
            >
              <Button
                fill={true}
                text={
                  columns.find((col) => col.columnId === formData.field_2)
                    ?.columnName || 'Select Field 2'
                }
                endIcon="double-caret-vertical"
              />
            </Select>
          </FormGroup>
          <Divider style={{ margin: '20px 0' }} />
          <Button
            type="submit"
            text={formData.columnIndex ? 'Apply Changes' : 'Add Column'}
            endIcon="arrow-right"
            intent="success"
            fill={true}
          />
        </form>
      </div>
    </Overlay2>
  );
};

export default AddColumnModal;
