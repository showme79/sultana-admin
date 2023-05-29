export {
  BannerExpiration,
  BannerStatus,
  CategoryStatus,
  GalleryStatus,
  JobStatus,
  MediaResourceType,
  MediaStatus,
  MediaType,
  MsgType,
  PostContentMode,
  PostStatus,
  PostType,
  PriorityMode,
  RealSegment,
  Repeat,
  RepeatTimesInMin,
  Role,
  Segment,
  SortDirection,
  SubscriptionStatus,
  SubscriptionType,
  UserStatus,
  TagStatus,
} from '@showme79/sultana-common';

export const emailAuth = ![0, false, '0', 'false', 'off'].includes(process.env.REACT_APP_EMAIL_AUTH || false);
export const allowGuestRegistration = ![0, false, '0', 'false', 'off'].includes(
  process.env.REACT_APP_ALLOW_GUEST_REGISTRATION || false,
);

export const Route = {
  home: '/',
  banners: '/banner/:id?',
  categories: '/kategoria/:categoryId?',
  galleries: '/gallery/:id?',
  media: '/media/:mediaId?',
  polls: '/szavazasok/:pollId?',
  posts: '/bejegyzes/:postId?',
  preferences: '/rendszer-beallitasok',
  programs: '/program/:programId?',
  subscriptions: '/feliratkozasok/:subscriptionId?',
  surveys: '/kerdoivek/:postId?',
  tags: '/tag/:tagId?',
  users: '/felhasznalok/:userId?',
};

export const ImageWidth = {
  THUMBNAIL: 'THUMBNAIL',
  SELECTOR: 'SELECT',
};

export const ImageWidths = {
  [ImageWidth.THUMBNAIL]: 350,
  [ImageWidth.SELECTOR]: 700,
};

export const fieldProps = {
  fullWidth: true,
  InputLabelProps: { shrink: true },
};

export const rowsPerPageOptions = [75, 150, 300];
export const rowsPerPageOptionsThumbs = [50, 100, 200];

export const Action = {
  ADD: 'ADD',
  APPROVE: 'APPROVE',
  BACK: 'BACK',
  CLOSE: 'CLOSE',
  CREATE: 'CREATE',
  DELETE: 'DELETE',
  DELETE_SELECTED: 'DELETE_SELECTED',
  DOWNLOAD: 'DOWNLOAD',
  EDIT: 'EDIT',
  INSERT: 'INSERT',
  PREVIEW: 'PREVIEW',
  SAVE: 'SAVE',
  SAVE_AND_CONTINUE: 'SAVE_AND_CONTINUE',
  SAVE_AND_READY: 'SAVE_AND_READY',
  SAVE_AND_APPROVE: 'SAVE_AND_APPROVE',
  SELECT: 'SELECT',
  SUBMIT: 'SUBMIT',
  SYNC: 'SYNC',
  UNLOCK: 'UNLOCK',
  UPLOAD: 'UPLOAD',
  VIEW: 'VIEW',
};

export const DISPLAY_DATETIME_FORMAT = 'yyyy.MM.dd HH:mm';
export const DISPLAY_DATE_FORMAT = 'yyyy.MM.dd';
export const DISPLAY_TIME_FORMAT = 'HH:mm';

export const ViewMode = {
  MOBILE: 'MOBILE',
  TABLET: 'TABLET',
  DESKTOP: 'DESKTOP',
};
