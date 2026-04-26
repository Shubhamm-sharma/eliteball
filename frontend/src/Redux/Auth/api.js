// api.js
import axios from "axios";
import * as URL from "../../api/apiEndpoint";
import config from "../../api/config";

export const loginApi = async (credentials) => {
  try {
    const response = await axios.post(
      `${config.API_URL}${URL?.SIGN_UP_USER}`,
      credentials
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
