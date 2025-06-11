import axios from "axios";
import { API_URL } from "../../../config";

export async function fetchAllReels() {
  try {
    const response = await axios.get(`${API_URL}/Nykaa/getVideos.php`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("Reels fetched successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Failed to fetch reels:", error);
    throw error;
  }
}
