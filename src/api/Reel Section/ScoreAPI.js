import axios from "axios";
import { API_URL } from "../../../config";

export async function updateVideoScore(
  videoID,
  Creativity = 0,
  Punctuality = 0,
  Content = 0
) {
  try {
    const formData = new FormData();
    formData.append("Video_ID", videoID);
    formData.append("Creativity", Creativity);
    formData.append("Punctuality", Punctuality);
    formData.append("Content", Content);

    const response = await axios.post(
      `${API_URL}/Admin/UpdateScore.php`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating video score:", error);
    // localStorage.clear();
    if (error.response.status == 401) {
      localStorage.clear();
      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 5000);
    }
    return error;
  }
}
