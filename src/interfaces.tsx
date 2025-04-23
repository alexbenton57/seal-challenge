import { dummyTableData } from './data/dummyData';
import * as React from 'react';

export interface IColumn {
  columnName: string;
  columnType: string;
  columnId: string;
  index: number;
  derivedOptions?: undefined | IFormData;
}

export interface ISparseData {
  [key: string]: string | number;
}

export interface IOpviaTableProps {
  columns: IColumn[];
  indexColumn?: string[] | number[];
  ColumnButton?: React.FC;
  RowButton?: React.FC;
  EditColButton: React.FC<IEditColButtonProps>;
  DeleteRowButton?: React.FC<{ aggType: string }>;
  data: ISparseData;
  numberOfRows: number;
  rowNames?: string[];
}

export interface IAddColumnModalProps {
  modalIsOpen: boolean;
  closeModal: Function;
  columns: IColumn[];
  setColumns: Function;
  formData: IFormData;
  setFormData: Function;
}

export interface IFormData {
  columnIndex?: number;
  columnName: string;
  field_1: string;
  operation: string;
  field_2: string;
}

export interface IAggregate {
  type: string;
  index: number;
}

export interface IEditColButtonProps {
  column: IColumn;
}
