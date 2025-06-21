import axios from "axios";
import { API_URL } from "../../../config";

export async function uploadInsightImages(
  videoId,
  image1 = null,
  image2 = null,
  image3 = null
) {
  try {
    const formData = new FormData();
    formData.append("Video_ID", videoId);
    if (image1) formData.append("image1", image1);
    if (image2) formData.append("image2", image2);
    if (image3) formData.append("image3", image3);

    const response = await axios.post(`${API_URL}/User/insight.php`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to upload insight images:", error);
    if (error.response?.status === 401) {
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
    throw error;
  }
}
