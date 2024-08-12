import React, { createContext, useReducer, useContext } from 'react';

const initialState = {
  votes: {},
  revealed: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'VOTE':
      return {
        ...state,
        votes: {
          ...state.votes,
          [action.payload.userId]: {
            username: action.payload.username,
            vote: action.payload.vote
          }
        }
      };
    case 'CLEAR_VOTES':
      const clearedVotes = Object.fromEntries(
        Object.entries(state.votes).map(([userId, voteObj]) => [
          userId,
          { ...voteObj, vote: null },
        ])
      );
      return { ...state, votes: clearedVotes, revealed: false };
    case 'REVEAL_VOTES':
      return { ...state, revealed: true };
    default:
      return state;
  }
};

const VoteContext = createContext();

export const VoteProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <VoteContext.Provider value={{ state, dispatch }}>
      {children}
    </VoteContext.Provider>
  );
};

export const useVoteContext = () => useContext(VoteContext);
