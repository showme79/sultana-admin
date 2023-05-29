import { GalleryStatusText } from 'lang/hu';
import { CreatedColumn, LengthColumn, StatusColumn } from 'view/base/columns';

const columns = [
  {
    id: 'title',
    label: 'Cím',
    padding: 'none',
  },
  {
    id: 'media',
    label: 'Képek (média)',
    padding: 'none',
    sortable: false,
    Cell: LengthColumn,
  },
  {
    id: 'created',
    label: 'Szerző',
    padding: 'none',
    Cell: CreatedColumn,
    sortable: 'createdAt',
  },
  {
    id: 'status',
    label: 'Állapot',
    padding: 'none',
    Cell: StatusColumn(GalleryStatusText),
  },
];

export default columns;
