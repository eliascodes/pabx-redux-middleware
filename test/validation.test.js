import test from 'ava';
import { isRPA, validateRPA } from '../src/validation.js';
import { ActionTypesSet } from '../src/constants.js';


test('isRPA', (t) => {
  t.plan(1);
  t.true(isRPA({ type: ActionTypesSet.SET_HOST }));
});

test('validateRPA', (t) => {
  t.plan(3);

  const action = {
    type: ActionTypesSet.SET_HOST,
    requestAction: 'FOO',
    failureAction: 'BAR',
    successAction: 'BAZ',
  };
  t.deepEqual(validateRPA(action), []);

  const invalidAction_notRPA = {
    type: 'WOO',
    requestAction: 'FOO',
    failureAction: 'BAR',
    successAction: 'BAZ',
  };
  t.deepEqual(
    validateRPA(invalidAction_notRPA),
    [ { message: 'Invalid RPA', action: invalidAction_notRPA } ]
  );

  const invalidAction_missingActions = {
    type: ActionTypesSet.SET_HOST,
  };
  t.deepEqual(
    validateRPA(invalidAction_missingActions),
    [
      { message: 'Action missing property requestAction', action: invalidAction_missingActions },
      { message: 'Action missing property failureAction', action: invalidAction_missingActions },
      { message: 'Action missing property successAction', action: invalidAction_missingActions },
    ]
  );
});
