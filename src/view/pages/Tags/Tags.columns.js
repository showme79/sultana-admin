import { TagStatusText } from 'lang/hu';
import { CreatedColumn, SegmentsColumn, StatusColumn } from 'view/base/columns';

const columns = [
  {
    id: 'name',
    label: 'Név',
    padding: 'none',
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
    id: 'status',
    label: 'Állapot',
    padding: 'none',
    Cell: StatusColumn(TagStatusText),
  },
];

export default columns;
