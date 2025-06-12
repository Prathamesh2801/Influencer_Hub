import axios from "axios";
import { API_URL } from "../../../config";

export async function getAllScores() {
  try {
    const response = await axios.get(`${API_URL}/Nykaa/leaderboard.php`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch credentials:", error);
    throw error;
  }
}
