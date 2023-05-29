import { CreatedColumn, DateTimeColumn } from 'view/base/columns';

const columns = [
  {
    id: 'name',
    label: 'Név',
    padding: 'none',
  },
  {
    id: 'startDate',
    label: 'Kezdő dátum',
    padding: 'none',
    Cell: DateTimeColumn,
    sortable: 'startDate',
  },
  {
    id: 'endDate',
    label: 'Záró dátum',
    padding: 'none',
    Cell: DateTimeColumn,
    sortable: 'endDate',
  },
  {
    id: 'created',
    label: 'Létrehozva',
    padding: 'none',
    Cell: CreatedColumn,
    sortable: 'createdAt',
  },
];

export default columns;
