import axios from "axios";
import { API_URL } from "../../../config";

export async function getAllCredentials(role = null) {
  try {
    const response = await axios.get(`${API_URL}/Admin/user.php`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: role ? { role } : {},
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch credentials:", error);
    localStorage.clear();
    throw error;
  }
}

export async function AuthLogin(username, password, role, co_ordinator = null) {
  try {
    const formData = new FormData();
    formData.append("Username", username);
    formData.append("Password", password);
    formData.append("Role", role);
    if (co_ordinator) {
      formData.append("Coordinator_username", co_ordinator);
    }

    const response = await axios.post(
      `${API_URL}/Admin/user.php`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    localStorage.clear();
    return error;
  }
}

export async function deleteCredentials(username) {
  try {
    const response = await axios.delete(`${API_URL}/Admin/user.php`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: { Username: username },
    });
    return response;
  } catch (error) {
    console.error("Failed to delete credentials:", error);
    localStorage.clear();
    throw error;
  }
}

export async function updatePassword(username, newPassword) {
  try {
    const response = await axios.put(
      `${API_URL}/Admin/user.php`,
      {
        Username: username,
        NewPassword: newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Failed to update password:", error);
    localStorage.clear();
    throw error;
  }
}
