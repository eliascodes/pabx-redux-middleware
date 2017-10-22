import test from 'ava';
import { normaliseHost, createAction, createActionCreator } from '../src/util.js';


test('normaliseHost | no protocol', (t) => {
  t.is(normaliseHost('foo'), 'https://foo');
});

test('normaliseHost | https protocol', (t) => {
  t.is(normaliseHost('https://foo.com'), 'https://foo.com');
});

test('normaliseHost | http protocol', (t) => {
  t.is(normaliseHost('http://foo'), 'https://foo');
});

test('createAction', (t) => {
  t.is(createAction('SUFFIX'), '@@ipcortex/SUFFIX');
});

test('createActionCreator | no payload creator, no meta creator', (t) => {
  const actionCreator = createActionCreator('FOO');

  t.deepEqual(
    actionCreator(),
    { type: 'FOO' }
  );

  t.deepEqual(
    actionCreator('Hi'),
    { type: 'FOO', payload: 'Hi' }
  );

  t.deepEqual(
    actionCreator('Hi', { bar: 'baz' }),
    { type: 'FOO', payload: 'Hi', bar: 'baz' }
  );

  t.deepEqual(
    actionCreator('Hi', { bar: 'baz' }, 'meta'),
    { type: 'FOO', payload: 'Hi', bar: 'baz' }
  );
});
