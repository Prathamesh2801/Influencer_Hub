import axios from "axios";
import { API_URL } from "../../../config";

export async function repostVideo(
  videoId = null,
  videoFile,
  socialURL = null,
  taskID = null
) {
  // console.log("RepostVideoAPI called with:", {
  //   videoId,
  //   fileName: videoFile?.name,
  //   fileSize: videoFile?.size,
  //   fileType: videoFile?.type,
  // });

  try {
    const formData = new FormData();
    if (videoId !== null && videoId !== undefined) {
      // console.log('Adding Video_ID to formData:', videoId);
      formData.append("Video_ID", videoId);
    }
    if (taskID !== null && taskID !== undefined) {
      // console.log('Adding Video_ID to formData:', videoId);
      formData.append("Task_ID", taskID);
    }
    // console.log('Adding video file to formData');
    formData.append("video", videoFile);
    if (socialURL) {
      formData.append("SocialMedia_URL", socialURL);
    }

    const token = localStorage.getItem("token");
    // console.log('Using token:', token ? 'Token exists' : 'No token found');

    // console.log('Making API request to:', `${API_URL}/User/videos.php`);
    const response = await axios.post(`${API_URL}/User/videos.php`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    // console.error('RepostVideoAPI Error:', error);
    console.error("Error response:", error.response);

    if (error.response.status == 401) {
      localStorage.clear();
      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 5000);
    }
    return error;
  }
}
