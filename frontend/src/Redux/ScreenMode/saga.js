import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { screenMode } from "./constant";

function* screen_mode_light() {
  yield put({
    type: screenMode.SCREEN_MODE_LIGHT,
  });
}

export function* screen_mode_light_saga() {
  yield takeEvery(screenMode.SCREEN_MODE_LIGHT, screen_mode_light);
}

export function* all_screen_mode_saga() {
  yield all([fork(screen_mode_light_saga)]);
}
