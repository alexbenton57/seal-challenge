import * as Ifc from './interfaces';

// Helper function for nice date formatting
const formatDate = (date: Date) => {
  const dateString: string = `${date.getUTCFullYear()}-${String(
    date.getUTCMonth() + 1,
  ).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')} ${String(
    date.getUTCHours(),
  ).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;

  // Filter bad dates
  if (dateString.includes('NaN')) {
    return '-';
  }
  return dateString;
};

// function to extract and format data from the original data
// Also does the calculations for derived columns
export function transformTableData(
  originalData: Ifc.ISparseData,
  columns: Ifc.IColumn[],
  numberOfRows: number,
) {
  var data: Ifc.ISparseData = {};
  columns.forEach((column: Ifc.IColumn) => {
    switch (column.columnType) {
      case 'time': {
        for (let i = 0; i < numberOfRows; i++) {
          const sparseIndex: string = `${column.index}-${i}`;
          const date = new Date(originalData[sparseIndex]);
          data[sparseIndex] = formatDate(date);
        }
        break;
      }
      case 'data': {
        for (let i = 0; i < numberOfRows; i++) {
          const sparseIndex: string = `${column.index}-${i}`;
          data[sparseIndex] = originalData[sparseIndex];
        }
        break;
      }
      case 'derived': {
        // Check if derivedOptions is defined
        if (!column.derivedOptions) {
          console.error('Derived options are not defined for column:', column);
          return;
        }
        for (let i = 0; i < numberOfRows; i++) {
          const sparseIndex: string = `${column.index}-${i}`;
          const options = column.derivedOptions;

          const column_1 = columns.find(
            (col) => col.columnId === options.field_1,
          );
          const column_2 = columns.find(
            (col) => col.columnId === options.field_2,
          );

          if (!column_1 || !column_2) {
            console.error('Column not found for derived options:', options);
            data[sparseIndex] = NaN; // Set to NaN if columns are not found
            return;
          }

          const value1 = data[`${column_1.index}-${i}`];
          const value2 = data[`${column_2.index}-${i}`];

          switch (options.operation) {
            case 'Plus':
              data[sparseIndex] = Number(value1) + Number(value2);
              break;
            case 'Minus':
              data[sparseIndex] = Number(value1) - Number(value2);
              break;
            case 'Multiplied by':
              data[sparseIndex] = Number(value1) * Number(value2);
              break;
            case 'Divided by':
              data[sparseIndex] = Number(value1) / Number(value2);
              break;

            case 'Derivative w.r.t.':
              if (['data', 'derived'].includes(column_1.columnType)) {
                if (column_2.columnType === 'time') {
                  if (i === 0) {
                    data[sparseIndex] = NaN; // No derivative for the first row
                  } else {
                    const value1d = data[`${column_1.index}-${i - 1}`];
                    const value2d = data[`${column_2.index}-${i - 1}`];

                    // Get times with derivatives by hour
                    const time2 = Math.floor(
                      new Date(value2).getTime() / (1000 * 60 * 60),
                    );
                    const time2d = Math.floor(
                      new Date(value2d).getTime() / (1000 * 60 * 60),
                    );

                    data[sparseIndex] = (
                      (Number(value1) - Number(value1d)) /
                      (Number(time2) - Number(time2d))
                    ).toFixed(2);
                  }
                  break;
                } else {
                  console.error(
                    'Derivative operation is only supported for derivatives w.r.t. time columns.',
                  );
                  return;
                }
              } else {
                console.error(
                  'Derivative operation is only supported derivatives of numerical columns',
                );
                return;
              }

            default:
              break;
          }
        }
      }
    }
  });
  return data;
}

// function to get the aggregate data for the columns
// handles calculations and formatting
export function getAggregateData(
  data: Ifc.ISparseData,
  columns: Ifc.IColumn[],
  aggregates: Ifc.IAggregate[],
  numberOfRows: number,
) {
  var aggData: Ifc.ISparseData = {};
  columns.forEach((column: Ifc.IColumn) => {
    var colData = Array.from({ length: numberOfRows }, (_, r) => {
      try {
        const dataPoint = data[`${column.index}-${r}`];
        return column.columnType === 'time'
          ? new Date(dataPoint).getTime()
          : Number(dataPoint);
      } catch (error) {
        return NaN;
      }
    });

    if (colData.every((x) => typeof x === 'number' || Number.isNaN(x))) {
      colData = colData.filter((x) => !Number.isNaN(x)); // Filter out NaN values
      aggregates.forEach((aggregate: Ifc.IAggregate) => {
        var agg: number | string = NaN;
        switch (aggregate.type) {
          case 'max':
            agg = Math.max(...colData);
            break;
          case 'min':
            agg = Math.min(...colData);
            break;
          case 'mean':
            agg = colData.reduce((a, b) => a + b, 0) / colData.length;
            break;
          case 'sum':
            agg = colData.reduce((a, b) => a + b, 0);
            break;
          case 'count':
            agg = colData.length;
            break;
          default:
            break;
        }

        if (column.columnType === 'time') {
          if (aggregate.type === 'sum') {
            agg = '-';
          } else if (['mean', 'max', 'min'].includes(aggregate.type)) {
            agg = formatDate(new Date(agg));
          }
        }

        aggData[`${column.index}-${aggregate.index}`] =
          typeof agg !== 'number' || aggregate.type === 'count'
            ? agg
            : agg.toFixed(2);
      });
    } else {
      colData.filter((x) => !isNaN(x)); // Filter out NaN values
      aggregates.forEach((aggregate: Ifc.IAggregate) => {
        switch (aggregate.type) {
          case 'count':
            aggData[`${column.index}-${aggregate.index}`] = colData.length;
            break;
          default:
            // Set to "-" for non-numeric aggregates
            aggData[`${column.index}-${aggregate.index}`] = 'string';
            break;
        }
      });
    }
  });

  return aggData;
}
