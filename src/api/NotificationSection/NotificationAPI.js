import axios from "axios";
import { API_URL } from "../../../config";

export async function getAllNotifications() {
  try {
    const response = await axios.get(`${API_URL}/Nykaa/notification.php`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    throw error;
  }
}

export async function getSpecificNotifications(id) {
  try {
    const response = await axios.get(`${API_URL}/Nykaa/notification.php`, {
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
    throw error;
  }
}

export async function createNotification(title, message) {
  try {
    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Message", message);

    // Fixed: Changed from axios.get to axios.post
    const response = await axios.post(
      `${API_URL}/Nykaa/notification.php`,
      formData,
      {
        headers: {
          // Remove Content-Type to let browser set it for FormData
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Failed to create notification:", error);
    throw error;
  }
}

export async function updateNotification(SR_NO, Title, Message) {
  try {
    const response = await axios.put(
      `${API_URL}/Nykaa/notification.php`,
      {
        SR_NO: SR_NO,
        Title: Title,
        Message: Message,
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
    throw error;
  }
}

export async function deleteNotification(id) {
  try {
    const response = await axios.delete(`${API_URL}/Nykaa/notification.php`, {
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
    throw error;
  }
}