import { createAction } from './util';

export const ActionTypesSet = {
  INIT: createAction('INIT'),
  SET_HOST: createAction('SET_HOST'),
  LOGIN: createAction('LOGIN'),
  LOGOUT: createAction('LOGOUT'),
  START_FEED: createAction('START_FEED'),
  ENABLE_CHAT: createAction('ENABLE_CHAT'),
  ENABLE_FEATURE: createAction('ENABLE_FEATURE'),
  STARTUP: createAction('STARTUP'),
  LEAVE_ROOM: createAction('LEAVE_ROOM'),
  POST: createAction('POST'),
};

export const ListenableActions = {
  ROOM_NEW: createAction('ROOM_NEW'),
  ROOM_UPDATE: createAction('ROOM_UPDATE'),
  ROOM_MESSAGE: createAction('ROOM_MESSAGE'),
  ROOM_MEMBERS: createAction('ROOM_MEMBERS'),
  AV_NEW: createAction('AV_NEW'),
  AV_UPDATE: createAction('AV_UPDATE'),
  AV_MEDIA: createAction('AV_MEDIA'),
}
