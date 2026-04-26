// reducer.js

import { user } from "./constant";

const initialState = {
  loading: false,
  user: null,
  error: null,
};

export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case user.LOGIN_USER_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case user.LOGIN_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
      };
    case user.LOGIN_USER_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case user.LOGIN_USER_RESET:
      return initialState;
    default:
      return state;
  }
};
