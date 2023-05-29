import { CircularProgress } from '@material-ui/core';
import { isNil, mapKeys, mapValues } from 'lodash-es';
import React from 'react';

import { ErrorIcon } from 'icons';
import { BannerStatusText } from 'lang/hu';
import { CreatedColumn, CustomCellColumn, SegmentsColumn, TextValueColumn, UpdatedColumn } from 'view/base/columns';
import { ExTableCell } from 'view/components';

const createColumns = ({ bannerPositionsAsync } = {}) => {
  const { data: { data: { result } = {} } = {}, isPending, error } = bannerPositionsAsync;
  const bannerPositionsMap = mapValues(
    mapKeys(result, ({ id }) => id),
    ({ name }) => name,
  );

  return [
    {
      id: 'name',
      label: 'Elenvezés',
      padding: 'none',
    },
    {
      id: 'status',
      label: 'Állapot',
      padding: 'none',
      Cell: TextValueColumn(BannerStatusText),
    },
    {
      id: 'positionId',
      label: 'Pozíció',
      padding: 'none',
      Cell: CustomCellColumn.create(({ value, ...props }) => {
        const item = bannerPositionsMap[value];
        return (
          <ExTableCell {...props}>
            {isPending && <CircularProgress />}
            {error && <ErrorIcon className="Mui-error" />}
            {isNil(item) ? '-' : <div className="text-value">{item}</div>}
          </ExTableCell>
        );
      }),
    },
    {
      id: 'segments',
      label: 'Fül (szegmens)',
      padding: 'none',
      Cell: SegmentsColumn,
      sortable: false,
    },
    {
      id: 'priority',
      label: 'Sorrend (súly)',
      padding: 'none',
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
};
export default createColumns;
