import { emailAuth } from 'consts';
import { RoleText } from 'lang/hu';
import { CreatedColumn, TextValueColumn, UpdatedColumn } from 'view/base/columns';

const columns = [
  {
    id: 'username',
    label: emailAuth ? 'E-mail cím' : 'Felhasználónév',
    padding: 'none',
  },
  {
    id: 'role',
    label: 'Jogosultság',
    padding: 'none',
    Cell: TextValueColumn(RoleText),
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
