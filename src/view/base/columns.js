/* eslint-disable react/prop-types */
import { kebabCase, map } from 'lodash-es';
import { DateTime } from 'luxon';
import React from 'react';
import { useSelector } from 'react-redux';

import { useSubscriptionTypes } from 'hooks';
import { AppSelectors } from 'state';
import { getDisplayName, getMediaUrl } from 'utils';

import ExTableCell from '../components/ExTable/ExTableCell';

/**
 * Pattern of column renderer:
 *   - const Column = ({column, columnId, className, item, props, value, itemId, selected, columns, defaultRenderer}) => {...}
 */

const TextValue = ({ texts, value }) => <div className="text-value">{texts[value] || 'N/A'}</div>;

const User = ({ user, showUsername = true, empty = 'N/A' }) => (
  <div className="user-info">{getDisplayName(user, showUsername, empty)}</div>
);

const DateAndTime = ({ date }) => {
  const luxonDate = DateTime.fromISO(date);
  return (
    !luxonDate.invalid && (
      <div className="date-info">
        {luxonDate.toLocaleString(DateTime.DATETIME_MED)}
        <br />({luxonDate.toRelative()})
      </div>
    )
  );
};

const UserAndDate = ({ user, date }) => (
  <>
    <User user={user} />
    <DateAndTime date={date} />
  </>
);

export const SimpleColumn = ({ value, ...props }) => <ExTableCell {...props}>{value}</ExTableCell>;

export const LengthColumn = ({ value, ...props }) => <ExTableCell {...props}>{value.length} elem</ExTableCell>;

export const DateTimeColumn = ({ value: date, ...props }) => (
  <ExTableCell {...props}>
    <DateAndTime date={date} />
  </ExTableCell>
);

export const UserDateColumn = ({ value, item, ...props }) => (
  <ExTableCell item={item} {...props}>
    <UserAndDate user={item.user} date={item.date} />
  </ExTableCell>
);

export const CreatedColumn = ({ value, item: { createdByUser: user, createdAt: date }, ...props }) => (
  <UserDateColumn item={{ user, date }} {...props} />
);

export const UpdatedColumn = ({ value, item: { updatedByUser: user, updatedAt: date }, ...props }) => (
  <UserDateColumn item={{ user, date }} {...props} />
);

export const ApprovedColumn = ({ value, item: { approvedByUser, updatedByUser, approveAt, approvedAt }, ...props }) => (
  <UserDateColumn
    item={{
      user: approvedByUser || updatedByUser,
      date: approvedAt || approveAt,
    }}
    {...props}
  />
);

export const CategoryWithParentColumn = ({ value, item: { name, parentCategory }, ...props }) => (
  <ExTableCell {...props}>
    {name}
    {parentCategory && ` (${parentCategory.name})`}
  </ExTableCell>
);

export const StatusColumn =
  (StatusText, showUserAndName = true) =>
  ({ value: status, item: { updatedByUser, updatedAt }, ...props }) =>
    (
      <ExTableCell {...props}>
        <TextValue texts={StatusText} value={status} />
        {showUserAndName && <UserAndDate user={updatedByUser} date={updatedAt} />}
      </ExTableCell>
    );

export const TextValueColumn =
  (texts) =>
  ({ value, ...props }) =>
    (
      <ExTableCell {...props}>
        <TextValue texts={texts} value={value} />
      </ExTableCell>
    );

export const UserColumn = ({ value: username, className, item: user }) => (
  <ExTableCell className={className}>
    <User user={user} showUsername={false} />
    <div className="user-username">{username}</div>
  </ExTableCell>
);

export const SegmentsColumn = ({ value: segments = '', ...props }) => {
  const { SegmentText } = useSelector(AppSelectors.getSegmentsInfo);
  return (
    <ExTableCell {...props}>
      {map(segments.split(','), (segment) => (
        <div key={segment} className={`segment-${kebabCase(segment)}`}>
          {SegmentText[segment]}
        </div>
      ))}
    </ExTableCell>
  );
};

export const PostTitleColumn = ({ value: title, ...props }) => (
  <ExTableCell {...props}>
    <div className="title-wrapper">
      <div className="title-status" />
      <div className="title-text">{title}</div>
    </div>
  </ExTableCell>
);

export const SubscriptionTypeColumn = ({ value, ...props }) => {
  const { subscriptionTypes } = useSubscriptionTypes();
  const subscriptionType = subscriptionTypes && subscriptionTypes[value];
  return (
    <ExTableCell {...props}>
      <div className="text-value">{subscriptionType?.title || 'N/A'}</div>
    </ExTableCell>
  );
};

export const CustomCellColumn = ({ Cell, ...props }) => <Cell {...props} />;
// convert useAsync(...) operation or simple array of items to a standardized object
CustomCellColumn.create = (Cell) => (props) => CustomCellColumn({ Cell, ...props });

export const MediaColumn = ({ value, item: media, ...props }) => (
  <ExTableCell {...props}>
    <img src={getMediaUrl(media)} alt={media.title} />
  </ExTableCell>
);
