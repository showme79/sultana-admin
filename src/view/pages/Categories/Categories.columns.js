import { CategoryWithParentColumn, CreatedColumn, SegmentsColumn, UpdatedColumn } from 'view/base/columns';

const columns = [
  {
    id: 'name',
    label: 'Név',
    Cell: CategoryWithParentColumn,
    padding: 'none',
  },
  {
    id: 'realSequence',
    label: 'Sorrend (súly)',
    padding: 'none',
    sortable: 'realSequence',
  },
  {
    id: 'segments',
    label: 'Szegmensek',
    padding: 'none',
    Cell: SegmentsColumn,
    sortable: false,
  },
  {
    id: 'created',
    label: 'Létrehozva',
    padding: 'none',
    Cell: CreatedColumn,
    sortable: 'createdAt',
  },
  {
    id: 'updated',
    label: 'Módosítva',
    padding: 'none',
    Cell: UpdatedColumn,
    sortable: 'updatedAt',
  },
];

export default columns;
