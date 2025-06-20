import axios from "axios";
import { API_URL } from "../../../config";

export async function fetchProfileData() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(`${API_URL}/User/profile.php`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch profile:", error);

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

export async function updateProfileData(
  name,
  email,
  city,
  instaId,
  profileImage
) {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const formData = new FormData();

    // Append required fields (ensure they're not empty)
    formData.append("Name", name?.trim() || "");
    formData.append("Email", email?.trim() || "");
    formData.append("City", city?.trim() || "");
    formData.append("Insta_id", instaId?.trim() || "");

    // Only append profile image if one is selected
    if (profileImage && profileImage instanceof File) {
      formData.append("profile_image", profileImage);
    }

    const response = await axios.post(`${API_URL}/User/profile.php`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);

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
