import { ActionTypesSet, ListenableActions } from './constants';
import { createActionCreator } from './util';

export const init = createActionCreator(ActionTypesSet.INIT);
export const setHost = createActionCreator(ActionTypesSet.SET_HOST);
export const login = createActionCreator(ActionTypesSet.LOGIN);
export const logout = createActionCreator(ActionTypesSet.LOGOUT);
export const startup = (opts = {}) => ({
  ...opts,
  type: ActionTypesSet.STARTUP,
});
export const leaveRoom = (roomID, opts = {}) => ({
  ...opts,
  type: ActionTypesSet.LEAVE_ROOM,
  payload: roomID,
});
export const post = (roomID, msg) => ({
  type: ActionTypesSet.POST,
  payload: { roomID, msg },
})

export const newRoom = createActionCreator(ListenableActions.ROOM_NEW);
export const updateRoom = createActionCreator(ListenableActions.ROOM_UPDATE);
export const messageRoom = createActionCreator(ListenableActions.ROOM_MESSAGE);
export const membersRoom = createActionCreator(ListenableActions.ROOM_MEMBERS);
export const newAv = createActionCreator(ListenableActions.AV_NEW);
export const updateAv = createActionCreator(ListenableActions.AV_UPDATE);
export const mediaAv = createActionCreator(ListenableActions.ROOM_NEW);
