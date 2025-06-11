import axios from "axios";
import { API_URL } from "../../../config";

export async function repostVideo(videoId, videoFile) {
  try {
    const formData = new FormData();
    formData.append("Video_ID", videoId);
    formData.append("video", videoFile);
    
    const response = await axios.post(
      `${API_URL}/Nykaa/User/videos.php`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error reposting video:", error);
    return error;
  }
}
