import { isArray, isPlainObject } from 'lodash-es';

import { CustomCellColumn } from 'view/base/columns';
import { ExTableCell } from 'view/components';

const getValue = (value) => {
  if (isPlainObject(value) || isArray(value)) {
    return JSON.stringify(value);
  }
  if (value === undefined) {
    return '(not set)';
  }
  if (value === null) {
    return '(NULL)';
  }
  return value;
};
const createColumns = () => [
  {
    id: 'name',
    label: 'Név',
    padding: 'none',
  },
  {
    id: 'value',
    label: 'Érték',
    padding: 'none',
    Cell: CustomCellColumn.create(({ value, ...props }) => {
      return <ExTableCell value={getValue(value)} {...props} />;
    }),
  },
];

export default createColumns;
