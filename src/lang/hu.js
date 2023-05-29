import {
  BannerStatus,
  CategoryStatus,
  GalleryStatus,
  MediaType,
  PostContentMode,
  PostStatus,
  PriorityMode,
  Repeat,
  Role,
  Segment,
  SubscriptionStatus,
  TagStatus,
  UserStatus,
  ViewMode,
} from 'consts';

export const BannerStatusText = {
  [BannerStatus.ALL]: 'Összes',
  [BannerStatus.ACTIVE]: 'Aktív',
  [BannerStatus.INACTIVE]: 'Inaktív',
};

export const CategoryStatusText = {
  [CategoryStatus.HIDDEN]: 'Nem látható (rejtett)',
  [CategoryStatus.CLOSED]: 'Bezárt (látható)',
  [CategoryStatus.OPENED]: 'Lenyitott (látható)',
};

export const GalleryStatusText = {
  [GalleryStatus.ALL]: 'Összes',
  [GalleryStatus.ACTIVE]: 'Aktív',
  [GalleryStatus.INACTIVE]: 'Inaktív',
};

export const MediaTypeText = {
  [MediaType.AUDIO]: 'Hang',
  [MediaType.VIDEO]: 'Videó',
  [MediaType.IMAGE]: 'Kép',
  [MediaType.OTHER]: 'Egyéb',
};

export const RepeatText = {
  [Repeat.NEVER]: 'Soha (csak egyszer jelenik meg)',
  [Repeat.ALWAYS]: 'Állandóan',
  [Repeat.HOURLY]: 'Óránként',
  [Repeat.DAILY]: 'Naponta',
  [Repeat.WEEKLY]: 'Hetente',
  [Repeat.MONTHLY]: 'Havonta',
  [Repeat.CUSTOM]: 'Egyedi...',
};

export const PostContentModeText = {
  [PostContentMode.WYSIWYG]: 'Tartalomszerkesztő',
  [PostContentMode.HTML]: 'Forráskód',
};

export const PostStatusText = {
  [PostStatus.DRAFT]: 'Vázlat', // the post is under editing
  [PostStatus.READY]: 'Közzétételre vár', // post is ready for approval
  [PostStatus.APPROVE_ON]: 'Ütemezett közzététel', // approval post schedule at a specific time see `apporveOn` field
  [PostStatus.APPROVED]: 'Közzétett', // post can be shown on the portal
  [PostStatus.NOT_APPROVED]: 'Javításra vár', // post is not approved and thrown back by the EDITOR
  [PostStatus.REVOKED]: 'Visszavonva', // the must not shown anymore on the portal
};

export const PriorityModeText = {
  [PriorityMode.REORDER]: 'NORMÁL, régieket letolja',
  [PriorityMode.OVERWRITE]: 'NORMÁL, régit felülírja',
  [PriorityMode.STICKY_REORDER]: 'RAGADÓS, régieket letolja',
  [PriorityMode.STICKY_OVERWRITE]: 'RAGADÓS, régit felülírja',
};

export const RoleText = {
  [Role.GUEST]: 'Vendég',
  [Role.USER]: 'Felhasználó',
  [Role.WRITER]: 'Cikk író',
  [Role.EDITOR]: 'Szerkesztő',
  [Role.SUPER]: 'Főszerkesztő',
  [Role.ADMIN]: 'Adminisztrátor',
  [Role.TECH]: 'Technikai felhasználó',
};

export const SegmentText = {
  [Segment.$GENERIC]: 'Általános',
  [Segment.ALL]: 'Összes fül',
  [Segment.FAMILY]: 'Család',
  [Segment.PROJECT]: 'Kampány',
  [Segment.SUBSIDY]: 'Támogatások',
};

export const SubscriptionStatusText = {
  [SubscriptionStatus.ACTIVE]: 'Aktív',
  [SubscriptionStatus.INACTIVE]: 'Inaktív',
  [SubscriptionStatus.DISABLED]: 'Letiltva',
};

export const TagStatusText = {
  [TagStatus.NOT_APPROVED]: 'Nem közzétett',
  [TagStatus.APPROVED]: 'Közzétett',
};

export const ToastMessages = {
  'post.lock.unallowed':
    'A bejegyzés (#{0}) jelenleg más felhasználóhoz van hozzárendelve, így csak olvasásra lehet megnyitni!',
  'post.save.success': 'A bejegyzés mentése sikeres.',
  'tag.save.success': 'A cimke mentése sikeres.',
  'category.save.success': 'A kategória mentése sikeres.',
};

export const UserStatusText = {
  [UserStatus.NEW]: 'Új',
  [UserStatus.ACTIVE]: 'Aktív',
  [UserStatus.INACTIVE]: 'Inaktív',
  [UserStatus.DELETED]: 'Törölt',
};

export const ViewModeText = {
  [ViewMode.MOBILE]: 'Mobil',
  [ViewMode.TABLET]: 'Tablet',
  [ViewMode.DESKTOP]: 'Desktop',
};
