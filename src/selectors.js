export const selectTypes = (action) => ({
  request: action.requestAction,
  failure: action.failureAction,
  success: action.successAction,
});
