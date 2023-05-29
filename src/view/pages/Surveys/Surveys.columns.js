import { CreatedColumn } from 'view/base/columns';

const columns = [
  {
    id: 'title',
    label: 'Bejegyzés címe',
    padding: 'default',
  },
  {
    id: 'surveyAnswerCount',
    label: 'Kitöltések száma',
    padding: 'default',
  },
  {
    id: 'created',
    label: 'Létrehozva',
    padding: 'default',
    Cell: CreatedColumn,
    sortable: 'createdAt',
  },
];

export default columns;
