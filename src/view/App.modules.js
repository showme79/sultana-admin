import { includes } from 'lodash-es';
import { generatePath } from 'react-router-dom';

import { Role, Route } from 'consts';
import {
  BallotIcon,
  CategoryIcon,
  CollectionsIcon,
  ContactMailIcon,
  DashboardIcon,
  InsertPhotoIcon,
  LabelIcon,
  NotesIcon,
  PeopleIcon,
  PollIcon,
  ReceiptIcon,
  SettingsIcon,
} from 'icons';
import {
  Banners,
  Categories,
  Dashboard,
  Galleries,
  Media,
  Polls,
  Posts,
  Preferences,
  Subscriptions,
  Surveys,
  Tags,
  Users,
} from 'view/pages';

export default [
  {
    id: 'dashboard',
    btnCls: 'id-btn-module-dashboard',
    icon: DashboardIcon,
    text: 'Műszerfal',
    path: Route.home, // no params: route is same as path
    node: Dashboard,
    isAvailable: (/* { user } */) => true,
  },
  {
    id: 'posts',
    btnCls: 'id-btn-module-posts',
    icon: NotesIcon,
    text: 'Bejegyzések',
    route: generatePath(Route.posts),
    path: Route.posts,
    exact: true,
    node: Posts,
    isAvailable: ({ user }) => user && includes(Role.$REGISTERED, user.role),
    badge: (stats) => stats && stats.posts && stats.posts.sync,
  },
  {
    id: 'divider-1',
  },
  {
    id: 'tags',
    btnCls: 'id-btn-module-tags',
    icon: LabelIcon,
    text: 'Tags',
    route: generatePath(Route.tags),
    path: Route.tags,
    exact: true,
    node: Tags,
    isAvailable: ({ user }) => user && includes(Role.$REGISTERED, user.role),
  },
  {
    id: 'categories',
    btnCls: 'id-btn-module-categories',
    icon: CategoryIcon,
    text: 'Kategóriák',
    route: generatePath(Route.categories),
    path: Route.categories,
    exact: true,
    node: Categories,
    isAvailable: ({ user }) => user && includes(Role.$REGISTERED, user.role),
  },
  {
    id: 'banners',
    btnCls: 'id-btn-module-banners',
    icon: ReceiptIcon,
    text: 'Bannerek',
    route: generatePath(Route.banners),
    path: Route.banners,
    exact: true,
    node: Banners,
    isAvailable: ({ user }) => user && includes(Role.$REGISTERED, user.role),
  },
  {
    id: 'divider-2',
  },
  {
    id: 'media',
    btnCls: 'id-btn-module-media',
    icon: InsertPhotoIcon,
    text: 'Médiakezelő',
    route: generatePath(Route.media),
    path: Route.media,
    exact: true,
    node: Media,
    isAvailable: ({ user }) => user && includes(Role.$REGISTERED, user.role),
  },
  {
    id: 'galleries',
    btnCls: 'id-btn-module-galleries',
    icon: CollectionsIcon,
    text: 'Galéria',
    route: generatePath(Route.galleries),
    path: Route.galleries,
    exact: true,
    node: Galleries,
    isAvailable: ({ user }) => user && includes(Role.$REGISTERED, user.role),
  },
  {
    id: 'polls',
    btnCls: 'id-btn-module-polls',
    icon: PollIcon,
    text: 'Szavazások',
    route: generatePath(Route.polls),
    path: Route.polls,
    exact: true,
    node: Polls,
    isAvailable: ({ user }) => user && includes(Role.$REGISTERED, user.role),
  },
  {
    id: 'surveys',
    btnCls: 'id-btn-module-survey',
    icon: BallotIcon,
    text: 'Kérdőívek',
    route: generatePath(Route.surveys),
    path: Route.surveys,
    exact: true,
    node: Surveys,
    isAvailable: ({ user }) => user && includes(Role.$REGISTERED, user.role),
  },
  {
    id: 'divider-3',
  },
  {
    id: 'users',
    btnCls: 'id-btn-module-users',
    icon: PeopleIcon,
    text: 'Felhasználók',
    route: generatePath(Route.users),
    path: Route.users,
    exact: true,
    node: Users,
    isAvailable: ({ user }) => user && includes(Role.$REGISTERED, user.role),
  },
  {
    id: 'subscriptions',
    btnCls: 'id-btn-module-subscriptions',
    icon: ContactMailIcon,
    text: 'Feliratkozások',
    route: generatePath(Route.subscriptions),
    path: Route.subscriptions,
    exact: true,
    node: Subscriptions,
    isAvailable: ({ user }) => user && includes(Role.$REGISTERED, user.role),
  },
  {
    id: 'preferences',
    btnCls: 'id-btn-module-preferences',
    icon: SettingsIcon,
    text: 'Rendszer beállítások',
    route: generatePath(Route.preferences),
    path: Route.preferences,
    exact: true,
    node: Preferences,
    isAvailable: ({ user }) => user && includes(Role.$REGISTERED, user.role),
  },
];
