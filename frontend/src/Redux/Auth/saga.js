import {
  all,
  call,
  fork,
  put,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import { user } from "./constant";
import { loginApi } from "./api";

function* loginUser(action) {
  try {
    yield put({ type: user.LOGIN_USER_LOADING });
    const userData = yield call(loginApi, action.payload);

    // Extract token from userData (assuming it's in userData.token, adjust as needed)
    const { token } = userData;
    console.log(userData);
    // Set token in localStorage
    if (userData?.status == 200) {
      sessionStorage.setItem("token", token);
      yield put({ type: user.LOGIN_USER_SUCCESS, payload: userData });
      // yield put({ type: user.LOGIN_USER_RESET });
    } else {
      yield put({ type: user.LOGIN_USER_ERROR });
    }
    // Dispatch success action with user data
  } catch (error) {
    // Dispatch error action if login fails
    yield put({ type: user.LOGIN_USER_ERROR, payload: error.message });
  }
}

export function* loginSaga() {
  yield takeEvery(user.LOGIN_USER, loginUser);
}

export function* userSaga() {
  yield all([loginSaga()]);
}
