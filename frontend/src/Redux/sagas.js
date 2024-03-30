import { all } from "redux-saga/effects";
import { all_screen_mode_saga } from "./ScreenMode/saga";

function* rootSaga() {
  yield all([all_screen_mode_saga()]);
}

export default rootSaga;
