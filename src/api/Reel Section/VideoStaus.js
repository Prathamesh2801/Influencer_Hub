import axios from "axios";
import { API_URL } from "../../../config";

export async function UpdateVideoStatus(videoID, status) {
  try {
    const formData = new FormData();
    formData.append("Video_ID", videoID);
    formData.append("Status", status);
    const response = await axios.post(
      `${API_URL}/Client/UpdateStatus.php`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error in updating Video Staus : ", error);
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
