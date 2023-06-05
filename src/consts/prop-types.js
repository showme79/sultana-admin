import { BannerStatus, GalleryStatus, MediaStatus, MediaType } from '@showme79/sultana-common';
import { map } from 'lodash-es';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';

import { SortDirection } from './index';

const RightPropType = PropTypes.oneOfType([PropTypes.bool, PropTypes.func]);

const DatePropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.instanceOf(Date),
  PropTypes.instanceOf(DateTime),
]);

const UserShape = {
  id: PropTypes.number,
  username: PropTypes.string.isRequired,
  role: PropTypes.string, // TODO: expand more
  status: PropTypes.string, // TODO: expand more
  createdAt: DatePropType,
  createdBy: PropTypes.number,
  updatedAt: DatePropType,
  updatedBy: PropTypes.number,
};

export const ActionPropType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  visible: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  disabled: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  tooltip: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.string, PropTypes.number, PropTypes.bool]),
  text: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.string, PropTypes.number, PropTypes.bool]),
  color: PropTypes.string,
  context: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.number,
    PropTypes.string,
    PropTypes.func,
  ]),
});

export const ActionsPropType = PropTypes.oneOfType([ActionPropType, PropTypes.arrayOf(ActionPropType), PropTypes.node]);

export const BannerPositionPropType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
});

export const BannerPositionsPropType = PropTypes.arrayOf(BannerPositionPropType);

export const BannerStatusPropType = PropTypes.oneOf(map(BannerStatus));

export const BannerPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
  title: PropTypes.string,
  status: BannerStatusPropType,
  segments: PropTypes.string,
  priority: PropTypes.number,
  position: BannerPositionPropType,
  positionId: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  repeat: PropTypes.string,
});

export const ChildrenPropType = PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]);

export const BannerRightsPropType = PropTypes.shape({
  VIEW: RightPropType.isRequired,
  CREATE: RightPropType.isRequired,
  EDIT: RightPropType.isRequired,
  DELETE: RightPropType.isRequired,
  DELETE_SELECTED: RightPropType.isRequired,
});

export const CategoryRightsPropType = PropTypes.shape({
  VIEW: RightPropType.isRequired,
  CREATE: RightPropType.isRequired,
  EDIT: RightPropType.isRequired,
  DELETE: RightPropType.isRequired,
  DELETE_SELECTED: RightPropType.isRequired,
});

export const MediaStatusPropType = PropTypes.oneOf(map(MediaStatus));

export const MediaTypePropType = PropTypes.oneOf(map(MediaType));

export const MediaPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  status: MediaStatusPropType,
  slug: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  source: PropTypes.string,
  creator: PropTypes.string,
  creationDate: DatePropType,
  width: PropTypes.number,
  height: PropTypes.number,
  length: PropTypes.number,
  size: PropTypes.number,
  type: PropTypes.MediaTypePropType,
  contentType: PropTypes.string,
  downloadUrl: PropTypes.string,
  createdAt: DatePropType,
  createdBy: PropTypes.number,
  updatedAt: DatePropType,
  updatedBy: PropTypes.number,
});

export const GalleryStatusPropType = PropTypes.oneOf(map(GalleryStatus));

export const GalleryPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  status: GalleryStatusPropType,
  slug: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  media: PropTypes.arrayOf(MediaPropType),
});

export const GalleryRightsPropType = PropTypes.shape({
  VIEW: RightPropType.isRequired,
  CREATE: RightPropType.isRequired,
  EDIT: RightPropType.isRequired,
  DELETE: RightPropType.isRequired,
  DELETE_SELECTED: RightPropType.isRequired,
});

export const MediaRightsPropType = PropTypes.shape({
  VIEW: RightPropType.isRequired,
  CREATE: RightPropType.isRequired,
  EDIT: RightPropType.isRequired,
  DELETE: RightPropType.isRequired,
  DELETE_SELECTED: RightPropType.isRequired,
});

export const PollRightsPropType = PropTypes.shape({
  VIEW: RightPropType.isRequired,
  CREATE: RightPropType.isRequired,
  EDIT: RightPropType.isRequired,
  DELETE: RightPropType.isRequired,
  DELETE_SELECTED: RightPropType.isRequired,
});

export const PopupRightsPropType = PropTypes.shape({
  VIEW: RightPropType.isRequired,
  CREATE: RightPropType.isRequired,
  EDIT: RightPropType.isRequired,
  DELETE: RightPropType.isRequired,
  DELETE_SELECTED: RightPropType.isRequired,
});

export const PostRightsPropType = PropTypes.shape({
  VIEW: RightPropType.isRequired,
  CREATE: RightPropType.isRequired,
  UNLOCK: RightPropType.isRequired,
  EDIT: RightPropType.isRequired,
  DELETE: RightPropType.isRequired,
  DELETE_SELECTED: RightPropType.isRequired,
  SET_STATUS: RightPropType.isRequired,
});

export const RangePropType = PropTypes.oneOfType([
  PropTypes.shape({
    offset: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
  }),
]);

export const SortDirectionPropType = PropTypes.oneOf(map(SortDirection, (value) => value));

export const SortPropType = PropTypes.shape({
  key: PropTypes.string.isRequired,
  direction: SortDirectionPropType.isRequired,
});

export const SubscriptionPropType = PropTypes.PropTypes.shape({
  id: PropTypes.string,
  email: PropTypes.string.isRequired,
  status: PropTypes.string,
  createdByUser: PropTypes.shape(UserShape),
  updatedByUser: PropTypes.shape(UserShape),
});

export const SubscriptionRightsPropType = PropTypes.shape({
  VIEW: RightPropType.isRequired,
  CREATE: RightPropType.isRequired,
  EDIT: RightPropType.isRequired,
  DELETE: RightPropType.isRequired,
  DELETE_SELECTED: RightPropType.isRequired,
});

export const SurveyRightsPropType = PropTypes.shape({
  VIEW: RightPropType.isRequired,
  DOWNLOAD: RightPropType.isRequired,
});

export const TagRightsPropType = PropTypes.shape({
  VIEW: RightPropType.isRequired,
  CREATE: RightPropType.isRequired,
  EDIT: RightPropType.isRequired,
  DELETE: RightPropType.isRequired,
  DELETE_SELECTED: RightPropType.isRequired,
});

export const UserProfilePropType = PropTypes.shape({
  // TODO: expand more
});

export const UserRightsPropType = PropTypes.shape({
  VIEW: RightPropType.isRequired,
  CREATE: RightPropType.isRequired,
  EDIT: RightPropType.isRequired,
  DELETE: RightPropType.isRequired,
  DELETE_SELECTED: RightPropType.isRequired,
});

export const UserPropType = PropTypes.shape({
  ...UserShape,
  profile: UserProfilePropType,
  createdByUser: PropTypes.shape(UserShape),
  updatedByUser: PropTypes.shape(UserShape),
});

export const SegmentsInfoPropType = PropTypes.shape({
  segments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      url: PropTypes.string,
      hidden: PropTypes.bool,
    }),
  ),
  Segment: PropTypes.shape({}),
  SegmentText: PropTypes.shape({}),
  segmentGroupItems: PropTypes.arrayOf({
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
  defaultSegment: PropTypes.string,
});
