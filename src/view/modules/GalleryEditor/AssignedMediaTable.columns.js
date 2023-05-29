import { MediaColumn } from 'view/base/columns';

const columns = [
  {
    id: 'media',
    label: 'Kép',
    padding: 'none',
    Cell: MediaColumn,
    sortable: false,
  },
  {
    id: 'title',
    label: 'Cím',
    padding: 'none',
    sortable: false,
  },
  {
    id: 'description',
    label: 'Leírás',
    padding: 'none',
    sortable: false,
  },
];

export default columns;
