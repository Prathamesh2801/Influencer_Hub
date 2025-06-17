import axios from "axios";
import { API_URL } from "../../../config";

export async function fetchAllReels(fcmtoken = null, Task_ID = null) {
  try {
    const response = await axios.get(`${API_URL}/getVideos.php`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: {
        fcm_token: fcmtoken,
        Task_ID: Task_ID,
      },
    });
    console.log("Reels fetched successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Failed to fetch reels:", error);
    // localStorage.clear();
    throw error;
  }
}
