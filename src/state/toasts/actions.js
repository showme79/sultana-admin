import { createActions } from 'utils/store';

const actions = createActions(
  {
    addMessages: (messages) => ({ messages }),
    processMessage: null,
    clearMessages: null,
  },
  'toasts',
);

export default actions;
