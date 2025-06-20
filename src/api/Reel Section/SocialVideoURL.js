import axios from "axios";
import { API_URL } from "../../../config";

export async function updateSocialMediaUrl(videoId, socialMediaUrl) {
  try {
    const response = await axios.put(
      `${API_URL}/User/videos.php`,
      {
        Video_ID: videoId,
        SocialMedia_URL: socialMediaUrl,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Failed to update SocialMedia URL:", error);

    if (error.response?.status === 401) {
      // Clear localStorage and redirect to login
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
    throw error;
  }
}

