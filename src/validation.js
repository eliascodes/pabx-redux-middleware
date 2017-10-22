import { ActionTypesSet } from './constants';

const isPlainObject = (o) =>
  o !== null
  && typeof o === 'object'
  && ! Array.isArray(o)
;

const isFSA = (action) =>
  isPlainObject(action) && action.hasOwnProperty('type');

export const isRPA = (action) =>
  isFSA(action) && Object.values(ActionTypesSet).includes(action.type);

const isStringOrAction = (a) => typeof a === 'string' || isFSA(a);

export const validateRPA = (action) => {
  if (! isRPA(action)) {
    return [ { message: 'Invalid RPA', action } ];
  }

  return [ 'requestAction', 'failureAction', 'successAction' ]
    .reduce((acc, curr) =>
      (!action.hasOwnProperty(curr)) || isStringOrAction(action[curr])
        ? acc
        : acc.concat({ message: `Action property ${curr} not an FSA`, action })
      , []);
};
