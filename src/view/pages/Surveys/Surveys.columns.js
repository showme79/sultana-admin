import { CreatedColumn } from 'view/base/columns';

const columns = [
  {
    id: 'title',
    label: 'Bejegyzés címe',
    padding: 'normal',
  },
  {
    id: 'surveyAnswerCount',
    label: 'Kitöltések száma',
    padding: 'normal',
  },
  {
    id: 'created',
    label: 'Létrehozva',
    padding: 'normal',
    Cell: CreatedColumn,
    sortable: 'createdAt',
  },
];

export default columns;
