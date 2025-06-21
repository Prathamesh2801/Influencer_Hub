import axios from "axios";
import { API_URL } from "../../../config";

export async function getInsightImages(videoId) {
  try {
    const response = await axios.get(`${API_URL}/User/insight.php`, {
      params: {
        Video_ID: videoId,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch insight images:", error);
    if (error.response?.status === 401) {
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
    throw error;
  }
}
