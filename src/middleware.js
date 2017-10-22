import { isRPA, validateRPA } from './validation';
import { InvalidRPA } from './errors';
import { selectTypes } from './selectors';
import { ActionTypesSet } from './constants';
import { normaliseHost, loadPabxApi } from './util';
import attachListeners from './listeners';


const noop = () => {};

/**
 * Create a function that accepts action and calls out to
 * IPCortex PABX methods
 * @param  {Object}   ipc IPCortex API object
 * @return {Function}     Function accepting an action
 */
const createCaller = (ipc) => ({ type, payload, ...other }) => {
  const _ipc = ipc;

  switch (type) {
  case ActionTypesSet.INIT:
    return typeof _ipc === 'object'
      ? Promise.resolve()
      : loadPabxApi(normaliseHost(payload));

  case ActionTypesSet.SET_HOST:
    return ipc.PBX.Auth.setHost(normaliseHost(payload));

  case ActionTypesSet.LOGIN:
    return ipc.PBX.Auth.login({ ...payload });

  case ActionTypesSet.LOGOUT:
    return ipc.PBX.Auth.logout();

  case ActionTypesSet.STARTUP:
    return ipc.PBX.startFeed()
      .then(() => {
        const success = ipc.PBX.enableChat(noop)

        if (!success){
          return Promise.reject(new Error('Unable to start chat'));
        }

        if (payload === 'av') {
          ipc.PBX.enableFeature('av', noop, ['chat']);
        }
      });

  case ActionTypesSet.POST:
    return Promise.all(
      ipc.PBX.rooms
        .filter((room) => +room.roomID === +payload.roomID)
        .map((room) => room.post(payload.msg))
    );

  case ActionTypesSet.LEAVE_ROOM:
      const rooms = ipc.PBX.rooms;
      const targets = rooms.filter((room) => +room.roomID === +payload);
      targets.forEach((target) => target.leave());
      return Promise.resolve(payload);

  default:
    return Promise.reject(new TypeError(`Unrecognised action type: ${type}`));
  }
};

const makeDispatchIf = (dispatch) => (action, other) => {
  if (action) {
    dispatch({ ...other, type: action.type || action });
  }
};

/**
 * [description]
 * @access public
 * @param  {Object | null}   [IPC]  IPCortex API object
 * @return {ReduxMiddleware}        Middleware
 */
export default (IPC = null) => ({ dispatch, getState }) => { // eslint-disable-line
  const call = createCaller(IPC);
  const dispatchIf = makeDispatchIf(dispatch);

  attachListeners(IPC, dispatch);

  return (next) => (action) => {
    // Skip actions that do not have CALL_IPCORTEX attribute
    if (! isRPA(action)) {
      return next(action);
    }

    // Validate the action, dispatching an error FSA for invalid RIA
    const validationErrors = validateRPA(action);
    if (validationErrors.length) {
      const { failure } = selectTypes(action);

      return failure
        ? dispatchIf(failure, { payload: new InvalidRPA(validationErrors), error: true })
        : null;
    }

    const { request, success, failure } = selectTypes(action);

    // dispatch request action
    if (request)
      dispatchIf(request, { payload: action });

    // call ipcortex methods
    // dispatch success/fail actions
    try {
      call(action)
        .then((res) => dispatchIf(success, { payload: res }))
        .catch((err) => dispatchIf(failure, { payload: err, error: true }));
    } catch (e) {
      dispatchIf(failure, { payload: e, error: true });
    }
  };
};
