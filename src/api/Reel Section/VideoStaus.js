import axios from "axios";
import { API_URL } from "../../../config";

export async function UpdateVideoStatus(videoID, status) {
  try {
    const formData = new FormData();
    formData.append("Video_ID", videoID);
    formData.append("Status", status);
    const response = await axios.post(
      `${API_URL}/Nykaa/Client/updateStatus.php`,
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
    return error;
  }
}
