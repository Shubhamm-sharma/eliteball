import { user } from "./constant";

export const loginAction = (data) => ({
  type: user.LOGIN_USER,
  payload: data,
});
