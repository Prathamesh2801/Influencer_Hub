import axios from "axios";
import { API_URL } from "../../../config";

export async function AuthLogin(username, password) {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    const response = await axios.post(`${API_URL}/Nykaa/log.php`, formData);
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    return error;
  }
}
