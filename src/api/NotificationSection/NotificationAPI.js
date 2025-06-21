import axios from "axios";
import { API_URL } from "../../../config";

export async function getAllNotifications() {
  try {
    const response = await axios.get(`${API_URL}/notification.php`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    if (error.response?.status === 401) {
      // Clear localStorage and redirect to login
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
    throw error;
  }
}

export async function getSpecificNotifications(id) {
  try {
    const response = await axios.get(`${API_URL}/notification.php`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: {
        SR_NO: id,
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch specific notification:", error);
    if (error.response?.status === 401) {
      // Clear localStorage and redirect to login
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
    throw error;
  }
}

export async function createNotification(title, message, userType = null) {
  try {
    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Message", message);
    if (userType) {
      formData.append("User_Type", userType);
    }

    // Fixed: Changed from axios.get to axios.post
    const response = await axios.post(`${API_URL}/notification.php`, formData, {
      headers: {
        // Remove Content-Type to let browser set it for FormData
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to create notification:", error);
    if (error.response?.status === 401) {
      // Clear localStorage and redirect to login
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
    throw error;
  }
}

export async function updateNotification(
  SR_NO,
  Title,
  Message,
  userType = null
) {
  try {
    const response = await axios.put(
      `${API_URL}/notification.php`,
      {
        SR_NO: SR_NO,
        Title: Title,
        Message: Message,
        User_Type: userType,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to update notification:", error);
    if (error.response?.status === 401) {
      // Clear localStorage and redirect to login
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
    throw error;
  }
}

export async function deleteNotification(id) {
  try {
    const response = await axios.delete(`${API_URL}/notification.php`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: {
        SR_NO: id,
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to delete notification:", error);
    if (error.response?.status === 401) {
      // Clear localStorage and redirect to login
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
    throw error;
  }
}
