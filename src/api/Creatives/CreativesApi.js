import axios from "axios";
import { API_URL } from "../../../config";

export async function getAllHomeCreatives() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(`${API_URL}/homepage.php`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch home Data :", error);

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

export async function addHomePageSection(formData) {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.post(`${API_URL}/homepage.php`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to add homepage section:", error);

    if (error.response?.status === 401) {
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    throw error;
  }
}
export async function removeHomePageSection(category, id) {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.delete(
      `${API_URL}/homepage.php?section=${category}&index=${id}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to delete homepage section:", error);

    if (error.response?.status === 401) {
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    throw error;
  }
}
