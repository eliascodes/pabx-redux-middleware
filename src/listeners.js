import {
  newRoom,
  updateRoom,
  membersRoom,
  messageRoom,
  newAv,
  updateAv,
  mediaAv,
} from './actionCreators';


export default (IPC, dispatch) => {
  const dispatchIf = callIf(dispatch);

  IPC.Types.Room.addListener('new', (room) => dispatchIf(destroyedRoomCheck(room), newRoom));
  IPC.Types.Room.addListener('update', (room) => dispatchIf(destroyedRoomCheck(room), updateRoom));
  IPC.Types.Room.addListener('members', (room) => dispatchIf(destroyedRoomCheck(room), membersRoom));
  IPC.Types.Room.addListener('message', (room) => dispatchIf(destroyedRoomCheck(room), messageRoom));

  IPC.Types.Av.addListener('new', (av) => dispatch(newAv(av)));
  IPC.Types.Av.addListener('update', (av) => dispatch(updateAv(av)));
  IPC.Types.Av.addListener('media', (av) => dispatch(mediaAv(av)));
};

const destroyedRoomCheck = (room) => {
  // Test if the room is already destroyed by:
  // > trying to access properties that don't exist for dead rooms
  try {
    return room.roomID ? room : null;
  } catch (error) {
    console.log('Room dead', error);
    return null;
  }
};

const callIf = (fn) => (val, act) => val ? fn(act(val)) : null;
