const defaultScriptCheck = (domain) => {};

/**
 * Limits how often the function passed to it may be called. Optionally takes a
 * callback that will be executed once only after the maximum number of calls
 * has been exceeded
 * @param  {Number}   maxNumCalls   [Max number of calls of `fn` permitted]
 * @param  {Function} fn            [Function whose calls should be limited]
 * @param  {Function} [endCallback] [Callback fired after the max calls exceeded]
 * @return {Function}               [Call-limited function]
 */
export const capCalls = (maxNumCalls, fn, endCallback) => {
  let times = 0;
  let done = false;
  const cb = typeof endCallback === 'function' ? endCallback : () => {};

  return (...args) => {
    if (++times <= maxNumCalls) {
      fn.apply(fn, args);
    } else if (!done) {
      done = true;
      cb();
    }
  };
};

export default class ScriptLoader {
  constructor (src, test, _window = window) {
    this.__src = src || '';
    this.__test = test || defaultScriptCheck;
    this.__window = _window;
    this.__document = _window.document;
  }

  load () {
    const body = this.__document.querySelector('body');
    const script = this.__document.createElement('script');
    script.type = 'text/javascript';
    script.async = false;
    script.src = this.__src;
    body.appendChild(script);

    return this.checkScriptLoaded();
  }

  checkScriptLoaded () {
    return new Promise((resolve, reject) => {
      if (this.__test(this.__window)) {
        return resolve();
      }

      const h = setInterval(
        capCalls(
          10,
          () => {
            if (this.__test(this.__window)) {
              clearInterval(h);
              return resolve();
            }
          },
          () => {
            clearInterval(h);
            reject(new Error(`Timed out waiting for ${this.__src} to load`));
          }
        )
      );
    });
  }
}
