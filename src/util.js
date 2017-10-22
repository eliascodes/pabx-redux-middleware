export const normaliseHost = (host) => {
  const found = host.match(/^https?:\/\/(.+)/);
  return `https://${found ? found[1] : host}`;
};

export const createAction = (suffix) => `@@ipcortex/${suffix}`;

export const createActionCreator = (type, payloadCreator, metaCreator) => {
  const payloadFn = typeof payloadCreator === 'function' ? payloadCreator : (s) => s;
  const metaFn = typeof metaCreator === 'function' ? metaCreator : () => {};

  return (pl, opts, mt) => {
    const action = { type, ...opts };
    const payload = payloadFn(pl);
    const meta = metaFn(mt);

    if (payload) {
      action.payload = payload;
    }

    if (meta) {
      action.meta = meta;
    }

    return action;
  };
};

export const loadPabxApi = (hostname) => {
  if (typeof window === 'object' && typeof window.IPCortex === 'object') {
    return Promise.resolve();
  }


};
