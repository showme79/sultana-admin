import { handleActions } from 'utils/store';

import Actions from './actions';

const messageMaps = {
  // add message translations here
};

const initState = {
  messages: [],
};

const onAddMessages = (state, { messages }) => ({
  ...state,
  messages: [
    ...state.messages,
    ...messages.map((msg) => ({
      ...msg,
      text: messageMaps[msg.name] || msg.text,
    })),
  ],
});

export default handleActions(
  (state) => state || initState,

  [Actions.addMessages, onAddMessages],
  [Actions.processMessage, (state) => ({ ...state, messages: state.messages.slice(1) })],
  [Actions.clearMessages, (state) => ({ ...state, messages: [] })],
);
