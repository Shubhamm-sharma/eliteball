import { screenMode } from "./constant";

const initial_state = {
  type: "",
};

export const screenModeReducer = (state = initial_state, action) => {
  return initial_state;
  // switch (action.type) {
  //   case screenMode.SCREEN_MODE_LIGHT:
  //     return {
  //       type: "light",
  //     };
  //   case screenMode?.SCREEN_MODE_DARK:
  //     return {
  //       type: "",
  //     };
  //   default:
  //     return state;
  // }
};
