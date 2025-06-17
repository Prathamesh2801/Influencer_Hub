import axios from "axios";
import { API_URL } from "../../../config";

export async function repostVideo(
  videoId = null,
  videoFile,
  socialURL,
  taskID = null
) {
  console.log("RepostVideoAPI called with:", {
    videoId,
    fileName: videoFile?.name,
    fileSize: videoFile?.size,
    fileType: videoFile?.type,
  });

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
    formData.append("SocialMedia_URL", socialURL);

    const token = localStorage.getItem("token");
    // console.log('Using token:', token ? 'Token exists' : 'No token found');

    // console.log('Making API request to:', `${API_URL}/User/videos.php`);
    const response = await axios.post(`${API_URL}/User/videos.php`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    // console.log('API Response:', response.data);
    return response;
  } catch (error) {
    // console.error('RepostVideoAPI Error:', error);
    console.error('Error response:', error.response);
    // console.error('Error status:', error.response?.status);
    // console.error('Error data:', error.response?.data);
    // localStorage.clear();
    return error;
  }
}
