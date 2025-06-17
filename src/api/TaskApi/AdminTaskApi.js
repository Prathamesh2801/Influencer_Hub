import axios from "axios";
import { API_URL } from "../../../config";
export async function createTask(title, desc, sdate, edata, tvideo) {
  try {
    const formData = new FormData();
    formData.append("Task_Title", title);
    formData.append("Task_Description", desc);
    formData.append("Task_StartDate", sdate);
    formData.append("Task_EndDate", edata);
    formData.append("Total_Video", tvideo);

    // Fixed: Changed from axios.get to axios.post
    const response = await axios.post(`${API_URL}/Admin/task.php`, formData, {
      headers: {
        // Remove Content-Type to let browser set it for FormData
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to create notification:", error);
    localStorage.clear();
    throw error;
  }
}

export async function updateTask(taskId, title, desc, sdate, edate, tvideo) {
  try {
    const payload = {
      Task_ID: taskId,
      Task_Title: title,
      Task_Description: desc,
      Total_Video: tvideo,
      Task_StartDate: sdate,
      Task_EndDate: edate,
    };

    const response = await axios.put(`${API_URL}/Admin/task.php`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data; // Return the response JSON
  } catch (error) {
    console.error("Failed to update task:", error);
    localStorage.clear();
    throw error;
  }
}

export async function deleteTask(taskID) {
  try {
    const response = await axios.delete(`${API_URL}/Admin/task.php`, {
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
    localStorage.clear();
    throw error;
  }
}
