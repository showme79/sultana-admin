import { includes, isArray, isFunction, isObject } from 'lodash-es';
import reducerChain from 'reducer-chain';

import { upperSnakeCase } from './index';

const createActionFn = (id, action, thunk) => {
  if (!action) {
    // in case action item is not defined, we simple pass the
    return () => ({ type: id });
  }
  if (isFunction(action)) {
    // in case action item is a function a redux-thunk function is called by simple calling the method
    // if thunk creator is turned off we call the function and create action payload from the resultant object
    return thunk ? (...args) => action(...args) : (...args) => ({ type: id, ...action(...args) });
  }
  if (isArray(action)) {
    // in case action item is an array, we only take the 1st element (with zero-index)
    // and try to create action again as a thunk handler
    return createActionFn(id, action[0], true);
  }
  if (isObject(action)) {
    // in case action item is an object the action creator fn will pass the object as the action object
    return () => ({ type: id, ...action });
  }
  // no valid action specified
  return () => {
    throw Error('No action mapped!');
  };
};

/**
 * Create action creator functions from an action map.
 * @param  {Object} actionMap   Action map is an object contains action type / action creator pairs. An action creator can be a
 *                              null (falsy) value, an object, a function or a 1-sized array.
 * @param  [String] namespace   Namespace is an optional string which will be used to prefix action type.
 * @return {Object}             A action creator map which contains namespaced action creator functions.
 */
export const createActions = (actionMap, namespace) =>
  Object.keys(actionMap).reduce((result, name) => {
    const action = actionMap[name];
    const id = upperSnakeCase(namespace ? `${namespace}/${name.replace(/\//g, '_')}` : name);
    const fn = createActionFn(id, action, false);
    fn.id = id;

    return { ...result, [name]: fn };
  }, {});

/**
 * Action handler method which takes a simple string or an action creator function as action type,
 * and runs the passed handler method if the given type fits to the handled action type.
 */
export const handleAction = (type, handler) => (state, action) => {
  const usedType = isFunction(type) ? type.id : type;
  const isTypeInArray =
    isArray(type) &&
    includes(
      type.map((typeItem) => (isFunction(typeItem) ? typeItem.id : typeItem)),
      action.type,
    );

  return isTypeInArray || action.type === usedType ? handler(state, action) : state;
};

export const handleActions = (...reducers) =>
  reducerChain(reducers.map((item) => (isArray(item) ? handleAction(item[0], item[1]) : item)));
