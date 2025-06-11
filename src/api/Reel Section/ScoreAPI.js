import axios from "axios";
import { API_URL } from "../../../config";

export async function updateVideoScore(videoID, score) {
  try {
    const formData = new FormData();
    formData.append("Video_ID", videoID);
    formData.append("Score", score);
    
    const response = await axios.post(
      `${API_URL}/Nykaa/Admin/UpdateScore.php`,
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
    return error;
  }
}
