import axios from "axios";
import { API_URL } from "../../../config";

export async function updateUTM(videoId, utmImageFile) {
  const formData = new FormData();
  formData.append("Video_ID", videoId);

  formData.append("utm_image", utmImageFile);

  try {
    return await axios.post(`${API_URL}/User/utm.php`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    console.error("Failed to upload UTM image:", error);
    if (error.response?.status === 401) {
      localStorage.clear();
      setTimeout(() => window.location.reload(), 2000);
    }
    throw error;
  }
}
