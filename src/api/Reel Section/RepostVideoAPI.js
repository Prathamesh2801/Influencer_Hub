import axios from "axios";
import { API_URL } from "../../../config";

export async function repostVideo(videoId = null, videoFile) {
  console.log('RepostVideoAPI called with:', {
    videoId,
    fileName: videoFile?.name,
    fileSize: videoFile?.size,
    fileType: videoFile?.type
  });

  try {
    const formData = new FormData();
    if (videoId !== null && videoId !== undefined) {
      // console.log('Adding Video_ID to formData:', videoId);
      formData.append("Video_ID", videoId);
    }
    // console.log('Adding video file to formData');
    formData.append("video", videoFile);

    const token = localStorage.getItem("token");
    // console.log('Using token:', token ? 'Token exists' : 'No token found');

    // console.log('Making API request to:', `${API_URL}/Nykaa/User/videos.php`);
    const response = await axios.post(
      `${API_URL}/Nykaa/User/videos.php`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    // console.log('API Response:', response.data);
    return response;
  } catch (error) {
    // console.error('RepostVideoAPI Error:', error);
    // console.error('Error response:', error.response);
    // console.error('Error status:', error.response?.status);
    // console.error('Error data:', error.response?.data);
    return error;
  }
}
