import axios from "axios";
import { API_URL } from "../../../config";

export async function getAllTask() {
  try {
    const response = await axios.get(`${API_URL}/Admin/task.php`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("Task fetch : ", response);
    return response;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    if (error.response.status == 401) {
      localStorage.clear();
      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 5000);
    }
    throw error;
  }
}

export async function getSpecificTask(taskID) {
  try {
    const response = await axios.get(`${API_URL}/Admin/task.php`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: {
        Task_ID: taskID,
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    if (error.response.status == 401) {
      localStorage.clear();
      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 5000);
    }
    throw error;
  }
}
