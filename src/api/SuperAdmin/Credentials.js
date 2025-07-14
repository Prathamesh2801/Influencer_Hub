import axios from "axios";
import { API_URL } from "../../../config";

export async function getAllCredentials(role = null, userType = null) {
  try {
    const params = {
      ...(role && { role }),
      ...(userType && { User_Type: userType }),
    };
    const response = await axios.get(`${API_URL}/Admin/user.php`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params,
    });
    // console.log('hii',response)
    return response;
  } catch (error) {
    console.error("Failed to fetch credentials:", error);
    if (error.response.status == 401) {
      localStorage.clear();
      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 5000);
    }
    throw error;
  }
}

export async function AuthLogin(
  username,
  password,
  role,
  co_ordinator = null,
  User_Type = null
) {
  try {
    const formData = new FormData();
    formData.append("Username", username);
    formData.append("Password", password);
    formData.append("Role", role);
    if (co_ordinator) {
      formData.append("Coordinator_username", co_ordinator);
    }
    if (role === "Co-ordinator" || role === "Creator") {
      console.log("hii", User_Type);
      formData.append("User_Type", User_Type);
    }

    const response = await axios.post(`${API_URL}/Admin/user.php`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    if (error.response.status == 401) {
      localStorage.clear();
      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 5000);
    }
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
    // console.log(response.status)
    // localStorage.clear();
    if (error.response.status == 401) {
      localStorage.clear();
      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 5000);
    }
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
    // localStorage.clear();
    if (error.response.status == 401) {
      localStorage.clear();
      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 5000);
    }
    throw error;
  }
}
export async function updateUserType(username, userType, coordinatorUsername) {
  try {
    const response = await axios.put(
      `${API_URL}/Admin/user.php`,
      {
        Username: username,
        User_Type: userType,
        Coordinator_username: coordinatorUsername,
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
    // localStorage.clear();
    if (error.response.status == 401) {
      localStorage.clear();
      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 5000);
    }
    throw error;
  }
}
