const sinon = require('sinon');

const rejectOrResolve = (err, data) =>
  err ? Promise.reject(err) : Promise.resolve(data);

const IPC = module.exports = {
  PBX: {
    Auth: {
      id: null,
      name: null,
      uname: null,
      host: null,
      setHost: sinon.spy((host) => {
        IPC.PBX.Auth.host = host;
        return Promise.resolve();
      }),

      login: sinon.spy((credentials) =>
        (! credentials.username) || (! credentials.password)
          ? Promise.reject(new Error('Must pass username and password in options'))
          : rejectOrResolve(IPC._sim.loginErr)
      ),

      logout: sinon.spy(() => rejectOrResolve(IPC._sim.logoutErr)),
    },

    contacts: [],

    startFeed: sinon.spy(() => rejectOrResolve(IPC._sim.startFeedErr)),
    stopFeed: sinon.spy(() => rejectOrResolve(IPC._sim.stopFeedErr)),
    enableChat: sinon.spy((roomCB) => {
      if (roomCB && typeof roomCB === 'function') {
        IPC._listeners.room.new = roomCB;
      }

      return !IPC._sim.enableChatErr;
    }),
    enableFeature: sinon.spy((feature, feedCB, transport) => {
      if (feature !== 'av') {
        throw new Error(`Feature ${feature} not supported`);
      }

      if (feedCB && typeof feedCB === 'function') {
        IPC._listeners.feed.new = feedCB;
      }

      return transport || null;
    }),
    createRoom: sinon.spy((contacts, options, cb) => {
      if (cb && typeof cb === 'function') {
        return cb(!IPC._sim.createRoomErr, 'Reason');
      }

      return rejectOrResolve(IPC._sim.createRoomErr, IPC._objects.room);
    }),
  },
  _listeners: {
    room: {
      new: () => {},
      update: () => {},
      message: () => {},
      members: () => {},
    },
    feed: {
      new: () => {},
      update: () => {},
    }
  },
  _objects: {
    room: {
      addListener: function (evt, cb) {process.nextTick(() => cb(this));},
      roomID: 1,
      cID: '',
      label: '',
      messages: [],
      members: {
        1: {},
        2: {}
      },
      add: () => rejectOrResolve(IPC._sim.addToRoomErr, IPC._objects.room),
    },
    feed: {},
  },
  _sim: {
    loginErr: null,
    logoutErr: null,
    startFeedErr: null,
    stopFeedErr: null,
    enableChatErr: null,
    createRoomErr: null,
    addToRoomErr: null,
    onlineContacts: null,
    setOnlineContacts: (contact_ids) =>
      contact_ids
        .map((c) => ({ cID: c, canChat: IPC._sim.onlineContacts }))
        .forEach((c) => IPC.PBX.contacts.push(c)),
  },
  _reset: () => {
    IPC.PBX.Auth.setHost.reset();
    IPC.PBX.Auth.logout.reset();
    IPC.PBX.Auth.login.reset();
    IPC.PBX.startFeed.reset();
    IPC.PBX.stopFeed.reset();
    IPC.PBX.enableChat.reset();
    IPC.PBX.enableFeature.reset();
    IPC.PBX.createRoom.reset();
  }
};
