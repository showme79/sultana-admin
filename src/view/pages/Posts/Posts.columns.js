/* eslint-disable react/prop-types */
import { Tooltip } from '@material-ui/core';
import React from 'react';

import { PostStatusText } from 'lang/hu';
import { CategoryChip, TagChip } from 'view/base';
import {
  ApprovedColumn,
  CreatedColumn,
  PostTitleColumn,
  SegmentsColumn,
  StatusColumn,
  UpdatedColumn,
} from 'view/base/columns';
import { ExTableCell } from 'view/components';

const CategoriesColumn = ({ value: categories, ...props }) => (
  <ExTableCell {...props}>
    <Tooltip title={categories.map(({ name }) => name).join(', ')} enterDelay={300}>
      <>
        {categories.slice(0, 4).map(({ id, name, color }) => (
          <React.Fragment key={id}>
            <CategoryChip key={id} name={name} color={color} />
            <br />
          </React.Fragment>
        ))}
        {categories.length > 4 ? '…' : ''}
      </>
    </Tooltip>
  </ExTableCell>
);

const TagsColumn = ({ value: tags, ...props }) => (
  <ExTableCell {...props}>
    <Tooltip title={tags.map(({ name }) => name).join(', ')} enterDelay={300}>
      <>
        {tags.slice(0, 4).map(({ id, name, status }) => (
          <React.Fragment key={id}>
            <TagChip status={status} name={name} />
            <br />
          </React.Fragment>
        ))}
        {tags.length > 4 ? '…' : ''}
      </>
    </Tooltip>
  </ExTableCell>
);

const columns = [
  {
    id: 'title',
    label: 'Cím',
    padding: 'none',
    Cell: PostTitleColumn,
  },
  {
    id: 'priority',
    label: 'Sorrend (Top N)',
    padding: 'none',
    sortable: 'priority',
  },
  {
    id: 'segment',
    label: 'Szegmens',
    padding: 'none',
    Cell: SegmentsColumn,
    sortable: false,
  },
  {
    id: 'categories',
    label: 'Kategóriák',
    padding: 'none',
    Cell: CategoriesColumn,
    sortable: false,
  },
  {
    id: 'tags',
    label: 'Tagek',
    padding: 'none',
    Cell: TagsColumn,
    sortable: false,
  },
  {
    id: 'created',
    label: 'Készítve',
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
  {
    id: 'approved',
    label: 'Közzététel',
    padding: 'none',
    Cell: ApprovedColumn,
    sortable: '~approveAt',
  },
  {
    id: 'status',
    label: 'Állapot',
    padding: 'none',
    Cell: StatusColumn(PostStatusText, false),
  },
];

export default columns;
