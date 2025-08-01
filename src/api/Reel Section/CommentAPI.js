import axios from "axios";
import { API_URL } from "../../../config";

export async function getComments(videoID) {
  try {
    const response = await axios.get(`${API_URL}/comment.php`, {
      params: {
        Video_ID: videoID,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching comments:", error);
    if (error.response.status == 401) {
      localStorage.clear();
      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 5000);
    }
    return error;
  }
}

export async function addComment(videoID, comment) {
  try {
    const formData = new FormData();
    formData.append("Video_ID", videoID);
    formData.append("Comment", comment);

    const response = await axios.post(`${API_URL}/comment.php`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error adding comment:", error);
    if (error.response.status == 401) {
      localStorage.clear();
      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 5000);
    }
    return error;
  }
}
