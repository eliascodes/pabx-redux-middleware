import test from 'ava';
import sinon from 'sinon';
import { createStore, applyMiddleware } from 'redux';
import mockPabx from './mocks/ipc.js';
import * as actions from '../src/actionCreators.js';
import middleware from '../src/middleware.js';


test.cb('Integration | SET_HOST', (t) => {
  t.plan(9);

  let count = 0;
  const host = 'https://foo.com';
  const method = 'IPCortex.PBX.Auth.setHost';
  const reducer = sinon.spy(() => ({}));
  const store = createStore(reducer, {}, applyMiddleware(middleware(mockPabx)));
  const action = actions.setHost(host, {
    requestAction: 'FOO',
    failureAction: 'BAR',
    successAction: 'BAZ'
  });

  store.subscribe(() => {
    const state = store.getState();

    if (count === 0) {
      t.true(mockPabx.PBX.Auth.setHost.notCalled, `${method} should not be called`);
      t.true(reducer.calledTwice, 'Reducer should be called once after init (i.e. twice)');
      t.deepEqual(
        reducer.getCall(1).args[1],
        { type: 'FOO', payload: action },
        'Reducer should be called with action'
      );
      t.deepEqual(state, {}, 'State should be empty');
      count++;

    } else {
      t.true(mockPabx.PBX.Auth.setHost.calledOnce, `${method} should be called once`);
      t.true(mockPabx.PBX.Auth.setHost.calledWith(host), `${method} should be called with ${host}`);
      t.true(reducer.calledThrice, 'Reducer should be called twice after init (i.e. thrice)');
      t.deepEqual(reducer.getCall(2).args[1].type, 'BAZ', 'Reducer should be called with action');
      t.deepEqual(state, {}, 'State should be empty');
      t.end();

    }
  });

  store.dispatch(action);
});


test.cb('Integration | INIT', (t) => {
  t.pass();
  t.end();
});
