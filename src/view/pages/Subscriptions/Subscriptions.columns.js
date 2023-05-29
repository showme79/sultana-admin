import { SubscriptionStatusText } from 'lang/hu';
import { CreatedColumn, StatusColumn, SubscriptionTypeColumn, UserColumn } from 'view/base/columns';

const columns = [
  {
    id: 'id',
    label: 'Azonosító',
    Cell: UserColumn,
    padding: 'none',
  },
  {
    id: 'email',
    label: 'E-mail cím',
    Cell: UserColumn,
    padding: 'none',
  },
  {
    id: 'type',
    label: 'Típus',
    padding: 'none',
    Cell: SubscriptionTypeColumn,
  },
  {
    id: 'status',
    label: 'Állapot',
    padding: 'none',
    Cell: StatusColumn(SubscriptionStatusText),
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
