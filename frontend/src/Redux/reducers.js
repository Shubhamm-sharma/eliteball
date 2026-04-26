import { loginReducer } from "./Auth/reducer";
import { screenModeReducer } from "./ScreenMode/reducer";
import { combineReducers } from "redux";

export default combineReducers({
  screenModeReducer,
  loginReducer,
});
