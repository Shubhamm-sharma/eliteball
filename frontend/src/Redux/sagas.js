import { all } from "redux-saga/effects";
import { all_screen_mode_saga } from "./ScreenMode/saga";
import { userSaga } from "./Auth/saga";

function* rootSaga() {
  yield all([all_screen_mode_saga(), userSaga()]);
}

export default rootSaga;
